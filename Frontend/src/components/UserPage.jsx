// components/UserPage.jsx
import React from "react";
import { Layout } from "antd";
import Home from "./Home";

const { Content } = Layout;

const UserPage = () => {

  return (
    <Layout style={{ 
     
    }}>
      <Content style={{ 
        
      }}>
        <Home />
      </Content>
    </Layout>
  );
};

export default UserPage;
