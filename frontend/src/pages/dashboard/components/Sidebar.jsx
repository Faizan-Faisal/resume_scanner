import React from 'react';
import { useApp } from '../../../context/AppContext.jsx';

function SideItem({ id, icon, label, onClick }) {
  const { dashSection, showDash } = useApp();
  const active = dashSection === id;

  return (
    <button
      className="flex items-center gap-3 w-full px-5 py-2.5 text-sm border-none bg-transparent cursor-pointer transition-all duration-200 font-dm text-left"
      style={{
        color: active ? 'var(--accent)' : 'var(--text2)',
        background: active ? 'rgba(79,126,255,0.07)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text)';
          e.currentTarget.style.background = 'var(--surface)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text2)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
      onClick={onClick || (() => showDash(id))}
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
    </button>
  );
}

export default function Sidebar() {
  const { logout, showToast } = useApp();

  const navItems = [
    { id: 'overview', icon: '🏠', label: 'Overview' },
    { id: 'new-job', icon: '✚', label: 'New Job' },
    { id: 'history', icon: '📋', label: 'Job History' },
  ];

  return (
    <aside
      className="fixed top-[70px] bottom-0 left-0 w-60 flex flex-col border-r overflow-y-auto transition-all duration-300"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
    >
      <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="font-syne font-bold text-sm mb-0.5" style={{ color: 'var(--text)' }}>Sarah Connor</div>
        <div className="text-xs" style={{ color: 'var(--text3)' }}>sarah@company.com</div>
      </div>

      <div
        className="px-5 pt-5 pb-1 text-[0.65rem] tracking-widest uppercase font-medium"
        style={{ color: 'var(--text3)' }}
      >
        Main
      </div>
      {navItems.map(i => <SideItem key={i.id} {...i} />)}

      <div
        className="px-5 pt-5 pb-1 text-[0.65rem] tracking-widest uppercase font-medium"
        style={{ color: 'var(--text3)' }}
      >
        Account
      </div>
      <SideItem
        id="settings"
        icon="⚙️"
        label="Settings"
        onClick={() => showToast('Settings coming soon', 'info')}
      />
      <SideItem id="logout" icon="↩️" label="Log out" onClick={logout} />
    </aside>
  );
}

