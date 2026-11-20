import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
}