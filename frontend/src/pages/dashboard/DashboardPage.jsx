import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

import Sidebar from './components/Sidebar.jsx';
import OverviewSection from './sections/OverviewSection.jsx';
import HistorySection from './sections/HistorySection.jsx';
import ScanningSection from './sections/ScanningSection.jsx';
import NewJobSection from './sections/NewJobSection.jsx';

export default function DashboardPage() {
  const { dashSection, refreshJobs, showToast } = useApp();

  useEffect(() => {
    refreshJobs().catch(() => {
      showToast('Failed to load jobs. Please login again.', 'error');
    });
  }, [refreshJobs, showToast]);

  return (
    <div className="flex min-h-screen pt-[70px] animate-fade-in" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-10">
        {dashSection === 'overview' && <OverviewSection />}
        {dashSection === 'new-job' && <NewJobSection />}
        {dashSection === 'history' && <HistorySection />}
        {dashSection === 'scanning' && <ScanningSection />}
      </main>
    </div>
  );
}

