import React from 'react';
import { useApp } from '../context/AppContext.jsx';

/* ── small helpers ── */
function Tag({ label }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: 'rgba(79,126,255,0.12)', color: 'var(--accent)' }}
    >
      {label}
    </span>
  );
}

function ProgressBar({ pct, teal = false }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: teal
            ? 'linear-gradient(90deg,var(--accent2),#00e8bb)'
            : 'linear-gradient(90deg,var(--accent),var(--accent2))',
        }}
      />
    </div>
  );
}

/* ── Candidate detail ── */
function CandidateModal({ c, onClose }) {
  const { showToast } = useApp();
  const { name, role, score, skill, exp, tags } = c;

  const scoreColor = score >= 85 ? 'var(--accent2)' : score >= 70 ? 'var(--accent)' : '#f59e0b';
  const circ = 2 * Math.PI * 30;
  const dashOffset = circ * (1 - score / 100);
  const matchLabel = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Fair';
  const matchDesc  = score >= 85 ? 'Strongly recommended' : score >= 70 ? 'Recommended for review' : 'May need further evaluation';

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-syne font-bold text-xl" style={{ color: 'var(--text)' }}>{name}</div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>{role}</div>
        </div>
        <button onClick={onClose} className="text-xl leading-none bg-none border-none cursor-pointer" style={{ color: 'var(--text2)' }}>✕</button>
      </div>

      {/* Score ring + label */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 70 70" width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth="5" />
            <circle cx="35" cy="35" r="30" fill="none" stroke={scoreColor} strokeWidth="5"
              strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-syne font-extrabold text-lg"
            style={{ color: scoreColor }}>{score}%</div>
        </div>
        <div>
          <div className="text-xs mb-0.5" style={{ color: 'var(--text2)' }}>Overall Match Score</div>
          <div className="font-syne font-extrabold text-2xl" style={{ color: scoreColor }}>{matchLabel} match</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{matchDesc}</div>
        </div>
      </div>

      {/* Bars */}
      <div className="rounded-xl p-5 mb-5" style={{ background: 'var(--bg3)' }}>
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text2)' }}>
            <span>🛠 Skills match</span>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{skill}%</span>
          </div>
          <ProgressBar pct={skill} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text2)' }}>
            <span>📈 Experience match</span>
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{exp}%</span>
          </div>
          <ProgressBar pct={exp} teal />
        </div>
      </div>

      {/* Tags */}
      <div className="text-xs font-medium mb-2" style={{ color: 'var(--text2)' }}>Matched Skills</div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(tags || []).map(t => <Tag key={t} label={t} />)}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className="flex-1 py-3 px-6 rounded-xl text-white text-base font-medium cursor-pointer border-none transition-all duration-200"
          style={{ background: 'var(--accent)' }}
          onClick={() => { showToast(`Interview invite sent to ${name}`, 'success'); onClose(); }}
        >
          Schedule Interview
        </button>
        <button
          className="py-3 px-6 rounded-xl text-base font-medium border cursor-pointer bg-transparent transition-all duration-200"
          style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
          onClick={() => { showToast('Report exported', 'info'); onClose(); }}
        >
          Export Report
        </button>
      </div>
    </>
  );
}

/* ── Job detail ── */
function JobDetailModal({ job, onClose }) {
  const weights = job?.weights || job?.weightage_scheme || {};
  const requiredSkills = job?.required_skills || [];

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="font-syne font-bold text-xl" style={{ color: 'var(--text)' }}>{job?.title}</div>
          <div className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>
            Status: <span style={{ color: 'var(--text)' }}>{job?.status || '—'}</span>
            {' · '}
            Created: <span style={{ color: 'var(--text)' }}>{job?.created_at ? String(job.created_at).slice(0, 10) : '—'}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-xl leading-none bg-none border-none cursor-pointer" style={{ color: 'var(--text2)' }}>✕</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ['Min Experience', job?.min_experience ?? '—'],
          ['Skills Weight', weights?.skills ?? '—'],
          ['Experience Weight', weights?.experience ?? '—'],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text2)' }}>{l}</div>
            <div className="font-syne font-extrabold text-2xl" style={{ color: 'var(--text)' }}>{String(v)}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="font-syne font-bold mb-3" style={{ color: 'var(--text)' }}>Job Description</div>
      <div className="text-sm leading-relaxed mb-6 whitespace-pre-wrap" style={{ color: 'var(--text2)' }}>
        {job?.description || '—'}
      </div>

      {/* Required skills */}
      <div className="font-syne font-bold mb-3" style={{ color: 'var(--text)' }}>Required Skills</div>
      {requiredSkills.length ? (
        <div className="flex flex-wrap gap-2 mb-6">
          {requiredSkills.map((s) => <Tag key={String(s)} label={String(s)} />)}
        </div>
      ) : (
        <div className="text-sm mb-6" style={{ color: 'var(--text2)' }}>—</div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 py-3 px-6 rounded-xl text-white font-medium cursor-pointer border-none"
          style={{ background: 'var(--accent)' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </>
  );
}

/* ── Root modal ── */
export default function Modal() {
  const { modal, setModal } = useApp();
  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-8 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
    >
      <div
        className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl p-8 border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border2)', boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}
      >
        {modal.type === 'candidate' && <CandidateModal c={modal.data} onClose={() => setModal(null)} />}
        {modal.type === 'jobDetail' && <JobDetailModal job={modal.data} onClose={() => setModal(null)} />}
      </div>
    </div>
  );
}
