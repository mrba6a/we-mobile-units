import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@we/shared/auth';

const navigation = [
  { path: '/stock', label: 'إدارة المخزون', icon: '📦' },
  { path: '/leaves', label: 'إدارة الإجازات', icon: '🏖️' },
  { path: '/vans', label: 'إدارة الوحدات', icon: '🚐' },
  { path: '/categories', label: 'مصفوفة الفئات', icon: '📊' },
];

export function Layout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} dir="rtl">
      <aside
        className="app-sidebar"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-normal)',
          display: 'flex',
          flexDirection: 'column',
          width: 280,
          background: 'white',
          borderLeft: '1px solid var(--color-neutral-200)',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          overflowY: 'auto',
          zIndex: 50,
        }}
      >
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-neutral-200)' }}>
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
                المخزون والإجازات
              </h3>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }: { isActive: boolean }) => `
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
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-neutral-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 36,
              height: 36,
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
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-900)', margin: 0 }}>
                {user?.name}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-neutral-500)', margin: 0 }}>
                {user?.role === 'STOCK_MANAGER' ? 'مدير مخزون' : user?.role === 'HR' ? 'شؤون موظفين' : 'مشرف'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
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
            المخزون والإجازات
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-1) var(--space-3)' }}
              aria-label="فتح القائمة"
            >
              ☰
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                localStorage.removeItem('we_auth_token');
                localStorage.removeItem('we_auth_user');
                window.location.href = '/login';
              }}
              className="btn btn-ghost btn-sm"
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
                background: 'var(--color-primary-600)',
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
          </div>
        </div>
      </header>

      <main className="app-main" style={{ flex: 1, padding: 'var(--space-6)' }}>
        <Outlet />
      </main>
    </div>
  );
}