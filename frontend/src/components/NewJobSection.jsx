import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import ScanView from './ScanView.jsx';

/* ── reusable input/textarea ── */
const inp = "w-full rounded-lg px-4 py-3 text-sm outline-none border transition-all duration-200 font-dm";
const inpStyle = { background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' };
const inpFocus = (e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,126,255,0.1)'; };
const inpBlur  = (e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; };

export default function NewJobSection() {
  const { showToast } = useApp();

  const [step,        setStep]        = useState(1);
  const [jobTitle,    setJobTitle]    = useState('');
  const [jobDesc,     setJobDesc]     = useState('');
  const [skillW,      setSkillW]      = useState(0.4);
  const [expW,        setExpW]        = useState(0.3);
  const [uploadTab,   setUploadTab]   = useState('zip');
  const [files,       setFiles]       = useState([]);
  const [driveUrl,    setDriveUrl]    = useState('');
  const [driveStatus, setDriveStatus] = useState('');
  const [dragging,    setDragging]    = useState(false);
  const [scanning,    setScanning]    = useState(false);

  const total      = skillW + expW;
  const weightOk   = total <= 0.7001;

  const clampExp   = (s) => { if (s + expW  > 0.7001) setExpW(Math.max(0, parseFloat((0.70 - s).toFixed(2)))); };
  const clampSkill = (e) => { if (skillW + e > 0.7001) setSkillW(Math.max(0, parseFloat((0.70 - e).toFixed(2)))); };

  const goStep2 = () => {
    if (!jobTitle.trim()) { showToast('Please enter a job title', 'error'); return; }
    if (!jobDesc.trim())  { showToast('Please enter a job description', 'error'); return; }
    setStep(2);
  };

  const startScan = () => { setStep(3); setScanning(true); showToast('Scanning started — 8 resumes queued', 'success'); };

  const addFile    = (f) => setFiles([f]);
  const fmtSize    = (b) => b > 1e6 ? `${(b / 1e6).toFixed(1)}MB` : `${(b / 1e3).toFixed(0)}KB`;

  const validateDrive = () => {
    if (!driveUrl.includes('drive.google.com')) { setDriveStatus('error'); return; }
    setDriveStatus('validating');
    setTimeout(() => { setDriveStatus('valid'); showToast('Drive folder connected — 38 resumes found', 'success'); }, 1200);
  };

  /* ── step indicator ── */
  const FlowSteps = () => (
    <div className="flex overflow-hidden rounded-xl border mb-8" style={{ borderColor: 'var(--border)' }}>
      {[['1','Job Details'],['2','Upload Resumes'],['3','Scan & Results']].map(([n, label], i) => {
        const num    = parseInt(n);
        const isDone = num < step;
        const isAct  = num === step;
        return (
          <div
            key={n}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs border-l first:border-l-0"
            style={{
              borderColor: 'var(--border)',
              color:      isDone ? 'var(--accent2)' : isAct ? 'var(--accent)' : 'var(--text3)',
              background: isDone ? 'rgba(0,212,170,0.04)' : isAct ? 'rgba(79,126,255,0.06)' : 'transparent',
              fontWeight: isAct ? 500 : 400,
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold"
              style={{
                background: isDone ? 'rgba(0,212,170,0.15)' : isAct ? 'rgba(79,126,255,0.15)' : 'var(--bg3)',
                color:      isDone ? 'var(--accent2)'       : isAct ? 'var(--accent)'          : 'var(--text3)',
              }}
            >
              {isDone ? '✓' : n}
            </div>
            {label}
          </div>
        );
      })}
    </div>
  );

  /* ── step 3: scanning ── */
  if (step === 3 && scanning) {
    return (
      <>
        <div className="mb-10">
          <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Step 3 of 3</div>
          <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>Scanning Resumes</div>
        </div>
        <FlowSteps />
        <ScanView jobTitle={jobTitle} autoStart />
      </>
    );
  }

  return (
    <>
      {/* Page header */}
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Step {step} of 3</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>
          {step === 1 ? 'Create New Job' : 'Upload Resumes'}
        </div>
      </div>

      <FlowSteps />

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="rounded-2xl p-8 border max-w-[700px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Job Title *</label>
            <input className={inp} style={inpStyle} placeholder="e.g. Senior Software Engineer"
              value={jobTitle} onChange={e => setJobTitle(e.target.value)}
              onFocus={inpFocus} onBlur={inpBlur} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            {[['Department','Engineering'],['Location','Remote / New York']].map(([label, ph]) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>{label}</label>
                <input className={inp} style={inpStyle} placeholder={ph} onFocus={inpFocus} onBlur={inpBlur} />
              </div>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Job Description *</label>
            <textarea className={`${inp} resize-y min-h-[120px]`} style={inpStyle}
              placeholder="Paste the full job description here. Be specific about requirements."
              rows={5} value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              onFocus={inpFocus} onBlur={inpBlur} />
          </div>

          {/* Weightage */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>
              Optional Weightage
              <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-medium"
                style={{ background: 'rgba(79,126,255,0.1)', color: 'var(--accent)' }}>Optional</span>
            </label>
            <div className="rounded-xl p-5 border" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text2)' }}>
                Adjust how much weight the AI gives to <strong style={{ color: 'var(--text)' }}>Skills</strong> vs{' '}
                <strong style={{ color: 'var(--text)' }}>Experience</strong>. Combined total cannot exceed{' '}
                <strong style={{ color: 'var(--accent2)' }}>0.7</strong>.
              </p>
              {[['🛠 Skills', skillW, (v) => { const s = parseFloat(v); setSkillW(s); clampExp(s); }],
                ['📈 Experience', expW, (v) => { const e = parseFloat(v); setExpW(e); clampSkill(e); }]].map(([label, val, handler]) => (
                <div key={label} className="flex items-center gap-4 mb-4">
                  <span className="text-sm w-28 shrink-0" style={{ color: 'var(--text2)' }}>{label}</span>
                  <input type="range" className="weight-slider flex-1" min="0" max="0.7" step="0.05"
                    value={val} onChange={e => handler(e.target.value)} />
                  <span className="font-syne font-bold text-base w-11 text-right" style={{ color: 'var(--text)' }}>
                    {parseFloat(val).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="text-sm" style={{ color: 'var(--text2)' }}>Combined total</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>Must be ≤ 0.70 to continue</div>
                </div>
                <div className="font-syne font-extrabold text-lg" style={{ color: weightOk ? 'var(--accent2)' : 'var(--accent3)' }}>
                  {total.toFixed(2)} {weightOk ? '✓' : '✗'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="px-8 py-3 rounded-xl text-white font-medium cursor-pointer border-none transition-all duration-200"
              style={{ background: 'var(--accent)' }}
              onClick={goStep2}
            >
              Continue to Upload →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="rounded-2xl p-8 border max-w-[700px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-6">
            <div className="font-syne font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>
              Uploading resumes for: <span style={{ color: 'var(--accent)' }}>{jobTitle}</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text2)' }}>Choose how you'd like to provide candidate resumes.</div>
          </div>

          {/* Upload tabs */}
          <div className="flex p-1 rounded-xl border w-fit mb-6" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
            {[['zip','📦 ZIP File'],['drive','☁️ Google Drive']].map(([id, label]) => (
              <button key={id}
                className="px-5 py-2 rounded-lg text-sm font-dm transition-all duration-200 cursor-pointer border-none"
                style={{
                  background: uploadTab === id ? 'var(--accent)' : 'transparent',
                  color:      uploadTab === id ? '#fff'           : 'var(--text2)',
                  fontWeight: uploadTab === id ? 500 : 400,
                }}
                onClick={() => setUploadTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ZIP upload */}
          {uploadTab === 'zip' && (
            <>
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${dragging ? 'opacity-100' : ''}`}
                style={{
                  borderColor: dragging ? 'var(--accent)' : 'rgba(79,126,255,0.3)',
                  background:  dragging ? 'rgba(79,126,255,0.05)' : 'rgba(79,126,255,0.02)',
                }}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) addFile(f); }}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="text-5xl mb-4 animate-float">📂</div>
                <div className="font-medium mb-1" style={{ color: 'var(--text)' }}>Drop your ZIP file here</div>
                <div className="text-sm" style={{ color: 'var(--text2)' }}>or click to browse — accepts .zip files containing PDF, DOC, DOCX resumes</div>
                <input type="file" id="fileInput" accept=".zip" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (f) addFile(f); }} />
              </div>
              {files.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm"
                      style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
                      <span>📦</span>
                      <span className="flex-1" style={{ color: 'var(--text)' }}>{f.name}</span>
                      <span className="text-xs" style={{ color: 'var(--text3)' }}>{fmtSize(f.size || 2400000)}</span>
                      <button className="bg-none border-none cursor-pointer text-base" style={{ color: 'var(--text3)' }}
                        onClick={() => setFiles([])}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent3)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Drive upload */}
          {uploadTab === 'drive' && (
            <>
              <div className="rounded-xl p-5 mb-5 text-sm leading-relaxed border"
                style={{ background: 'rgba(79,126,255,0.05)', borderColor: 'rgba(79,126,255,0.15)', color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)' }}>📋 How to share your Drive folder:</strong><br />
                Open Google Drive → Right-click folder → "Share" → "Anyone with link can view" → Copy link and paste below.
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Google Drive Folder URL</label>
                  <input className={inp} style={inpStyle}
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveUrl} onChange={e => setDriveUrl(e.target.value)}
                    onFocus={inpFocus} onBlur={inpBlur} />
                </div>
                <button className="px-5 py-3 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                  style={{ background: 'var(--accent)' }} onClick={validateDrive}>
                  Validate
                </button>
              </div>
              {driveStatus && (
                <div className="mt-3 text-sm">
                  {driveStatus === 'validating' && <span style={{ color: 'var(--text2)' }}>⏳ Validating...</span>}
                  {driveStatus === 'valid'      && <span style={{ color: 'var(--accent2)' }}>✓ Folder validated — 38 resumes found.</span>}
                  {driveStatus === 'error'      && <span style={{ color: 'var(--accent3)' }}>✗ Invalid Google Drive URL.</span>}
                </div>
              )}
            </>
          )}

          <div className="flex justify-between mt-8">
            <button className="px-5 py-2.5 rounded-lg border bg-transparent font-medium cursor-pointer transition-all duration-200"
              style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
              onClick={() => setStep(1)}>← Back</button>
            <button className="px-8 py-3 rounded-xl text-white font-medium border-none cursor-pointer"
              style={{ background: 'var(--accent2)' }} onClick={startScan}>
              Start Scanning ⚡
            </button>
          </div>
        </div>
      )}
    </>
  );
}
