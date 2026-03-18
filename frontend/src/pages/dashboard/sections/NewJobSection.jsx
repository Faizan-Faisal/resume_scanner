import React, { useMemo, useState } from 'react';
import { useApp } from '../../../context/AppContext.jsx';
import { createJob } from '../../../../api/jobapi.js';
import { uploadResumesGDrive, uploadResumesZip } from '../../../../api/resumeapi.js';
import ScanView from '../../../components/ScanView.jsx';

const INP = "w-full rounded-lg px-4 py-3 text-sm outline-none border transition-all duration-200 font-dm";
const INP_STYLE = { background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' };
const onInpFocus = (e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,126,255,0.1)'; };
const onInpBlur = (e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; };

export default function NewJobSection() {
  const { showToast, showDash, refreshJobs } = useApp();

  const [step, setStep] = useState(1);
  const [createdJob, setCreatedJob] = useState(null);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');

  // weight lock: skills + experience = 0.7 always
  const [skillsW, setSkillsW] = useState(0.4);
  const experienceW = useMemo(() => parseFloat((0.7 - skillsW).toFixed(2)), [skillsW]);
  const setLockedSkills = (next) => setSkillsW(parseFloat(Math.min(0.7, Math.max(0, next)).toFixed(2)));
  const setLockedExperience = (nextExp) => setLockedSkills(0.7 - Math.min(0.7, Math.max(0, nextExp)));

  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // upload controls
  const [uploadTab, setUploadTab] = useState('zip');
  const [zipFile, setZipFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [driveStatus, setDriveStatus] = useState('');

  const jobId = createdJob?.id || createdJob?._id;

  return (
    <>
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Step {step} of 3</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>
          {step === 1 ? 'Create New Job' : step === 2 ? 'Upload Resumes' : 'Scan & Results'}
        </div>
      </div>

      <div className="flex overflow-hidden rounded-xl border mb-8 max-w-[760px]" style={{ borderColor: 'var(--border)' }}>
        {[['1', 'Job Details'], ['2', 'Upload Resumes'], ['3', 'Scan & Results']].map(([n, label]) => {
          const num = parseInt(n, 10);
          const isDone = num < step;
          const isAct = num === step;
          return (
            <div
              key={n}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs border-l first:border-l-0"
              style={{
                borderColor: 'var(--border)',
                color: isDone ? 'var(--accent2)' : isAct ? 'var(--accent)' : 'var(--text3)',
                background: isDone ? 'rgba(0,212,170,0.04)' : isAct ? 'rgba(79,126,255,0.06)' : 'transparent',
                fontWeight: isAct ? 500 : 400,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold"
                style={{
                  background: isDone ? 'rgba(0,212,170,0.15)' : isAct ? 'rgba(79,126,255,0.15)' : 'var(--bg3)',
                  color: isDone ? 'var(--accent2)' : isAct ? 'var(--accent)' : 'var(--text3)',
                }}
              >
                {isDone ? '✓' : n}
              </div>
              {label}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="rounded-2xl p-8 border max-w-[760px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-6 max-w-[680px]">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Job Title *</label>
            <input
              className={INP}
              style={INP_STYLE}
              value={jobTitle}
              placeholder="e.g. Senior Software Engineer"
              onChange={e => setJobTitle(e.target.value)}
              onFocus={onInpFocus}
              onBlur={onInpBlur}
            />
          </div>

          <div className="mb-6 max-w-[680px]">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Job Description *</label>
            <textarea
              className={`${INP} resize-y min-h-[140px]`}
              style={INP_STYLE}
              rows={6}
              value={jobDesc}
              placeholder="Paste the full job description here."
              onChange={e => setJobDesc(e.target.value)}
              onFocus={onInpFocus}
              onBlur={onInpBlur}
            />
          </div>

          <div className="mb-7 max-w-[680px]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text2)' }}>Weightage (locked total = 0.70)</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>Skills + Experience is fixed at 0.70 (semantic is fixed at 0.30)</div>
              </div>
              <div className="font-syne font-extrabold text-base" style={{ color: 'var(--accent2)' }}>0.70 ✓</div>
            </div>

            {[
              ['🛠 Skills', skillsW, (v) => setLockedSkills(parseFloat(v))],
              ['📈 Experience', experienceW, (v) => setLockedExperience(parseFloat(v))],
            ].map(([label, val, handler]) => (
              <div key={label} className="flex items-center gap-4 mb-4">
                <span className="text-sm w-28 shrink-0" style={{ color: 'var(--text2)' }}>{label}</span>
                <input
                  type="range"
                  className="weight-slider flex-1"
                  min="0"
                  max="0.7"
                  step="0.05"
                  value={val}
                  onChange={e => handler(e.target.value)}
                />
                <span className="font-syne font-bold text-base w-11 text-right" style={{ color: 'var(--text)' }}>
                  {parseFloat(val).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between max-w-[680px]">
            <button
              className="px-5 py-2.5 rounded-lg border bg-transparent font-medium cursor-pointer transition-all duration-200"
              style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
              onClick={() => showDash('overview')}
            >
              ← Back
            </button>
            <button
              className="px-8 py-3 rounded-xl text-white font-medium border-none cursor-pointer transition-all duration-200"
              style={{ background: 'var(--accent)', opacity: creating ? 0.85 : 1 }}
              onClick={async () => {
                if (!jobTitle.trim()) { showToast('Please enter a job title', 'error'); return; }
                if (!jobDesc.trim()) { showToast('Please enter a job description', 'error'); return; }
                setCreating(true);
                try {
                  const job = await createJob({
                    title: jobTitle.trim(),
                    description: jobDesc.trim(),
                    weightage_scheme: { skills: skillsW, experience: experienceW },
                  });
                  setCreatedJob(job);
                  await refreshJobs();
                  showToast('Job created. Upload resumes next.', 'success');
                  setStep(2);
                } catch (e) {
                  const msg = e?.response?.data?.detail || e?.response?.data?.message || 'Failed to create job';
                  showToast(msg, 'error');
                } finally {
                  setCreating(false);
                }
              }}
            >
              {creating ? 'Creating...' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl p-8 border max-w-[760px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-6">
            <div className="font-syne font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>
              Uploading resumes for: <span style={{ color: 'var(--accent)' }}>{createdJob?.title || jobTitle}</span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text2)' }}>Choose how you'd like to provide candidate resumes.</div>
          </div>

          <div className="flex p-1 rounded-xl border w-fit mb-6" style={{ background: 'var(--bg3)', borderColor: 'var(--border)' }}>
            {[['zip', '📦 ZIP File'], ['drive', '☁️ Google Drive']].map(([id, label]) => (
              <button
                key={id}
                className="px-5 py-2 rounded-lg text-sm font-dm transition-all duration-200 cursor-pointer border-none"
                style={{
                  background: uploadTab === id ? 'var(--accent)' : 'transparent',
                  color: uploadTab === id ? '#fff' : 'var(--text2)',
                  fontWeight: uploadTab === id ? 500 : 400,
                }}
                onClick={() => setUploadTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {uploadTab === 'zip' && (
            <div className="mb-5 max-w-[680px]">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>ZIP file *</label>
              <input
                type="file"
                accept=".zip"
                className={INP}
                style={INP_STYLE}
                onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                onFocus={onInpFocus}
                onBlur={onInpBlur}
              />
              {zipFile && (
                <div className="text-xs mt-2" style={{ color: 'var(--text3)' }}>
                  Selected: <span style={{ color: 'var(--text2)' }}>{zipFile.name}</span>
                </div>
              )}
            </div>
          )}

          {uploadTab === 'drive' && (
            <>
              <div className="rounded-xl p-5 mb-5 text-sm leading-relaxed border"
                style={{ background: 'rgba(79,126,255,0.05)', borderColor: 'rgba(79,126,255,0.15)', color: 'var(--text2)' }}>
                <strong style={{ color: 'var(--text)' }}>📋 How to share your Drive folder:</strong><br />
                Open Google Drive → Right-click folder → "Share" → "Anyone with link can view" → Copy link and paste below.
              </div>
              <div className="flex gap-3 items-end max-w-[680px]">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Google Drive Folder URL *</label>
                  <input
                    className={INP}
                    style={INP_STYLE}
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveUrl}
                    onChange={e => { setDriveUrl(e.target.value); setDriveStatus(''); }}
                    onFocus={onInpFocus}
                    onBlur={onInpBlur}
                  />
                </div>
                <button
                  className="px-5 py-3 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                  style={{ background: 'var(--accent)' }}
                  onClick={() => {
                    if (!driveUrl.includes('drive.google.com')) { setDriveStatus('error'); return; }
                    setDriveStatus('ok');
                  }}
                >
                  Validate
                </button>
              </div>
              {driveStatus && (
                <div className="mt-3 text-sm">
                  {driveStatus === 'ok' && <span style={{ color: 'var(--accent2)' }}>✓ Looks good.</span>}
                  {driveStatus === 'error' && <span style={{ color: 'var(--accent3)' }}>✗ Invalid Google Drive URL.</span>}
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between mt-8 max-w-[680px]">
            <button
              className="px-5 py-2.5 rounded-lg border bg-transparent font-medium cursor-pointer transition-all duration-200"
              style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              className="px-8 py-3 rounded-xl text-white font-medium border-none cursor-pointer"
              style={{ background: 'var(--accent2)', opacity: uploading ? 0.85 : 1 }}
              onClick={async () => {
                if (!jobId) { showToast('Job id missing. Please create job again.', 'error'); setStep(1); return; }
                setUploading(true);
                try {
                  let res;
                  if (uploadTab === 'zip') {
                    if (!zipFile) { showToast('Please select a ZIP file', 'error'); return; }
                    res = await uploadResumesZip({ jobId, file: zipFile });
                  } else {
                    if (!driveUrl.trim()) { showToast('Please paste your Drive folder URL', 'error'); return; }
                    res = await uploadResumesGDrive({ jobId, folder_url: driveUrl.trim() });
                  }
                  showToast(`${res?.resumes_registered ?? 0} resumes queued`, 'success');
                  setStep(3);
                } catch (e) {
                  const msg = e?.response?.data?.detail || e?.response?.data?.message || 'Failed to upload resumes';
                  showToast(msg, 'error');
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? 'Uploading...' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl p-8 border max-w-[900px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-6">
            <div className="font-syne font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Live Scan Results</div>
            <div className="text-sm" style={{ color: 'var(--text2)' }}>Your resumes are being processed. Results will appear here.</div>
          </div>

          <ScanView jobTitle={createdJob?.title || jobTitle} autoStart />

          <div className="flex justify-end mt-8">
            <button
              className="px-6 py-3 rounded-xl text-white font-medium border-none cursor-pointer"
              style={{ background: 'var(--accent)' }}
              onClick={() => showDash('history')}
            >
              Go to Job History →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

