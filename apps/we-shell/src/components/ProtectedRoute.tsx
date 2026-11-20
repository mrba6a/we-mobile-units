import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--color-neutral-50)'
        }
      },
      React.createElement('div', { className: 'loading-spinner', style: { width: 40, height: 40 } })
    );
  }

  if (!user) {
    return React.createElement(Navigate, { to: '/login', state: { from: location }, replace: true });
  }

  if (requiredRole) {
    const roleHierarchy: Record<string, number> = {
      ADMIN: 100,
      SUPERVISOR: 80,
      FINANCE: 70,
      STOCK_MANAGER: 60,
      HR: 60,
      AGENT: 40,
      SELLER: 30,
    };

    const userRoleLevel = roleHierarchy[user.role] ?? 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] ?? 0;

    if (userRoleLevel < requiredRoleLevel) {
      return React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--color-neutral-50)',
            padding: 'var(--space-6)'
          }
        },
        React.createElement(
          'div',
          {
            style: {
              maxWidth: 400,
              textAlign: 'center',
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-xl)'
            }
          },
          React.createElement('div', { style: { fontSize: '3rem', marginBottom: 'var(--space-4)' } }, '🔒'),
          React.createElement(
            'h2',
            { style: { fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-900)', marginBottom: 'var(--space-3)' } },
            'غير مصرح'
          ),
          React.createElement(
            'p',
            { style: { color: 'var(--color-neutral-600)', marginBottom: 'var(--space-6)' } },
            'لا تملك الصلاحية للوصول إلى هذه الصفحة. دورك الحالي: ',
            React.createElement('strong', null, user.role)
          ),
          React.createElement(
            'button',
            {
              onClick: () => window.history.back(),
              style: {
                background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                color: 'white',
                border: 'none',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                cursor: 'pointer'
              }
            },
            'رجوع'
          )
        )
      );
    }
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return React.createElement(Navigate, { to: '/unauthorized', replace: true });
  }

  return React.createElement(React.Fragment, null, children);
}

export default ProtectedRoute;