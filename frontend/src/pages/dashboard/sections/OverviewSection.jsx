import React from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import JobCard from '../components/JobCard.jsx';
import Badge from '../components/Badge.jsx';

export default function OverviewSection() {
  const { showDash, setModal, jobs, jobsLoading, dashboardStats, statsLoading } = useApp();
  const recentJobs = (jobs || []).slice(0, 3);

  return (
    <>
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Good morning 👋</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>Dashboard</div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
        {[
          { label: 'Total Jobs', value: statsLoading ? '…' : String(dashboardStats?.total_jobs ?? '—'), change: 'From your account' },
          { label: 'Active Jobs', value: statsLoading ? '…' : String(dashboardStats?.active_jobs ?? '—'), change: 'Not closed yet' },
          { label: 'Resumes Scanned', value: statsLoading ? '…' : String(dashboardStats?.resumes_scanned ?? '—'), change: 'From completed scans' },
          { label: 'Avg. Score', value: statsLoading ? '…' : (dashboardStats?.avg_score ?? '—'), change: 'Across completed scans' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-6 border transition-all duration-300"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>{s.label}</div>
            <div className="font-syne font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--accent2)' }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Recent jobs heading */}
      <div
        className="flex items-center justify-between font-syne font-bold text-xl mb-5"
        style={{ color: 'var(--text)' }}
      >
        Recent Jobs
        <button
          className="px-4 py-1.5 rounded-lg border bg-transparent text-sm font-dm cursor-pointer transition-all duration-200"
          style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border2)';
            e.currentTarget.style.color = 'var(--text2)';
          }}
          onClick={() => showDash('history')}
        >
          View all
        </button>
      </div>

      {/* Job cards */}
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {jobsLoading && (
          <div className="text-sm" style={{ color: 'var(--text2)' }}>Loading jobs...</div>
        )}

        {!jobsLoading && recentJobs.map((j) => (
          <JobCard key={j._id || j.id} onClick={() => setModal({ type: 'jobDetail', data: j })}>
            <div className="flex items-center justify-between mb-1">
              <div className="font-syne font-bold" style={{ color: 'var(--text)' }}>{j.title}</div>
              <Badge type={(j.status || '').toLowerCase() === 'completed' ? 'completed' : 'processing'}>
                {(j.status || 'Open')}
              </Badge>
            </div>
            <div className="text-xs mb-4" style={{ color: 'var(--text2)' }}>
              <span>📅 {j.created_at ? String(j.created_at).slice(0, 10) : '—'}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-xs" style={{ color: 'var(--text2)' }}>
                Min exp: <span style={{ color: 'var(--text)' }}>{j.min_experience ?? '—'}</span>
              </div>
              <button
                className="px-3 py-1 rounded-md border bg-transparent text-xs cursor-pointer"
                style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
                onClick={(e) => { e.stopPropagation(); setModal({ type: 'jobDetail', data: j }); }}
              >
                Job details →
              </button>
            </div>
          </JobCard>
        ))}

        {/* New job */}
        <JobCard onClick={() => showDash('new-job')}>
          <div
            className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2 rounded-xl border-2 border-dashed"
            style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
          >
            <div className="text-3xl opacity-40">+</div>
            <div className="text-sm font-medium">Create new job</div>
          </div>
        </JobCard>
      </div>
    </>
  );
}

