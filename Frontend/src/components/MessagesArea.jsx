import React, { useEffect, useRef, useState } from "react";
import { Typography, Avatar, Collapse } from "antd";
import {
  UserOutlined,
  RobotOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  ClockCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Panel } = Collapse;

const MessageArea = ({
  messages,
  onClear,
  theme,
  processingSteps = [],
  completedSteps = [],
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, processingSteps, completedSteps]);

  const getMessageContainerStyle = (role) => {
    const isUser = role === "user";
    return {
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "16px",
      animation: "fadeIn 0.3s ease-in-out",
    };
  };

  const getBubbleStyle = (role) => {
    const isUser = role === "user";
    return {
      maxWidth: "75%",
      padding: "14px 18px",
      borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
      color: isUser ? "#fff" : theme === "dark" ? "#e6e6e6" : "#1a1a2e",
      background: isUser
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : theme === "dark"
        ? "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)"
        : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      boxShadow: isUser
        ? "0 4px 15px rgba(102, 126, 234, 0.3)"
        : theme === "dark"
        ? "0 4px 15px rgba(0, 0, 0, 0.3)"
        : "0 4px 15px rgba(0, 0, 0, 0.08)",
      border: isUser
        ? "none"
        : theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.05)",
    };
  };

  const getAvatarStyle = (role) => {
    const isUser = role === "user";
    return {
      backgroundColor: isUser
        ? "#667eea"
        : theme === "dark"
        ? "#00b894"
        : "#00cec9",
      boxShadow: isUser
        ? "0 3px 10px rgba(102, 126, 234, 0.4)"
        : "0 3px 10px rgba(0, 206, 201, 0.4)",
      flexShrink: 0,
    };
  };

  const getTimestampStyle = () => ({
    fontSize: "11px",
    color:
      theme === "dark" ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
    marginTop: "6px",
    display: "block",
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      style={{
        overflowY: "auto",
        padding: "20px",
        height: "100%",
        background:
          theme === "dark"
            ? "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes stepSlideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
          @keyframes dotPulse {
            0%, 80%, 100% { transform: scale(0); opacity: 0; }
            40% { transform: scale(1); opacity: 1; }
          }
          .message-bubble:hover {
            transform: translateY(-1px);
            transition: transform 0.2s ease;
          }
          .processing-step {
            animation: stepSlideIn 0.4s ease-out forwards;
          }
          .step-icon-processing {
            animation: spin 1s linear infinite;
          }
          .step-icon-completed {
            animation: pulse 0.3s ease-out;
          }
        `}
      </style>

      {messages.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <RobotOutlined style={{ fontSize: "36px", color: "#fff" }} />
          </div>
          <Text
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: theme === "dark" ? "#fff" : "#1a1a2e",
            }}
          >
            Start a Conversation
          </Text>
          <Text
            style={{
              color:
                theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            Enter a prompt below to generate your application. I'll help you
            build something amazing!
          </Text>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {messages.map((msg, index) => (
            <div key={index} style={getMessageContainerStyle(msg.role)}>
              <Avatar
                size={36}
                icon={
                  msg.role === "user" ? <UserOutlined /> : <RobotOutlined />
                }
                style={getAvatarStyle(msg.role)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "75%",
                }}
              >
                <Text
                  strong
                  style={{
                    marginBottom: "6px",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color:
                      msg.role === "user"
                        ? "#667eea"
                        : theme === "dark"
                        ? "#00cec9"
                        : "#00b894",
                  }}
                >
                  {msg.role === "user" ? "You" : "AI Assistant"}
                </Text>

                {/* Processing State with Steps */}
                {msg.isProcessing ? (
                  <div
                    style={{
                      ...getBubbleStyle(msg.role),
                      minWidth: "320px",
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        style={{
                          color: theme === "dark" ? "#fff" : "#1a1a2e",
                          fontSize: "15px",
                          fontWeight: 600,
                        }}
                      >
                        🚀 Building your app...
                      </Text>
                    </div>

                    {processingSteps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="processing-step"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px 0",
                          borderTop:
                            stepIndex > 0
                              ? `1px solid ${
                                  theme === "dark"
                                    ? "rgba(255,255,255,0.1)"
                                    : "rgba(0,0,0,0.05)"
                                }`
                              : "none",
                          animationDelay: `${stepIndex * 0.1}s`,
                          opacity: step.status === "pending" ? 0.4 : 1,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              step.status === "completed"
                                ? "linear-gradient(135deg, #00b894 0%, #00cec9 100%)"
                                : step.status === "processing"
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : theme === "dark"
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.05)",
                            boxShadow:
                              step.status !== "pending"
                                ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                                : "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {step.status === "completed" ? (
                            <CheckCircleFilled
                              className="step-icon-completed"
                              style={{ color: "#fff", fontSize: "14px" }}
                            />
                          ) : step.status === "processing" ? (
                            <LoadingOutlined
                              className="step-icon-processing"
                              style={{ color: "#fff", fontSize: "14px" }}
                            />
                          ) : (
                            <ClockCircleOutlined
                              style={{
                                color:
                                  theme === "dark"
                                    ? "rgba(255,255,255,0.4)"
                                    : "rgba(0,0,0,0.3)",
                                fontSize: "14px",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text
                            style={{
                              color:
                                step.status === "pending"
                                  ? theme === "dark"
                                    ? "rgba(255,255,255,0.4)"
                                    : "rgba(0,0,0,0.4)"
                                  : theme === "dark"
                                  ? "#e6e6e6"
                                  : "#1a1a2e",
                              fontSize: "13px",
                              fontWeight:
                                step.status === "processing" ? 600 : 400,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {step.icon} {step.text}
                          </Text>
                        </div>
                        {step.status === "completed" && (
                          <Text
                            style={{
                              fontSize: "11px",
                              color: "#00b894",
                              fontWeight: 500,
                            }}
                          >
                            ✓ Done
                          </Text>
                        )}
                      </div>
                    ))}

                    {/* Animated dots while processing */}
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        justifyContent: "center",
                        marginTop: "16px",
                        padding: "8px",
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            animation: `dotPulse 1.4s ease-in-out ${
                              i * 0.16
                            }s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : msg.isCompleted && completedSteps.length > 0 ? (
                  /* Completed state with success symbol and collapsible steps */
                  <div
                    style={{
                      ...getBubbleStyle(msg.role),
                      minWidth: "320px",
                    }}
                  >
                    {/* Success Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background:
                          "linear-gradient(135deg, rgba(0, 184, 148, 0.15) 0%, rgba(0, 206, 201, 0.15) 100%)",
                        borderRadius: "12px",
                        border: "1px solid rgba(0, 184, 148, 0.3)",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 20px rgba(0, 184, 148, 0.4)",
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      >
                        <CheckCircleFilled
                          style={{ color: "#fff", fontSize: "24px" }}
                        />
                      </div>
                      <div>
                        <Text
                          style={{
                            color: "#00b894",
                            fontSize: "16px",
                            fontWeight: 700,
                            display: "block",
                          }}
                        >
                          🎉 Build Complete!
                        </Text>
                        <Text
                          style={{
                            color:
                              theme === "dark"
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(0,0,0,0.6)",
                            fontSize: "12px",
                          }}
                        >
                          Your app is ready in the preview panel
                        </Text>
                      </div>
                    </div>

                    {/* Collapsible Steps Dropdown */}
                    <Collapse
                      ghost
                      expandIcon={({ isActive }) => (
                        <DownOutlined
                          rotate={isActive ? 180 : 0}
                          style={{
                            color: theme === "dark" ? "#00cec9" : "#00b894",
                            fontSize: "12px",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      )}
                      style={{
                        marginTop: "12px",
                        background: "transparent",
                      }}
                    >
                      <Panel
                        header={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <CheckCircleFilled
                              style={{ color: "#00b894", fontSize: "14px" }}
                            />
                            <Text
                              style={{
                                color: theme === "dark" ? "#00cec9" : "#00b894",
                                fontSize: "13px",
                                fontWeight: 600,
                              }}
                            >
                              View build steps ({completedSteps.length}{" "}
                              completed)
                            </Text>
                          </div>
                        }
                        key="1"
                        style={{
                          border: `1px solid ${
                            theme === "dark"
                              ? "rgba(0, 206, 201, 0.2)"
                              : "rgba(0, 184, 148, 0.2)"
                          }`,
                          borderRadius: "10px",
                          background:
                            theme === "dark"
                              ? "rgba(0, 206, 201, 0.05)"
                              : "rgba(0, 184, 148, 0.05)",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ padding: "4px 0" }}>
                          {completedSteps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="processing-step"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 4px",
                                borderTop:
                                  stepIndex > 0
                                    ? `1px solid ${
                                        theme === "dark"
                                          ? "rgba(255,255,255,0.08)"
                                          : "rgba(0,0,0,0.04)"
                                      }`
                                    : "none",
                              }}
                            >
                              <div
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background:
                                    "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
                                  flexShrink: 0,
                                }}
                              >
                                <CheckCircleFilled
                                  style={{ color: "#fff", fontSize: "11px" }}
                                />
                              </div>
                              <Text
                                style={{
                                  color:
                                    theme === "dark" ? "#e6e6e6" : "#1a1a2e",
                                  fontSize: "12px",
                                  flex: 1,
                                }}
                              >
                                {step.icon} {step.text}
                              </Text>
                              <Text
                                style={{
                                  fontSize: "10px",
                                  color: "#00b894",
                                  fontWeight: 500,
                                }}
                              >
                                ✓
                              </Text>
                            </div>
                          ))}
                        </div>
                      </Panel>
                    </Collapse>
                  </div>
                ) : (
                  /* Regular message bubble */
                  <div
                    className="message-bubble"
                    style={getBubbleStyle(msg.role)}
                  >
                    <Text
                      style={{
                        color: "inherit",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      {msg.content}
                    </Text>
                  </div>
                )}

                {msg.timestamp && !msg.isProcessing && (
                  <Text style={getTimestampStyle()}>
                    {formatTime(msg.timestamp)}
                  </Text>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageArea;
