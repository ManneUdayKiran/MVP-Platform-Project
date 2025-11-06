import React, { useEffect, useRef } from 'react';
import { Typography, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MessageArea = ({ messages, theme }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBubbleStyle = (role) => {
    const isUser = role === 'user';
    return {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '16px',
      marginBottom: '10px',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: isUser
        ? theme === 'dark' ? 'rgba(255, 255, 255, 0.81)' : '#e6f7ff'
        : theme === 'dark' ? 'teal' : '#f4f4f4',
      alignSelf: isUser ? 'flex-start' : 'flex-end',
    };
  };

  return (
    <div
      style={{
        overflowY: 'auto',
        padding: '1rem',
        height: '100%',
        background: theme === 'dark' ? 'rgb(28,28,28)' : '#fff',
        display: 'flex',
        flexDirection: 'column',
        color: theme === 'dark' ? 'white' : 'white',
      }}
    >
      {/* {messages.length > 0 && (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={onClear}
          style={{
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-end',
            zIndex: 1,
            color: '#ff4d4f',
            background: theme === 'dark' ? '#1f1f1f' : '#fff',
            border: theme === 'dark' ? '1px solid #434343' : '1px solid #d9d9d9',
            marginBottom: '10px',
          }}
        >
          Clear
        </Button>
      )} */}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={getBubbleStyle(msg.role)}>
            <Text strong style={{ display: 'block', marginBottom: '6px' }}>
              {msg.role === 'user' ? 'You' : 'AI'}
            </Text>
            <Text>{msg.content}</Text>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageArea;
