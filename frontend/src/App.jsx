// src/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MainLayout from './components/MainLayout.jsx';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      <Routes>
        {user ? (
          // If user is logged in
          <>
            <Route path="/dashboard" element={<DashboardPage token={user.token} />} />
            {/* Redirect any other path to the dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          // If user is logged out
          <>
            <Route 
              path="/login" 
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/register" 
              element={<RegisterPage />} 
            />
            {/* Redirect any other path to the login page */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </MainLayout>
  );
}

export default App;