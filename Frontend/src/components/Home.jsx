import React, { useState, useEffect } from "react";
import { Layout, Typography, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SendOutlined } from "@ant-design/icons";
import "../App.css";
import { auth } from "../firebase";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Home = () => {
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const fullPlaceholder = "Type your idea or question...";
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!auth.currentUser) {
      message.warning("Please login to generate code");
      navigate("/login");
      return;
    }
    if (input.trim()) {
      // Store the input in localStorage to be used in App component
      localStorage.setItem('generationPrompt', input);
      navigate("/app");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const typingSpeed = 89;
  const delayAfterTyping = 2000;

  useEffect(() => {
    let index = 0;
    let direction = 1; // 1 for typing, -1 for deleting

    const interval = setInterval(() => {
      setPlaceholder(fullPlaceholder.slice(0, index));

      if (direction === 1) {
        index++;
        if (index > (fullPlaceholder.length)) {
          direction = -1;
          index = (fullPlaceholder.length);
          setTimeout(() => {}, delayAfterTyping);
        }
      } else {
        index--;
        if (index < 0) {
          direction = 1;
          index = 0;
        }
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white">
      <Layout style={{
        backgroundImage: 'url("https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?semt=ais_hybrid&w=740")',
        minHeight: "100vh",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <Content style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
          <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
            <Title style={{ color: 'white' }} level={0.2}>AI Code & Chat Assistant</Title>
            <Paragraph style={{ color: 'white' }} type="secondary">
              Build faster with smart code generation and chat-driven development.
            </Paragraph>

            <div style={{ position: 'relative' }}>
              <TextArea
                className="textarea"
                size="large"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                autoSize={{ minRows: 4, maxRows: 10 }}
                style={{
                  margin: "1rem 0",
                  borderRadius: "20px",
                  padding: "20px",
                  paddingRight: "50px", // Make space for the button
                  backgroundColor: "rgb(39, 39, 37)",
                  color: "white",
                  fontSize: "1rem",
                  border: '1px solid gray',
                  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)'
                }}
              />
              <Button
                type="ghost"
                icon={<SendOutlined />}
                onClick={handleGenerate}
                style={{
                  position: 'absolute',
                  right: '10px',
                  bottom: '20px',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
