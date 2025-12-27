import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Menu, Button, Modal, message } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useTheme } from "../context/ThemeContext";
import { pushToGitHub, deployToVercel } from "../utils/deployment";

const { Header } = Layout;

const AppNavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDeploy = () => {
    setIsDeployModalOpen(true);
  };

  const handleDeployConfirm = async () => {
    setDeploying(true);
    try {
      const repoName = `ai-generated-app-${Date.now()}`;
      const githubUrl = await pushToGitHub(window.location.href, repoName);
      const deployUrl = await deployToVercel(githubUrl);
      message.success("Deployment successful!");
      window.open(deployUrl, "_blank");
    } catch (error) {
      message.error("Deployment failed: " + error.message);
    } finally {
      setDeploying(false);
      setIsDeployModalOpen(false);
    }
  };

  // Appearance submenu for theme selection
  const appearanceMenu = (
    <Menu selectedKeys={[theme]} onClick={({ key }) => setTheme(key)}>
      <Menu.Item key="light">Light</Menu.Item>
      <Menu.Item key="dark">Dark</Menu.Item>
      <Menu.Item key="system">System</Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu style={{ minWidth: "200px" }}>
      <Menu.Item key="profile" className="profile-menu-item">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 0",
          }}
        >
          <Avatar
            src={user?.photoURL}
            icon={!user?.photoURL && <UserOutlined />}
            style={{
              backgroundColor: !user?.photoURL ? "#1890ff" : "transparent",
              width: "32px",
              height: "32px",
            }}
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = "none";
            }}
            alt={user?.displayName || user?.email || "User"}
          />
          <span style={{ fontWeight: "500" }}>
            {user?.displayName || user?.email || "User"}
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="Dashboard">
        <Link style={{ textDecoration: "none" }} to="/userpage">
          Go to Dashboard
        </Link>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div
        className="m-1"
        style={{
          marginBottom: "10px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0d1b2a 100%)",
        }}
      >
        <Header
          style={{
            background:
              "linear-gradient(135deg, #02062aff 0%, #1a1a2e 50%, #0d1b2a 100%)",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: "64px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Left side: User Profile */}
          <div>
            {user ? (
              <Dropdown
                overlay={menu}
                placement="bottomRight"
                trigger={["hover"]}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    src={user?.photoURL}
                    icon={!user?.photoURL && <UserOutlined />}
                    style={{
                      backgroundColor: !user?.photoURL
                        ? "#1890ff"
                        : "transparent",
                      width: "32px",
                      height: "32px",
                    }}
                    crossOrigin="anonymous"
                    alt={user?.displayName || user?.email}
                  />
                  <span
                    style={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {user?.displayName || user?.email}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  type="default"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#ffffff",
                    fontWeight: 600,
                    marginRight: 8,
                  }}
                >
                  <Link
                    to="/login"
                    style={{ color: "#ffffff", textDecoration: "none" }}
                  >
                    Login
                  </Link>
                </Button>
                <Button
                  type="primary"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  <Link
                    to="/signup"
                    style={{ color: "#ffffff", textDecoration: "none" }}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Right side: Deploy Button */}
          <div>
            {user && (
              <div className="m-3 ">
                <a href="https://mvp-platform-project.onrender.com/download">
                  <Button
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      marginRight: "20px",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    Download App
                  </Button>
                </a>

                {/* <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={handleDeploy}
              loading={deploying}
              style={{
                backgroundColor: '#1890ff',
                border: 'none',
                fontWeight: 'bold',
              }}
            >
              Deploy
            </Button> */}
              </div>
            )}
          </div>
        </Header>
      </div>
    </>
  );
};

export default AppNavBar;
