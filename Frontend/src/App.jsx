import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input, Button, Splitter, message, Alert, Spin } from "antd";
import sdk from "@stackblitz/sdk";
import MessageArea from "./components/MessagesArea";
import AppNavBar from "./components/AppNavBar";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { auth } from "./firebase";
import axios from "axios";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { API_BASE_URL, API_ENDPOINTS } from "./config/api";

const { TextArea } = Input;
const MAX_PROMPT_LENGTH = 1000;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
      patch: null,
      patchMsg: null,
    };
  }

  async componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
    try {
      const res = await axios.post(API_ENDPOINTS.autoFixError, {
        error_message: error.message,
        stack_trace: info.componentStack,
        file_content: "",
        filename: "",
      });
      this.setState({ patch: res.data.patch, patchMsg: res.data.message });
    } catch (e) {
      this.setState({ patchMsg: "Failed to get auto-fix suggestion." });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.info && this.state.info.componentStack}
          </details>
          {this.state.patchMsg && (
            <div style={{ marginTop: "20px" }}>
              <h3>Auto-fix Suggestion:</h3>
              <p>{this.state.patchMsg}</p>
              {this.state.patch && (
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    overflow: "auto",
                  }}
                >
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

const App = ({ prompt: initialPrompt, onClear }) => {
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
  const [hasPreview, setHasPreview] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Processing steps simulation
  const simulateProcessingSteps = useCallback(() => {
    const steps = [
      { icon: "🔍", text: "Analyzing your prompt...", status: "processing" },
      { icon: "🧠", text: "Understanding requirements...", status: "pending" },
      {
        icon: "🎨",
        text: "Designing component structure...",
        status: "pending",
      },
      { icon: "⚡", text: "Generating React components...", status: "pending" },
      { icon: "🎯", text: "Creating styles and layouts...", status: "pending" },
      { icon: "🔧", text: "Building application files...", status: "pending" },
      { icon: "✨", text: "Finalizing your app...", status: "pending" },
    ];

    setProcessingSteps(steps);
    setCurrentStep(0);

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setProcessingSteps((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status:
              idx < stepIndex
                ? "completed"
                : idx === stepIndex
                ? "processing"
                : "pending",
          }))
        );
        setCurrentStep(stepIndex);
      }
    }, 1500); // Update every 1.5 seconds

    return interval;
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setProcessingSteps([]);
    setCompletedSteps([]);

    // Add user message immediately
    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add processing message
    const processingMessage = {
      role: "assistant",
      content: "processing",
      isProcessing: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, processingMessage]);

    // Start the processing simulation
    const stepInterval = simulateProcessingSteps();

    setPreviewKey((prev) => prev + 1);

    try {
      const response = await axios.post(API_ENDPOINTS.generate, {
        prompt: prompt.trim(),
      });

      // Clear the processing simulation
      clearInterval(stepInterval);

      // Mark all steps as completed and store them
      const finalSteps = [
        { icon: "🔍", text: "Analyzing your prompt...", status: "completed" },
        {
          icon: "🧠",
          text: "Understanding requirements...",
          status: "completed",
        },
        {
          icon: "🎨",
          text: "Designing component structure...",
          status: "completed",
        },
        {
          icon: "⚡",
          text: "Generating React components...",
          status: "completed",
        },
        {
          icon: "🎯",
          text: "Creating styles and layouts...",
          status: "completed",
        },
        {
          icon: "🔧",
          text: "Building application files...",
          status: "completed",
        },
        { icon: "✨", text: "Finalizing your app...", status: "completed" },
      ];
      setProcessingSteps([]);
      setCompletedSteps(finalSteps);

      console.log("Backend response:", response.data);

      if (response.data.error) {
        setError(response.data.error);
        // Remove the processing message on error
        setMessages((prev) => prev.filter((msg) => !msg.isProcessing));
        setCompletedSteps([]);
        return;
      }

      // Replace the processing message with the completed response
      const newMessage = {
        role: "assistant",
        content: "",
        isCompleted: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) =>
        prev.map((msg) => (msg.isProcessing ? newMessage : msg))
      );

      if (response.data.files) {
        // Prepare files for StackBlitz
        const files = {
          "src/App.js": response.data.files["src/App.js"] || "",
          "src/index.js":
            response.data.files["src/index.js"] ||
            `
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
          "src/App.css": response.data.files["src/App.css"] || "",
          "src/index.css": response.data.files["src/index.css"] || "",
          // 'package.json': response.data.files['package.json'] || '',
          "public/index.html":
            response.data.files["public/index.html"] ||
            `
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
          "package.json": `
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
  }
}
`,
        };

        Object.entries(response.data.files).forEach(([filename, content]) => {
          if (!files[filename]) {
            files[filename] = content;
          }
        });

        console.log("Files for StackBlitz:", files);

        if (!containerRef.current) return;
        try {
          // Clear previous content
          //            containerRef.current.innerHTML = ''; // existing
          // containerRef.current.removeAttribute('data-sb'); // ensure clean slate

          await sdk.embedProject(
            containerRef.current,
            {
              title: "Generated App Preview",
              description: "Preview of the generated application",
              template: "create-react-app",
              files: files,
              settings: {
                compile: {
                  triggerOnSave: true,
                  clearConsole: false,
                },
              },
            },
            {
              height: "100%",
              width: "100%",
              hideNavigation: true,
              hideDevTools: false,
              view: "preview",
              forceEmbedLayout: true,
            }
          );
          console.log("StackBlitz preview initialized successfully");
          setPrompt(""); // Clear the prompt after generation
        } catch (error) {
          console.error("Error initializing StackBlitz:", error);
          setError("Failed to initialize preview: " + error.message);
        }
      } else {
        console.warn("No files received from backend");
      }
    } catch (err) {
      console.error("Generation error:", err);
      clearInterval(stepInterval);
      setError(
        err.message || "An error occurred while generating the response"
      );
      // Remove the processing message on error and add error message
      setMessages((prev) => prev.filter((msg) => !msg.isProcessing));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      setProcessingSteps([]);
      setHasPreview(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          theme === "dark"
            ? "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)"
            : "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .generate-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease !important;
          }
          .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }
          .clear-btn {
            transition: all 0.3s ease !important;
          }
          .clear-btn:hover {
            transform: scale(1.05);
          }
          .prompt-container {
            animation: fadeInUp 0.5s ease-out;
          }
          .preview-panel {
            animation: fadeInUp 0.6s ease-out;
          }
        `}
      </style>
      <AppNavBar />
      <div
        style={{
          paddingTop: "65px",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div style={{ height: "100%", padding: "0" }}>
          <Splitter
            split="vertical"
            defaultSize={400}
            minSize={300}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            {/* LEFT PANEL */}
            <Splitter.Panel>
              <div
                className="prompt-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRight: `1px solid ${
                    theme === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)"
                  }`,
                  background:
                    theme === "dark"
                      ? "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)"
                      : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
                }}
              >
                {/* Message Area */}
                <div
                  style={{
                    flex: 1,
                    overflow: "auto",
                    padding: "16px",
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  <MessageArea
                    messages={messages}
                    processingSteps={processingSteps}
                    completedSteps={completedSteps}
                    onClear={() => setMessages([])}
                    theme={theme}
                  />
                  {error && (
                    <Alert
                      message="Error"
                      description={error}
                      type="error"
                      showIcon
                      style={{
                        marginTop: "16px",
                        animation: "fadeInUp 0.3s ease-out",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  {warning && (
                    <Alert
                      message="Warning"
                      description={warning}
                      type="warning"
                      showIcon
                      style={{
                        marginTop: "16px",
                        animation: "fadeInUp 0.3s ease-out",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>

                {/* Prompt Area */}
                <div
                  style={{
                    padding: "16px",
                    margin: "12px",
                    border: `1px solid ${
                      theme === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.08)"
                    }`,
                    borderRadius: "12px",
                    background:
                      theme === "dark"
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.02)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      theme === "dark"
                        ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                        : "0 4px 20px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {/* Compact Input Container */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg, rgba(45, 55, 72, 0.6) 0%, rgba(26, 32, 44, 0.8) 100%)"
                          : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      borderRadius: "12px",
                      padding: "6px 6px 6px 16px",
                      border:
                        theme === "dark"
                          ? "1px solid rgba(102, 126, 234, 0.3)"
                          : "1px solid rgba(102, 126, 234, 0.2)",
                      boxShadow:
                        theme === "dark"
                          ? "0 4px 16px rgba(102, 126, 234, 0.1)"
                          : "0 4px 16px rgba(102, 126, 234, 0.08)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Text Input */}
                    <TextArea
                      className="textarea"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to build..."
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      style={{
                        flex: 1,
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "14px",
                        color: theme === "dark" ? "#fff" : "#1a1a2e",
                        resize: "none",
                        padding: "8px 0",
                        lineHeight: "1.4",
                      }}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                    />

                    {/* Send Button */}
                    <Button
                      className="generate-btn"
                      type="primary"
                      onClick={handleGenerate}
                      loading={loading}
                      disabled={!prompt.trim() || loading}
                      style={{
                        width: "36px",
                        height: "36px",
                        minWidth: "36px",
                        borderRadius: "10px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: prompt.trim()
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : theme === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.08)",
                        border: "none",
                        boxShadow: prompt.trim()
                          ? "0 2px 8px rgba(102, 126, 234, 0.4)"
                          : "none",
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                    >
                      {loading ? (
                        <Spin size="small" />
                      ) : (
                        <SendOutlined
                          style={{
                            fontSize: "16px",
                            color: prompt.trim()
                              ? "#fff"
                              : theme === "dark"
                              ? "rgba(255,255,255,0.3)"
                              : "rgba(0,0,0,0.3)",
                            transform: "rotate(-45deg)",
                          }}
                        />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Splitter.Panel>

            {/* RIGHT PANEL */}
            <Splitter.Panel>
              <div
                key={previewKey}
                className="preview-panel"
                style={{
                  height: "100%",
                  background:
                    theme === "dark"
                      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  position: "relative",
                  border: `1px solid ${
                    theme === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)"
                  }`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    theme === "dark"
                      ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                      : "0 8px 32px rgba(0, 0, 0, 0.08)",
                }}
              >
                {loading && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    >
                      <Spin size="large" style={{ color: "#fff" }} />
                    </div>
                    <p
                      style={{
                        marginTop: "10px",
                        color: theme === "dark" ? "#fff" : "#1a1a2e",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      ✨ Creating your app...
                    </p>
                  </div>
                )}

                <div
                  ref={containerRef}
                  style={{
                    height: "100%",
                    width: "100%",
                    opacity: loading ? 0.3 : 1,
                    pointerEvents: loading ? "none" : "auto",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {!hasPreview && !loading && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "24px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        <span style={{ fontSize: "48px" }}>🚀</span>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <h3
                          style={{
                            color: theme === "dark" ? "#fff" : "#1a1a2e",
                            fontSize: "20px",
                            fontWeight: 600,
                            marginBottom: "8px",
                          }}
                        >
                          Live Preview
                        </h3>
                        <p
                          style={{
                            color:
                              theme === "dark"
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(0,0,0,0.5)",
                            fontSize: "14px",
                            maxWidth: "280px",
                          }}
                        >
                          Your generated app will appear here in real-time
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Splitter.Panel>
          </Splitter>
        </div>
      </div>
    </div>
  );
};

export default App;
