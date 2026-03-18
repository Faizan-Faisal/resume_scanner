import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const borderMap = {
  success: 'var(--accent2)',
  error:   'var(--accent3)',
  info:    'var(--accent)',
};

const iconMap = { success: '✓', error: '✗', info: 'ℹ' };

export default function Toast() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-8 right-8 z-[500] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm border pointer-events-auto animate-slide-in"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border2)',
            borderLeft: `3px solid ${borderMap[t.type]}`,
            color: 'var(--text)',
            minWidth: 260,
            boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ color: borderMap[t.type] }}>{iconMap[t.type]}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
