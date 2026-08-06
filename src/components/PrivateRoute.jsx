import { Navigate } from 'react-router-dom';
import { getToken, isTokenExpired } from '../services/authService';

function PrivateRoute({ children }) {
  const token = getToken();
  if (!token || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
