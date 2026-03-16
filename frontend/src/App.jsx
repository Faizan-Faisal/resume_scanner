import React, { useEffect, useState, useCallback } from 'react';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Forgot from './components/Forgot.jsx';
import Dashboard from './components/Dashboard.jsx';

const PAGES = {
  home: 'home',
  login: 'login',
  signup: 'signup',
  forgot: 'forgot',
  dashboard: 'dashboard',
};

function App() {
  const [page, setPage] = useState(PAGES.home);
  const [isDark, setIsDark] = useState(true);
  const [toasts, setToasts] = useState([]);

  // theme init
  useEffect(() => {
    const saved = window.localStorage.getItem('recruit-theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // keep html[data-theme] in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const pushToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const handleToggleTheme = () => {
    setIsDark((d) => {
      const next = !d;
      const theme = next ? 'dark' : 'light';
      window.localStorage.setItem('recruit-theme', theme);
      pushToast(next ? 'Switched to dark mode' : 'Switched to light mode', 'info');
      return next;
    });
  };

  const goToPage = (next) => {
    window.scrollTo(0, 0);
    setPage(next);
  };

  const handleLoginSuccess = () => {
    pushToast('Welcome back, Sarah! 👋', 'success');
    goToPage(PAGES.dashboard);
  };

  const handleLogout = () => {
    pushToast('Logged out successfully', 'info');
    goToPage(PAGES.home);
  };

  const isDashboard = page === PAGES.dashboard;

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="mainNav">
        <div
          className="nav-logo"
          onClick={() => {
            if (isDashboard) {
              handleLogout();
            } else {
              goToPage(PAGES.home);
            }
          }}
        >
          <span className="nav-logo-dot" /> RecruitAI
        </div>

        {!isDashboard && (
          <div className="nav-links" id="homeNavLinks">
            <span className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Features
            </span>
            <span className="nav-link" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              How it works
            </span>
            <span className="nav-link" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
              Pricing
            </span>
          </div>
        )}

        {!isDashboard && (
          <div className="nav-btns" id="authNavBtns">
            <button className="theme-toggle" onClick={handleToggleTheme} title="Toggle light/dark mode">
              <div className="toggle-thumb">{isDark ? '🌙' : '☀️'}</div>
            </button>
            <button className="btn btn-ghost" onClick={() => goToPage(PAGES.login)}>
              Log in
            </button>
            <button className="btn btn-primary" onClick={() => goToPage(PAGES.signup)}>
              Get started
            </button>
          </div>
        )}

        {isDashboard && (
          <div className="nav-btns" id="dashNavBtns">
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)', marginRight: '0.25rem' }}>Hi, Sarah 👋</span>
            <button className="theme-toggle" onClick={handleToggleTheme} title="Toggle light/dark mode">
              <div className="toggle-thumb">{isDark ? '🌙' : '☀️'}</div>
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </nav>

      {/* TOASTS */}
      <div className="toast-wrap" id="toastWrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}</span>
            {t.msg}
          </div>
        ))}
      </div>

      {/* PAGES */}
      {page === PAGES.home && (
        <Home
          onGetStarted={() => goToPage(PAGES.signup)}
          onScrollTo={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
        />
      )}
      {page === PAGES.login && (
        <Login
          onLogin={handleLoginSuccess}
          onSignup={() => goToPage(PAGES.signup)}
          onForgot={() => goToPage(PAGES.forgot)}
          showToast={pushToast}
        />
      )}
      {page === PAGES.signup && (
        <Signup
          onSignup={handleLoginSuccess}
          onLogin={() => goToPage(PAGES.login)}
          showToast={pushToast}
        />
      )}
      {page === PAGES.forgot && (
        <Forgot
          onBack={() => goToPage(PAGES.login)}
          showToast={pushToast}
        />
      )}
      {page === PAGES.dashboard && <Dashboard showToast={pushToast} />}
    </>
  );
}

export default App;

