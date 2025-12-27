import { Button, Layout, Avatar, Dropdown, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const { Header } = Layout;

export default function NavBar({ isLoggedIn = false, user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  console.log("NavBar user object:", user); // Debug log for entire user object
  console.log("User photo URL:", user?.photoURL); // Debug log for photo URL
  console.log("User photo_url:", user?.photo_url); // Debug log for photo_url
  console.log("User email:", user?.email); // Debug log for email

  // Debug image loading
  useEffect(() => {
    if (user?.photoURL) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => console.log("Image loaded successfully");
      img.onerror = (e) => console.log("Image load error:", e);
      img.src = user.photoURL;
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
              console.log("Avatar load error:", e);
              e.target.style.display = "none";
            }}
            alt={user?.displayName || user?.email || "User"}
          />
          <span style={{ fontWeight: "500" }}>
            {user?.displayName || user?.email || "User"}
          </span>
        </div>
      </Menu.Item>
      {/* <Menu.SubMenu key="appearance" icon={<AppstoreOutlined />} title="Appearance">
        {appearanceMenu.props.children}
      </Menu.SubMenu> */}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0d1b2a 100%)",
      }}
    >
      <Header
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0d1b2a 100%)",
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
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Left side: Logo + Nav links */}
        <div
          className="d-flex gap-4"
          style={{
            color: "",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            AI Code Generator
          </Link>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/docs" style={{ color: "white", textDecoration: "none" }}>
            Docs
          </Link>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", textDecoration: "none" }}
          >
            GitHub
          </a>
        </div>

        {/* Right side: Auth buttons or Avatar */}
        <div>
          {isLoggedIn && user ? (
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
                  marginRight: "20px",
                }}
              >
                <Avatar
                  src={user?.photoURL || <UserOutlined />}
                  icon={!user?.photoURL && <UserOutlined />}
                  style={{
                    backgroundColor: !user?.photoURL ? "#1890ff" : "blue",
                    width: "32px",
                    height: "32px",
                  }}
                  crossOrigin="anonymous"
                  alt={user?.displayName || user?.email}
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {user?.displayName || user?.email}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div className="d-flex gap-3">
              <Button
                type="primary"
                style={{
                  backgroundColor: "white",
                  border: "none",
                  color: "black",
                  fontWeight: "bold",
                  marginRight: 8,
                }}
              >
                <Link
                  to="/login"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Login
                </Link>
              </Button>
              <Button
                style={{
                  backgroundColor: "rgb(39, 39, 37)",
                  border: "1px solid gray",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <Link
                  to="/signup"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Get Started
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Header>
    </div>
  );
}
