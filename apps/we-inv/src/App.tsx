import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import { Layout } from './components/Layout';
import { StockManagementPage } from './pages/StockManagementPage';
import { LeavesManagementPage } from './pages/LeavesManagementPage';
import { VanManagementPage } from './pages/VanManagementPage';
import { CategoryMatrixPage } from './pages/CategoryMatrixPage';
import { LoginPage } from './pages/LoginPage';
import { ChangePinPage } from './pages/ChangePinPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-neutral-50)'
      }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="STOCK_MANAGER"><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/stock" replace />} />
        <Route path="stock" element={<StockManagementPage />} />
        <Route path="leaves" element={<LeavesManagementPage />} />
        <Route path="vans" element={<VanManagementPage />} />
        <Route path="categories" element={<CategoryMatrixPage />} />
        <Route path="change-pin" element={<ChangePinPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/stock" replace />} />
    </Routes>
  );
}

export function InvRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-neutral-50)'
      }}>
        <div className="loading-spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="STOCK_MANAGER"><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/stock" replace />} />
        <Route path="stock" element={<StockManagementPage />} />
        <Route path="leaves" element={<LeavesManagementPage />} />
        <Route path="vans" element={<VanManagementPage />} />
        <Route path="categories" element={<CategoryMatrixPage />} />
        <Route path="change-pin" element={<ChangePinPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/stock" replace />} />
    </Routes>
  );
}

export default App;