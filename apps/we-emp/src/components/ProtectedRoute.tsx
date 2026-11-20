import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
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

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return React.createElement(Navigate, { to: '/unauthorized', replace: true });
  }

  return React.createElement(React.Fragment, null, children);
}

export default ProtectedRoute;