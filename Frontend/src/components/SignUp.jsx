import React from "react";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { GoogleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { auth, provider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

import "../App.css";


const { Title, Text } = Typography;

const SignUp = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const handleGoogleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          console.log("User Info:", user);
          // Optionally redirect or save user info
        } catch (error) {
          console.error("Google sign-in error:", error);
        }
      };
    const onFinish = async (values) => {
      setError(null);
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        // Optionally redirect to login or app page
        window.location.href = "/app";
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div
      style={{
        backgroundColor: "#0d0d0d",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          padding: 30,
          backgroundColor: "#0d0d0d",
          borderRadius: 8,
        }}
      >
        {/* <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Loom_Logo_2022.svg"
            alt="logo"
            style={{ height: 40 }}
          />
        </div> */}
         <div className="" style={{marginBottom:50}}  >
        <Link className="  hover:cursor-pointer text-white p-2 rounded " style={{ marginBottom: 10,textDecoration:'none',border:'1px solid #333', }} to='/'>
        <ArrowLeftOutlined className="mx-1" /> Go to Home</Link>
        
      </div>

        <Title level={2} style={{ color: "white", textAlign: "center" }}>
          Create your account
        </Title>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            marginBottom: 10,
            background: "#1a1a1a",
            color: "white",
            border: "1px solid #333",
          }}
        >
          Continue with Google
        </Button>
        

        <Divider  style={{ borderColor: "#333", color: "#888" }}>OR</Divider>

        <Form form={form} style={{color:'white'}} layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email!' }]}> 
            <Input style={{backgroundColor:'rgb(28, 28, 28)'}} className="inp" placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}> 
            <Input.Password style={{backgroundColor:'rgb(28, 28, 28)'}} className="inp" placeholder="Password" />
          </Form.Item>

          <Form.Item name="agreement" valuePropName="checked" rules={[{ validator:(_, v)=>v ? Promise.resolve() : Promise.reject('You must agree to continue!') }]}> 
            <Checkbox style={{ color: "#ccc" }}>
              Agree to our <Link>Terms of Service</Link> and <Link>Privacy Policy</Link>
            </Checkbox>
          </Form.Item>

          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

          <Form.Item>
            <Button color="white" type="primary" htmlType="submit" block loading={loading}>
              Create your account
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ borderColor: "#333", color: "#888" }}>OR</Divider>

        <Text style={{ color: "#999" }}>
          <div style={{ textAlign: "center" }}>
            Already have an account? <Link to="/login">login</Link>
          </div>
        </Text>
      </div>
    </div>
  );
};

export default SignUp;
