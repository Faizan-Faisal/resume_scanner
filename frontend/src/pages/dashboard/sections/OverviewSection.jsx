import React from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import JobCard from '../components/JobCard.jsx';
import Badge from '../components/Badge.jsx';

export default function OverviewSection() {
  const { showDash, setModal } = useApp();

  const stats = [
    { label: 'Total Jobs', value: '7', change: '↑ 2 this week' },
    { label: 'Resumes Scanned', value: '342', change: '↑ 48 today' },
    { label: 'Avg. Score', value: '71%', change: '↑ 3% vs last month' },
    { label: 'Active Jobs', value: '2', change: '3 completed' },
  ];

  return (
    <>
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Good morning 👋</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>Dashboard</div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
        {stats.map(s => (
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
        {/* Live job */}
        <JobCard onClick={() => showDash('scanning')}>
          <div className="flex items-center justify-between mb-1">
            <div className="font-syne font-bold" style={{ color: 'var(--text)' }}>Senior Frontend Engineer</div>
            <Badge type="processing">Live</Badge>
          </div>
          <div className="flex gap-4 text-xs mb-4" style={{ color: 'var(--text2)' }}>
            <span>📁 48 resumes</span><span>📅 Today</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'var(--bg3)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: '62%', background: 'linear-gradient(90deg,var(--accent),var(--accent2))' }}
            />
          </div>
          <div className="text-xs" style={{ color: 'var(--text2)' }}>62% complete</div>
        </JobCard>

        {/* Done job */}
        <JobCard onClick={() => setModal({ type: 'jobDetail', data: { title: 'Backend Engineer', score: 85 } })}>
          <div className="flex items-center justify-between mb-1">
            <div className="font-syne font-bold" style={{ color: 'var(--text)' }}>Backend Engineer</div>
            <Badge type="completed">Done</Badge>
          </div>
          <div className="flex gap-4 text-xs mb-4" style={{ color: 'var(--text2)' }}>
            <span>📁 32 resumes</span><span>📅 Yesterday</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent2)' }} />
              Top: Alex Johnson — 91%
            </div>
          </div>
        </JobCard>

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

