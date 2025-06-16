import React, { useState } from 'react';
import { Modal, Layout, Menu, Button, Radio } from 'antd';
import { UserOutlined, CreditCardOutlined, CrownOutlined, LogoutOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';

const { Sider, Content } = Layout;

const SettingsModal = ({ isOpen, onClose }) => {
  const [selectedKey, setSelectedKey] = useState('account');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Account',
    },
    {
      key: 'appearance',
      icon: <BulbOutlined />,
      label: 'Appearance',
      children: [
        {
          key: 'appearance-light',
          label: 'Light',
        },
        {
          key: 'appearance-dark',
          label: 'Dark',
        },
        {
          key: 'appearance-system',
          label: 'System',
        },
      ],
    },
    {
      key: 'plans',
      icon: <CrownOutlined />,
      label: 'Plans',
    },
    {
      key: 'billing',
      icon: <CreditCardOutlined />,
      label: 'Billing',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('appearance-')) {
      const newTheme = key.split('-')[1];
      setTheme(newTheme);
    } else {
      setSelectedKey(key);
    }
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'account':
        return (
          <div>
            <h2>Account Settings</h2>
            <p>Manage your account preferences and personal information.</p>
          </div>
        );
      case 'plans':
        return (
          <div>
            <h2>Subscription Plans</h2>
            <p>View and manage your subscription plan.</p>
          </div>
        );
      case 'billing':
        return (
          <div>
            <h2>Billing Information</h2>
            <p>Manage your billing details and payment methods.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{ padding: 0, height: '600px' }}
    >
      <Layout style={{ height: '100%' }}>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left' }}
            >
              Logout
            </Button>
          </div>
        </Sider>
        <Content style={{ padding: '24px', background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Modal>
  );
};

export default SettingsModal; 