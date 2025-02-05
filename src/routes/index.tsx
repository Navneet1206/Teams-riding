import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import VerificationPage from '../pages/VerificationPage';
import UserDashboard from '../pages/UserDashboard';
import CaptainDashboard from '../pages/CaptainDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/signup',
    element: <SignupPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/verify',
    element: (
      <ProtectedRoute allowedRoles={['user', 'captain']} requireVerification={false}>
        <VerificationPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/user/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/captain/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['captain']}>
        <CaptainDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  }
]);