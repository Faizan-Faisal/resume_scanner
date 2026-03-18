import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import Modal from './components/Modal.jsx';
import HomePage from './pages/HomePage.jsx';
import { LoginPage, SignupPage, ForgotPage } from './pages/AuthPages.jsx';
import DashboardPage from './pages/DashboardPage.jsx';


function Router() {
  const { currentPage } = useApp();
  return (
    <>
      <Navbar />
      {currentPage === 'home'      && <HomePage />}
      {currentPage === 'login'     && <LoginPage />}
      {currentPage === 'signup'    && <SignupPage />}
      {currentPage === 'forgot'    && <ForgotPage />}
      {currentPage === 'dashboard' && <DashboardPage />}
      <Toast />
      <Modal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
