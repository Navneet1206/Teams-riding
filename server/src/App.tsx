import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import UserDashboard from './pages/UserDashboard';
import CaptainDashboard from './pages/CaptainDashboard';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, allowedRoles, requireVerification = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  if (requireVerification && !user.verified && user.role !== 'admin') {
    return <Navigate to="/verify" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/verify"
                element={
                  <PrivateRoute allowedRoles={['user', 'captain']} requireVerification={false}>
                    <VerificationPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <UserDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/captain/dashboard"
                element={
                  <PrivateRoute allowedRoles={['captain']}>
                    <CaptainDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;