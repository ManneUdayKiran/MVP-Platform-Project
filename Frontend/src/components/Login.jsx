import React from "react";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { GoogleOutlined,ArrowLeftOutlined } from "@ant-design/icons";
import { auth, provider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Contains .inp class for placeholder color
// import { signOut } from "firebase/auth";
// import { auth } from "./firebase"; // adjust path

const { Title, Text } = Typography;


const Login = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
      
        navigate("/userpage");
      // Redirect or save user info
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const onFinish = async (values) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate("/userpage");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

const handleLogout = async () => {
  await signOut(auth);
  setUser(null); // clear user in state
  navigate("/login"); // redirect to login
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
        <div className="" style={{marginBottom:50}}  >
        <Link className="  hover:cursor-pointer text-white p-2 rounded " style={{ marginBottom: 10,textDecoration:'none',border:'1px solid #333', }} to='/'>
        <ArrowLeftOutlined className="mx-1" /> Go to Home</Link>
        
      </div>
        <Title level={2} style={{ color: "white", textAlign: "center" }}>
          Login
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

        <Divider style={{ borderColor: "#333", color: "#888" }}>OR</Divider>

        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: "Email is required" }]}>
            <Input
              className="inp"
              placeholder="Email"
              style={{ backgroundColor: "rgb(28, 28, 28)", color: "white" }}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
            <Input.Password
              className="inp"
              placeholder="Password"
              style={{ backgroundColor: "rgb(28, 28, 28)", color: "white" }}
            />
          </Form.Item>

          <Form.Item name="agreement" valuePropName="checked" rules={[{ validator:(_, v)=>v ? Promise.resolve() : Promise.reject('You must agree to continue!') }]}>
            <Checkbox style={{ color: "#ccc" }}>
              Agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </Checkbox>
          </Form.Item>

          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ borderColor: "#333", color: "#888" }}>OR</Divider>

        <Text style={{ color: "#999" }}>
          <div style={{ textAlign: "center" }}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </Text>
      </div>
    </div>
  );
};

export default Login;
