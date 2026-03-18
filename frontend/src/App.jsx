import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import Modal from './components/Modal.jsx';
import HomePage from './pages/home/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import ForgotPage from './pages/auth/ForgotPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';


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
