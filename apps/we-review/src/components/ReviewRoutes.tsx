import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import { Layout } from './Layout';
import { ReconciliationPage } from '../pages/ReconciliationPage';
import { FinancePage } from '../pages/FinancePage';
import { MonthlyReportsPage } from '../pages/MonthlyReportsPage';
import { HistoricalPage } from '../pages/HistoricalPage';
import { MasterPreviewPage } from '../pages/MasterPreviewPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

export function ReviewRoutes() {
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
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reconciliation" element={<ReconciliationPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="monthly" element={<MonthlyReportsPage />} />
        <Route path="historical" element={<HistoricalPage />} />
        <Route path="master-preview" element={<MasterPreviewPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default ReviewRoutes;