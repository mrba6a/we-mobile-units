import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@we/shared/auth';

const navigation = [
  { path: '/dashboard', label: 'لوحة التحكم', icon: '📊' },
  { path: '/reconciliation', label: 'التسوية والمراجعة', icon: '⚖️' },
  { path: '/finance', label: 'المالية و BSS', icon: '💰' },
  { path: '/monthly', label: 'التقارير الشهرية', icon: '📅' },
  { path: '/historical', label: 'التحليل التاريخي', icon: '📈' },
  { path: '/master-preview', label: 'معاينة الشيت الرئيسي', icon: '📋' },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'مدير النظام',
      SUPERVISOR: 'مشرف',
      FINANCE: 'مالية',
      STOCK_MANAGER: 'مدير مخزون',
      HR: 'شؤون موظفين',
      AGENT: 'مسؤول مبيعات',
      SELLER: 'بائع',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'var(--color-primary-600)',
      SUPERVISOR: 'var(--color-secondary-500)',
      FINANCE: 'var(--color-success-500)',
      STOCK_MANAGER: 'var(--color-warning-500)',
      HR: '#EC4899',
      AGENT: 'var(--color-primary-600)',
      SELLER: '#6366F1',
    };
    return colors[role] || 'var(--color-neutral-500)';
  };

  return (
    <div className="app-layout" dir="rtl">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 'var(--z-modal)',
            display: 'block'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="app-sidebar"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-normal)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Sidebar Header */}
        <div className="card-header" style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
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
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
                الإدارة العامة للوحدات المتنقلة
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', margin: 0 }}>
                تطبيق المراجعة والتقارير
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                      : 'text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]'
                    }
                  `}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-neutral-600)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                    ...(item.path === '/dashboard' ? {} : {})
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="card-footer" style={{ borderTop: '1px solid var(--color-neutral-200)', padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-full)',
              background: getRoleColor(user?.role || 'AGENT'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              {user?.name?.charAt(0) || 'م'}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-900)', margin: 0 }}>
                {user?.name}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', margin: 0 }}>
                {getRoleLabel(user?.role || 'AGENT')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="app-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        background: 'white',
        borderBottom: '1px solid var(--color-neutral-200)',
        boxShadow: 'var(--shadow-sm)',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'none' }}
            aria-label="فتح القائمة"
          >
            ☰
          </button>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
            تطبيق المراجعة والتقارير
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* Notifications */}
          <button className="btn btn-ghost btn-sm" style={{ position: 'relative' }}>
            🔔
            <span style={{
              position: 'absolute',
              top: 4,
              left: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-error-500)'
            }} />
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="btn btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)'
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                background: getRoleColor(user?.role || 'AGENT'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}>
                {user?.name?.charAt(0) || 'م'}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-700)' }}>
                {user?.name}
              </span>
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 'var(--space-2)',
                minWidth: 200,
                background: 'white',
                border: '1px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 'var(--z-dropdown)',
                overflow: 'hidden'
              }}>
                <div className="card-header" style={{ padding: 'var(--space-3)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', margin: 0 }}>
                    رقم العامل: {user?.id}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', margin: 0 }}>
                    الدور: {getRoleLabel(user?.role || 'AGENT')}
                  </p>
                  {user?.vanCode && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', margin: 0 }}>
                      الوحدة: {user.vanCode}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-error-500)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'right'
                  }}
                >
                  🚪 تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}