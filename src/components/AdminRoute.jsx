import { Navigate } from 'react-router-dom';
import { getToken, isTokenExpired, isAdminNavVisible } from '../services/authService';

function AdminRoute({ children }) {
  const token = getToken();
  if (!token || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdminNavVisible()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AdminRoute;
