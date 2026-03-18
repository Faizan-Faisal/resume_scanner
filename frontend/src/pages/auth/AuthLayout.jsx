import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-8 pt-[90px] relative"
      style={{ background: 'var(--bg)' }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 800px 600px at 50% 30%,rgba(79,126,255,0.06) 0%,transparent 70%)' }}
      />

      <div
        className="w-full max-w-[420px] relative z-10 rounded-2xl p-10 border animate-fade-in"
        style={{ background: 'var(--surface)', borderColor: 'var(--border2)' }}
      >
        {children}
      </div>
    </div>
  );
}

