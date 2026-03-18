import React from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import JobCard from '../components/JobCard.jsx';
import Badge from '../components/Badge.jsx';

export default function HistorySection() {
  const { jobHistory, showDash, setModal } = useApp();
  return (
    <>
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>All past scans</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>Job History</div>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {jobHistory.map((j, i) => (
          <JobCard
            key={i}
            onClick={() => setModal({ type: 'jobDetail', data: { title: j.title, score: 80 + i } })}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-syne font-bold" style={{ color: 'var(--text)' }}>{j.title}</div>
              <Badge type="completed">✓ Done</Badge>
            </div>
            <div className="flex gap-4 text-xs mb-4" style={{ color: 'var(--text2)' }}>
              <span>📁 {j.count} resumes</span><span>📅 {j.date}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text2)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent2)' }} />
                Top: {j.top}
              </div>
              <button
                className="px-3 py-1 rounded-md border bg-transparent text-xs cursor-pointer"
                style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
              >
                View →
              </button>
            </div>
          </JobCard>
        ))}
        <JobCard onClick={() => showDash('new-job')}>
          <div
            className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2 rounded-xl border-2 border-dashed"
            style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
          >
            <div className="text-3xl opacity-40">+</div>
            <div className="text-sm font-medium">New job</div>
          </div>
        </JobCard>
      </div>
    </>
  );
}

