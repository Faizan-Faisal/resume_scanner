import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { initialJobHistory } from '../data/mockData.jsx';
import { getJobs } from '../../api/jobapi.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentPage,  setCurrentPage]  = useState('home');
  const [dashSection,  setDashSection]  = useState('overview');
  const [navStack,     setNavStack]     = useState([{ page: 'home', dashSection: 'overview' }]);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [pendingCode,  setPendingCode]  = useState(null);
  const [toasts,       setToasts]       = useState([]);
  const [modal,        setModal]        = useState(null);
  const [jobHistory,   setJobHistory]   = useState(initialJobHistory);
  const [jobs,         setJobs]         = useState([]);
  const [jobsLoading,  setJobsLoading]  = useState(false);
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
  const pushNav = useCallback((next) => {
    setNavStack(prev => {
      const last = prev[prev.length - 1];
      const same = last?.page === next.page && last?.dashSection === next.dashSection;
      return same ? prev : [...prev, next];
    });
  }, []);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    pushNav({ page, dashSection: 'overview' });
    window.scrollTo(0, 0);
  }, [pushNav]);

  const showDash = useCallback((section) => {
    setCurrentPage('dashboard');
    setDashSection(section);
    pushNav({ page: 'dashboard', dashSection: section });
    window.scrollTo(0, 0);
  }, [pushNav]);

  const canGoBack = navStack.length > 1;

  const goBack = useCallback(() => {
    setNavStack(prev => {
      if (prev.length <= 1) return prev;
      const nextStack = prev.slice(0, -1);
      const target = nextStack[nextStack.length - 1];
      setCurrentPage(target.page);
      setDashSection(target.dashSection || 'overview');
      window.scrollTo(0, 0);
      return nextStack;
    });
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

  const startEmailFlow = useCallback((email) => {
    setPendingEmail(email);
    setPendingCode(null);
  }, []);

  const setEmailCode = useCallback((code) => {
    setPendingCode(code);
  }, []);

  const clearEmailFlow = useCallback(() => {
    setPendingEmail(null);
    setPendingCode(null);
  }, []);

  const refreshJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
      return data;
    } finally {
      setJobsLoading(false);
    }
  }, []);

  /* ---------- history ---------- */
  const addJobHistory = useCallback((job) => {
    setJobHistory(p => [job, ...p]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      dashSection, showDash,
      canGoBack, goBack,
      theme, toggleTheme,
      toasts, showToast,
      modal, setModal,
      jobHistory, addJobHistory,
      logout, doLogin,
      pendingEmail, pendingCode,
      startEmailFlow, setEmailCode, clearEmailFlow,
      jobs, jobsLoading, refreshJobs,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
