// components/UserPage.jsx
import React from "react";
import { Layout, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Home from "./Home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const UserPage = ({user}) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user]);

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
