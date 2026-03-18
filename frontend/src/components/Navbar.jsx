import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar() {
  const { currentPage, navigate, canGoBack, goBack, theme, toggleTheme, logout } = useApp();
  const isDash = currentPage === 'dashboard';
  const isDark = theme === 'dark';

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-[70px] border-b border-[var(--border)] backdrop-blur-[20px] transition-all duration-300"
      style={{ background: 'var(--nav-bg)' }}
    >
      <div className="flex items-center gap-3">
        {/* Back */}
        <button
          className="w-9 h-9 rounded-lg border bg-transparent cursor-pointer transition-all duration-200 flex items-center justify-center"
          style={{
            borderColor: 'var(--border2)',
            color: canGoBack ? 'var(--text2)' : 'var(--text3)',
            opacity: canGoBack ? 1 : 0.5,
            pointerEvents: canGoBack ? 'auto' : 'none',
          }}
          onMouseEnter={e => { if (canGoBack) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; } }}
          onMouseLeave={e => { if (canGoBack) { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; } }}
          onClick={goBack}
          aria-label="Go back"
          title="Back"
        >
          ←
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer font-syne text-[1.4rem] font-extrabold"
          style={{ color: 'var(--text)' }}
          onClick={() => isDash ? logout() : navigate('home')}
        >
          <span
            className="w-2 h-2 rounded-full animate-dot-pulse"
            style={{ background: 'var(--accent)' }}
          />
          RecruitAI
        </div>
      </div>

      {/* Center links (home only) */}
      {!isDash && (
        <div className="flex items-center gap-8">
          {[['features','Features'],['how','How it works'],['pricing','Pricing']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-dm transition-colors duration-200 bg-transparent border-none cursor-pointer"
              style={{ color: 'var(--text2)' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text2)'}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Right buttons */}
      <div className="flex items-center gap-3">
        {isDash && (
          <span className="text-sm mr-1" style={{ color: 'var(--text2)' }}>Hi, Sarah 👋</span>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center p-[3px] w-[52px] h-7 rounded-full border transition-all duration-300 cursor-pointer"
          style={{ background: 'var(--surface)', borderColor: 'var(--border2)' }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] transition-transform duration-300"
            style={{
              background: 'var(--accent)',
              transform: isDark ? 'translateX(0)' : 'translateX(24px)',
            }}
          >
            {isDark ? '🌙' : '☀️'}
          </div>
        </button>

        {!isDash ? (
          <>
            <button
              onClick={() => navigate('login')}
              className="px-5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 bg-transparent cursor-pointer"
              style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
            >
              Log in
            </button>
            <button
              onClick={() => navigate('signup')}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 cursor-pointer border-none"
              style={{ background: 'var(--accent)' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
            >
              Get started
            </button>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 bg-transparent cursor-pointer"
            style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            Log out
          </button>
        )}
      </div>
    </nav>
  );
}
