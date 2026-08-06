import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ParametrosPage from './pages/ParametrosPage';
import DirectoryMePage from './pages/DirectoryMePage';
import AdminRbacPage from './pages/AdminRbacPage';
import InventarioPage from './pages/InventarioPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AppShell from './components/AppShell';
import ErrorBoundary from './components/ErrorBoundary';

function Shell({ children }) {
  return (
    <PrivateRoute>
      <AppShell>{children}</AppShell>
    </PrivateRoute>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/" element={<Shell><ParametrosPage /></Shell>} />
          <Route path="/inventario" element={<Shell><InventarioPage /></Shell>} />
          <Route path="/directory/me" element={<Shell><DirectoryMePage /></Shell>} />
          <Route
            path="/admin/rbac"
            element={
              <AdminRoute>
                <Shell><AdminRbacPage /></Shell>
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
