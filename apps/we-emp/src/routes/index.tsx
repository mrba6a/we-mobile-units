// Module Federation remote entry point
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import { Layout } from '../components/Layout';
import { DailyEntryPage } from '../pages/DailyEntryPage';
import { MySalesPage } from '../pages/MySalesPage';
import { MyLeavesPage } from '../pages/MyLeavesPage';
import { VanSchedulePage } from '../pages/VanSchedulePage';
import { LoginPage } from '../pages/LoginPage';
import { ChangePinPage } from '../pages/ChangePinPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function EmpRoutes() {
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
      <Route element={<ProtectedRoute allowedRoles={['AGENT', 'SELLER', 'SUPERVISOR', 'ADMIN']}><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/daily-entry" replace />} />
        <Route path="daily-entry" element={<DailyEntryPage />} />
        <Route path="my-sales" element={<MySalesPage />} />
        <Route path="my-leaves" element={<MyLeavesPage />} />
        <Route path="van-schedule" element={<VanSchedulePage />} />
        <Route path="change-pin" element={<ChangePinPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/daily-entry" replace />} />
    </Routes>
  );
}

export default EmpRoutes;