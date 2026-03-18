import React from 'react';

export default function Badge({ type, children }) {
  const styles = {
    completed:  { bg: 'var(--badge-done-bg,rgba(0,212,170,0.12))',  color: 'var(--accent2)' },
    processing: { bg: 'var(--badge-live-bg,rgba(79,126,255,0.12))', color: 'var(--accent)' },
    draft:      { bg: 'rgba(255,255,255,0.06)',                     color: 'var(--text2)' },
  };
  const s = styles[type] || styles.draft;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
}

