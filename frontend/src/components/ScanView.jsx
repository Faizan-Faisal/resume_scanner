import React, { useState, useEffect, useRef } from 'react';
import { mockCandidates } from '../data/mockData.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function ScanView({ jobTitle = 'Senior Frontend Engineer', autoStart = false, initialData = [] }) {
  const { setModal, showToast, addJobHistory } = useApp();
  const [scanData, setScanData] = useState(initialData);
  const [pct,      setPct]      = useState(initialData.length ? Math.round((initialData.length / mockCandidates.length) * 100) : 0);
  const [complete, setComplete] = useState(false);
  const ivRef = useRef(null);

  useEffect(() => {
    let start = autoStart ? 0 : initialData.length;
    if (!autoStart && !initialData.length) return;

    ivRef.current = setInterval(() => {
      if (start >= mockCandidates.length) {
        clearInterval(ivRef.current);
        setComplete(true);
        showToast(`Scan complete! ${mockCandidates.length} resumes ranked.`, 'success');
        if (autoStart) addJobHistory({ title: jobTitle, count: mockCandidates.length, date: 'Just now', status: 'completed', top: 'Alex Johnson — 91%' });
        return;
      }
      const idx = start;
      setScanData(p => [...p, mockCandidates[idx]]);
      setPct(Math.round(((idx + 1) / mockCandidates.length) * 100));
      start++;
    }, autoStart ? 900 : 1200);

    return () => clearInterval(ivRef.current);
  
  }, []);

  const sorted = [...scanData].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-syne font-bold text-xl mb-1" style={{ color: 'var(--text)' }}>{jobTitle}</div>
          <div className="text-sm" style={{ color: 'var(--text2)' }}>{mockCandidates.length} resumes in queue</div>
        </div>
        {complete ? (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border"
            style={{ background: 'rgba(0,212,170,0.08)', borderColor: 'rgba(0,212,170,0.2)', color: 'var(--accent2)' }}
          >
            <span>✓ Complete</span>
          </div>
        ) : (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm border"
            style={{ background: 'rgba(0,212,170,0.08)', borderColor: 'rgba(0,212,170,0.2)', color: 'var(--accent2)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse-fast" style={{ background: 'var(--accent2)' }} />
            Processing
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--bg3)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,var(--accent),var(--accent2))' }}
        />
      </div>
      <div className="flex justify-between text-xs mb-8" style={{ color: 'var(--text2)' }}>
        <span>{pct}% complete</span>
        <span>{scanData.length} / {mockCandidates.length} processed</span>
      </div>

      {/* Resume list */}
      <div className="flex flex-col gap-3">
        {sorted.map((c, i) => {
          const scoreColor = c.score >= 85 ? 'var(--accent2)' : c.score >= 70 ? 'var(--accent)' : '#f59e0b';
          const initials   = c.name.split(' ').map(n => n[0]).join('');
          return (
            <div
              key={c.name}
              className="flex items-center gap-5 px-6 py-5 rounded-xl border cursor-pointer transition-all duration-200 animate-slide-in"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              onClick={() => setModal({ type: 'candidate', data: c })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--surface2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.background = 'var(--surface)'; }}
            >
              {/* Rank */}
              <div
                className="font-syne font-extrabold text-2xl w-9 text-center shrink-0"
                style={{ color: i < 3 ? 'var(--accent2)' : 'var(--text3)' }}
              >{i + 1}</div>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-syne font-bold border"
                style={{ background: 'var(--surface2)', color: 'var(--accent)', borderColor: 'var(--border)' }}
              >{initials}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm mb-0.5" style={{ color: 'var(--text)' }}>{c.name}</div>
                <div className="text-xs mb-1.5" style={{ color: 'var(--text2)' }}>{c.role}</div>
                <div className="flex gap-1.5 flex-wrap">
                  {(c.tags || []).slice(0, 3).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded text-[0.7rem] font-medium"
                      style={{ background: 'rgba(79,126,255,0.12)', color: 'var(--accent)' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Mini bars */}
              <div className="flex flex-col gap-1 w-40 shrink-0">
                {[['Skills', c.skill, 'var(--accent)'], ['Exp', c.exp, 'var(--accent2)']].map(([label, val, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-[0.65rem] w-10 shrink-0" style={{ color: 'var(--text3)' }}>{label}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <div className="text-[0.65rem] mb-0.5" style={{ color: 'var(--text3)' }}>Score</div>
                <div className="font-syne font-extrabold text-xl" style={{ color: scoreColor }}>{c.score}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing card */}
      <div
        className="flex items-center gap-4 px-6 py-4 rounded-xl border border-dashed mt-3 opacity-70"
        style={{ background: 'var(--bg3)', borderColor: 'var(--border2)' }}
      >
        {complete ? (
          <span className="text-sm" style={{ color: 'var(--accent2)' }}>✓ Scanning complete — all resumes processed</span>
        ) : (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent shrink-0 animate-spin-slow"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
            <span className="text-sm" style={{ color: 'var(--text2)' }}>Analyzing next resume...</span>
          </>
        )}
      </div>
    </div>
  );
}
