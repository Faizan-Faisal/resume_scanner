import React from 'react';

export default function FooterSection() {
  return (
    <footer
      className="border-t px-12 py-8 flex items-center justify-between flex-wrap gap-4 transition-all duration-300"
      style={{ borderColor: 'var(--border)', background: 'var(--footer-bg)' }}
    >
      <div className="flex items-center gap-2 font-syne font-extrabold text-xl cursor-pointer" style={{ color: 'var(--text)' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        RecruitAI
      </div>
      <div className="text-xs" style={{ color: 'var(--text3)' }}>© 2025 RecruitAI. Built for modern HR teams.</div>
      <div className="flex gap-6">
        {['Privacy', 'Terms', 'Contact'].map(l => (
          <span key={l} className="text-xs cursor-pointer hover:underline" style={{ color: 'var(--text3)' }}>{l}</span>
        ))}
      </div>
    </footer>
  );
}

