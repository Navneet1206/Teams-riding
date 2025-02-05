import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireVerification = true
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerification && !user.verified && user.role !== 'admin') {
    return <Navigate to="/verify" replace />;
  }

  return children;
};

export default ProtectedRoute;