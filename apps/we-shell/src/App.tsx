import { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load micro-frontends
const ReviewRoutes = lazy(() => import('we_review/ReviewRoutes').then(m => ({ default: m.ReviewRoutes })));
const EmpRoutes = lazy(() => import('we_emp/EmpRoutes').then(m => ({ default: m.EmpRoutes })));
const InvRoutes = lazy(() => import('we_inv/InvRoutes').then(m => ({ default: m.InvRoutes })));

function App() {
  const { user, isLoading } = useAuth();
  const [activeApp, setActiveApp] = useState<'review' | 'emp' | 'inv'>('review');

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

  const switchApp = (app: 'review' | 'emp' | 'inv') => {
    setActiveApp(app);
    window.location.href = `/${app}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        borderBottom: '1px solid var(--color-neutral-200)',
        boxShadow: 'var(--shadow-sm)',
        padding: '0 var(--space-6)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.25rem'
            }}>
              WE
            </div>
            <div>
              <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
                نظام إدارة الوحدات المتنقلة - WE
              </h1>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={() => switchApp('review')}
              className={`btn ${activeApp === 'review' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              📊 المراجعة والتقارير
            </button>
            <button
              onClick={() => switchApp('emp')}
              className={`btn ${activeApp === 'emp' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              👤 الموظف
            </button>
            <button
              onClick={() => switchApp('inv')}
              className={`btn ${activeApp === 'inv' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              📦 المخزون والإجازات
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-600)' }}>
              {user?.name}
            </span>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              {user?.name?.charAt(0) || 'م'}
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: 'var(--space-6)' }}>
        <Suspense fallback={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            background: 'var(--color-neutral-50)'
          }}>
            <div className="loading-spinner" style={{ width: 40, height: 40 }} />
          </div>
        }>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/review/*" element={
              <ProtectedRoute requiredRole="SUPERVISOR">
                <ReviewRoutes />
              </ProtectedRoute>
            } />
            <Route path="/emp/*" element={
              <ProtectedRoute allowedRoles={['AGENT', 'SELLER', 'SUPERVISOR', 'ADMIN']}>
                <EmpRoutes />
              </ProtectedRoute>
            } />
            <Route path="/inv/*" element={
              <ProtectedRoute requiredRole="STOCK_MANAGER">
                <InvRoutes />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/review" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;