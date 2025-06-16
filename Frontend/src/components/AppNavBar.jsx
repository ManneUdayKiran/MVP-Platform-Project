import React, { useState, useEffect } from 'react';
import { Layout, Avatar, Dropdown, Menu, Button, Modal, message } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, AppstoreOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import SettingsModal from './SettingsModal';
import { pushToGitHub, deployToVercel } from '../utils/deployment';

const { Header } = Layout;

const AppNavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
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
      message.success('Deployment successful!');
      window.open(deployUrl, '_blank');
    } catch (error) {
      message.error('Deployment failed: ' + error.message);
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
    <Menu style={{ minWidth: '200px' }}>
      <Menu.Item key="profile" className="profile-menu-item">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
          <Avatar
            src={user?.photoURL}
            icon={!user?.photoURL && <UserOutlined />}
            style={{ 
              backgroundColor: !user?.photoURL ? '#1890ff' : 'transparent',
              width: '32px',
              height: '32px'
            }}
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
            alt={user?.displayName || user?.email || "User"}
          />
          <span style={{ fontWeight: '500' }}>{user?.displayName || user?.email || "User"}</span>
        </div>
      </Menu.Item>
      <Menu.SubMenu key="appearance" icon={<AppstoreOutlined />} title="Appearance">
        {appearanceMenu.props.children}
      </Menu.SubMenu>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => setIsSettingsModalOpen(true)}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
    <div className='m-1' style={{marginBottom: '10px',backgroundColor: 'black'}}>

      <Header
        style={{
            backgroundColor: 'black',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '64px',
          borderBottom: `1px solid ${theme === 'dark' ? '#434343' : '#d9d9d9'}`,
          marginBottom: '10px',
        }}
      >
        {/* Left side: User Profile */}
        <div>
          {user ? (
            <Dropdown overlay={menu} placement="bottomRight" trigger={['hover']}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
              }}>
                <Avatar
                  src={user?.photoURL}
                  icon={!user?.photoURL && <UserOutlined />}
                  style={{ 
                    backgroundColor: !user?.photoURL ? '#1890ff' : 'transparent',
                    width: '32px',
                    height: '32px'
                  }}
                  crossOrigin="anonymous"
                  alt={user?.displayName || user?.email}
                />
                <span style={{ 
                  color:theme === 'dark' ? 'white' : 'black', 
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {user?.displayName || user?.email}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="primary"
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  color: 'black',
                  fontWeight: 'bold',
                  marginRight: 8,
                }}
              >
                <Link to="/login" style={{ color: 'black', textDecoration: 'none' }}>
                  Login
                </Link>
              </Button>
              <Button
                style={{
                  backgroundColor: 'rgb(39, 39, 37)',
                  border: '1px solid gray',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>
                  Get Started
                </Link>
              </Button>
            </div>
          )}
        </div>

       

        {/* Right side: Deploy Button */}
        <div>
          {user && (
            <Button
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
            </Button>
          )}
        </div>
      </Header>

      <Modal
        title="Deploy Your Application"
        open={isDeployModalOpen}
        onOk={handleDeployConfirm}
        onCancel={() => setIsDeployModalOpen(false)}
        confirmLoading={deploying}
      >
        <div style={{ marginBottom: '20px' }}>
          <p>Your application will be deployed to Vercel. This process will:</p>
          <ol>
            <li>Push your code to GitHub</li>
            <li>Create a new Vercel project</li>
            <li>Deploy your application</li>
            <li>Provide you with a live URL</li>
          </ol>
          <p>Make sure you have:</p>
          <ul>
            <li>A GitHub account connected</li>
            <li>A Vercel account connected</li>
            <li>All your changes saved</li>
          </ul>
        </div>
      </Modal>

      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
                  </div>
        </>
  );
};

export default AppNavBar; 