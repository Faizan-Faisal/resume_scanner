import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { initialJobHistory } from '../data/mockData.jsx';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentPage,  setCurrentPage]  = useState('home');
  const [dashSection,  setDashSection]  = useState('overview');
  const [toasts,       setToasts]       = useState([]);
  const [modal,        setModal]        = useState(null);
  const [jobHistory,   setJobHistory]   = useState(initialJobHistory);
  const toastId = useRef(0);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('recruit-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  });

  /* ---------- toast ---------- */
  const showToast = useCallback((msg, type = 'info') => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  /* ---------- theme ---------- */
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('recruit-theme', next);
      showToast(next === 'dark' ? 'Switched to dark mode' : 'Switched to light mode', 'info');
      return next;
    });
  }, [showToast]);

  /* ---------- navigation ---------- */
  const navigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const showDash = useCallback((section) => {
    setCurrentPage('dashboard');
    setDashSection(section);
    window.scrollTo(0, 0);
  }, []);

  /* ---------- auth ---------- */
  const logout = useCallback(() => {
    navigate('home');
    showToast('Logged out successfully', 'info');
  }, [navigate, showToast]);

  const doLogin = useCallback(() => {
    navigate('dashboard');
    showToast('Welcome back, Sarah! 👋', 'success');
  }, [navigate, showToast]);

  /* ---------- history ---------- */
  const addJobHistory = useCallback((job) => {
    setJobHistory(p => [job, ...p]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      dashSection, showDash,
      theme, toggleTheme,
      toasts, showToast,
      modal, setModal,
      jobHistory, addJobHistory,
      logout, doLogin,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
