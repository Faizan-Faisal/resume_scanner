import React from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import JobCard from '../components/JobCard.jsx';
import Badge from '../components/Badge.jsx';

export default function HistorySection() {
  const { jobs, jobsLoading, showDash, setModal } = useApp();
  return (
    <>
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>All past scans</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>Job History</div>
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
        {jobsLoading && (
          <div className="text-sm" style={{ color: 'var(--text2)' }}>Loading jobs...</div>
        )}

        {!jobsLoading && (jobs || []).map((j) => (
          <JobCard key={j._id || j.id} onClick={() => setModal({ type: 'jobDetail', data: j })}>
            <div className="flex items-center justify-between mb-1">
              <div className="font-syne font-bold" style={{ color: 'var(--text)' }}>{j.title}</div>
              <Badge type={(j.status || '').toLowerCase() === 'completed' ? 'completed' : 'processing'}>
                {(j.status || 'Open')}
              </Badge>
            </div>
            <div className="flex gap-4 text-xs mb-4" style={{ color: 'var(--text2)' }}>
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

