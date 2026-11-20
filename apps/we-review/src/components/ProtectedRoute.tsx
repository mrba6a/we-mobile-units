import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && requiredRole.length > 0 && !requiredRole.includes(user.role)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-neutral-50)',
        padding: 'var(--space-6)'
      }}>
        <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
          <div className="card-body">
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔒</div>
            <h2 className="card-title" style={{ marginBottom: 'var(--space-3)' }}>غير مصرح</h2>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-6)' }}>
              لا تملك الصلاحية للوصول إلى هذه الصفحة. دورك الحالي: <strong>{user.role}</strong>
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              رجوع
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}