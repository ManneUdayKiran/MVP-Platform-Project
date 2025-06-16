import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider } from 'antd';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';
import NavBar from './components/NavBar.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import UserPage from './components/UserPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const AppContent = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed, user:', user);
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  console.log('AppContent user:', user);
  console.log('AppContent isLoggedIn:', !!user);

  // Show NavBar on all routes except login and signup
  const shouldShowNavBar = !['/login', '/signup'].includes(location.pathname);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ConfigProvider>
      {shouldShowNavBar && <NavBar isLoggedIn={!!user} user={user} />}
      <Routes>
        <Route path="/" element={<Home onGenerate={setPrompt} />} />
        <Route path="/app" element={<App prompt={prompt} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/userpage"
          element={
            <PrivateRoute user={user}>
              <UserPage user={user} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
