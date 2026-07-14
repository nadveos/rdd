// src/admin/AdminLayout.tsx
import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import Dashboard from './panels/Dashboard';
import ShowsManager from './panels/ShowsManager';
import MediaManager from './panels/MediaManager';
import ContactsInbox from './panels/ContactsInbox';
import './AdminLayout.css';

type Panel = 'dashboard' | 'shows' | 'media' | 'contacts';

const NAV = [
  { id: 'dashboard' as Panel, icon: '◈', label: 'Dashboard' },
  { id: 'shows'     as Panel, icon: '📅', label: 'Shows / Giras' },
  { id: 'media'     as Panel, icon: '🖼', label: 'Media' },
  { id: 'contacts'  as Panel, icon: '✉', label: 'Contactos' },
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [activePanel, setActivePanel] = useState<Panel>('dashboard');

  if (!isAuthenticated) return <AdminLogin />;

  const panelTitle = NAV.find((n) => n.id === activePanel)?.label ?? '';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <p className="admin-sidebar__logo">Raúl Domingo</p>
          <p className="admin-sidebar__sub">Panel Admin</p>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Menú admin">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-link${activePanel === item.id ? ' active' : ''}`}
              onClick={() => setActivePanel(item.id)}
              aria-current={activePanel === item.id ? 'page' : undefined}
            >
              <span className="admin-nav-link__icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noopener noreferrer"
            style={{ display:'block', color:'rgba(255,255,255,0.3)', fontSize:'0.625rem',
                     letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem',
                     textDecoration:'none' }}>
            ↗ Ver Sitio
          </a>
          <button className="admin-logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar__title">{panelTitle}</h1>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-topbar__site-link">
            ↗ Ver sitio público
          </a>
        </div>

        {activePanel === 'dashboard' && <Dashboard />}
        {activePanel === 'shows'     && <ShowsManager />}
        {activePanel === 'media'     && <MediaManager />}
        {activePanel === 'contacts'  && <ContactsInbox />}
      </main>
    </div>
  );
}
