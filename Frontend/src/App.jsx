import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input, Button, Splitter, message, Alert, Spin } from "antd";
import sdk from "@stackblitz/sdk";
import MessageArea from "./components/MessagesArea";
import AppNavBar from "./components/AppNavBar";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { auth } from './firebase';
import axios from 'axios';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

const { TextArea } = Input;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const MAX_PROMPT_LENGTH = 1000;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null, patch: null, patchMsg: null };
  }

  async componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    try {
      const res = await axios.post('/api/auto-fix-error', {
        error_message: error.message,
        stack_trace: info.componentStack,
        file_content: '',
        filename: '',
      });
      this.setState({ patch: res.data.patch, patchMsg: res.data.message });
    } catch (e) {
      this.setState({ patchMsg: 'Failed to get auto-fix suggestion.' });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.info && this.state.info.componentStack}
          </details>
          {this.state.patchMsg && (
            <div style={{ marginTop: '20px' }}>
              <h3>Auto-fix Suggestion:</h3>
              <p>{this.state.patchMsg}</p>
              {this.state.patch && (
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto'
                }}>
                  {this.state.patch}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const App = ({ prompt: initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [warning, setWarning] = useState(null);
  const [placeholderVars, setPlaceholderVars] = useState([]);
  const [userValues, setUserValues] = useState({});
  const [editingVar, setEditingVar] = useState(null);
  const [filesToEmbed, setFilesToEmbed] = useState({});
  const [previewKey, setPreviewKey] = useState(0);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        prompt: prompt.trim()
      });

      console.log('Backend response:', response.data);

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      const newMessage = {
        role: 'assistant',
        content: response.data.text_response || 'Generated successfully!',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMessage]);
      
      if (response.data.files) {
        // Prepare files for StackBlitz
        const files = {
          'src/App.js': response.data.files['src/App.js'] || '',
          'src/index.js': response.data.files['src/index.js'] || `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
          'src/App.css': response.data.files['src/App.css'] || '',
          'src/index.css': response.data.files['src/index.css'] || '',
          'public/index.html': response.data.files['public/index.html'] || `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Generated App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
          'package.json': {
            dependencies: {
              'react': '^18.2.0',
              'react-dom': '^18.2.0'
            }
          }
        };

        // Add any additional files from the backend
        Object.entries(response.data.files).forEach(([filename, content]) => {
          if (!files[filename]) {
            files[filename] = content;
          }
        });

        console.log('Files for StackBlitz:', files);

        if (containerRef.current) {
          try {
            // Clear previous content
            containerRef.current.innerHTML = '';
            
            await sdk.embedProject(
              containerRef.current,
              {
                title: 'Generated App Preview',
                description: 'Preview of the generated application',
                template: 'create-react-app',
                files: files,
                settings: {
                  compile: {
                    triggerOnSave: false,
                    clearConsole: false
                  }
                }
              },
              {
                height: '100%',
                width: '100%',
                hideNavigation: true,
                hideDevTools: false,
                view: 'preview',
                forceEmbedLayout: true
              }
            );
            console.log('StackBlitz preview initialized successfully');
          } catch (error) {
            console.error('Error initializing StackBlitz:', error);
            setError('Failed to initialize preview: ' + error.message);
          }
        }
      } else {
        console.warn('No files received from backend');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'An error occurred while generating the response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="" style={{  }}>
      <AppNavBar />
      <div className="mt-5">
       
          <div className=" m-1 p-1 left-panel" >
            
          <Splitter
  split="vertical"
  defaultSize={400}
  minSize={300}
  style={{
    height: 'calc(100vh - 64px)', // Navbar height
    width: '100%',
  }}
>
  {/* LEFT PANEL */}
  <Splitter.Panel>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: `1px solid ${theme === 'dark' ? '#434343' : '#d9d9d9'}`,
      backgroundColor: theme === 'dark' ? '#141414' : '#fff'
    }}>
      {/* Message Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <MessageArea messages={messages} onClear={() => setMessages([])} theme={theme} />
        {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: '16px' }} />}
        {warning && <Alert message="Warning" description={warning} type="warning" showIcon style={{ marginTop: '16px' }} />}
      </div>

      {/* Prompt Area */}
      <div style={{ padding: '16px', borderTop: `1px solid ${theme === 'dark' ? '#434343' : '#d9d9d9'}` }}>
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '16px',
            color: theme === 'dark' ? '#fff' : '#000',
          }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
          <Button
            type="primary"
            onClick={handleGenerate}
            loading={loading}
          >
            Generate
          </Button>
          <Button
            onClick={() => setPrompt('')}
            style={{
              borderColor: theme === 'dark' ? '#434343' : '#d9d9d9',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  </Splitter.Panel>

  {/* RIGHT PANEL */}
  <Splitter.Panel>
    <div style={{
      height: '100%',
      background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
      position: 'relative',
      border: `1px solid ${theme === 'dark' ? '#434343' : '#d9d9d9'}`,
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div
        key={previewKey}
        ref={containerRef}
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  </Splitter.Panel>
</Splitter>

          </div>
      </div>
    </div>
  );
};

export default App;
