import React, { useEffect, useMemo, useState } from 'react';

const mockCandidates = [
  { name: 'Alex Johnson', role: 'React Developer, 5yr exp', score: 91, skill: 88, exp: 95, tags: ['React', 'TypeScript', 'Node.js'] },
  { name: 'Maria Chen', role: 'Frontend Lead, 7yr exp', score: 87, skill: 92, exp: 82, tags: ['Vue', 'React', 'CSS'] },
  { name: 'Sam Williams', role: 'UI Engineer, 4yr exp', score: 83, skill: 85, exp: 80, tags: ['React', 'GraphQL', 'Sass'] },
  { name: 'Priya Patel', role: 'Full-stack Dev, 6yr exp', score: 79, skill: 76, exp: 83, tags: ['Angular', 'TypeScript'] },
  { name: 'James Kim', role: 'Jr Frontend, 2yr exp', score: 71, skill: 74, exp: 67, tags: ['React', 'JavaScript'] },
  { name: 'Nina Okafor', role: 'Web Dev, 3yr exp', score: 68, skill: 70, exp: 65, tags: ['JavaScript', 'HTML/CSS'] },
  { name: 'Luca Ferrari', role: 'Frontend Specialist, 5yr', score: 64, skill: 68, exp: 59, tags: ['React', 'Redux'] },
  { name: 'Aisha Rahman', role: 'UI/UX Dev, 4yr exp', score: 59, skill: 65, exp: 52, tags: ['HTML', 'CSS', 'jQuery'] },
];

const initialHistory = [
  { title: 'Backend Engineer', count: 32, date: 'Yesterday', status: 'completed', top: 'Alex Johnson — 91%' },
  { title: 'Product Designer', count: 24, date: '3 days ago', status: 'completed', top: 'Maria Chen — 87%' },
  { title: 'DevOps Lead', count: 18, date: 'Last week', status: 'completed', top: 'Sam Williams — 79%' },
  { title: 'Data Scientist', count: 41, date: '2 weeks ago', status: 'completed', top: 'Priya Patel — 84%' },
  { title: 'Mobile Developer', count: 27, date: '3 weeks ago', status: 'completed', top: 'James Kim — 76%' },
];

function Dashboard({ showToast }) {
  const [section, setSection] = useState('overview'); // overview | new-job | scanning | history
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [skillWeight, setSkillWeight] = useState(0.4);
  const [expWeight, setExpWeight] = useState(0.3);
  const [step, setStep] = useState(1); // 1,2,3 (job, upload, scan)

  const [selectedFile, setSelectedFile] = useState(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [driveStatus, setDriveStatus] = useState('');

  const [scanData, setScanData] = useState([]);
  const [scanPct, setScanPct] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [scanRunning, setScanRunning] = useState(false);

  const [history, setHistory] = useState(initialHistory);
  const [modalCandidate, setModalCandidate] = useState(null);
  const [modalJob, setModalJob] = useState(null);

  const totalWeight = useMemo(() => skillWeight + expWeight, [skillWeight, expWeight]);
  const weightValid = totalWeight <= 0.7001;

  // mimic intersection observer animations for cards/steps/stats
  useEffect(() => {
    const els = document.querySelectorAll('.feature-card, .step-item, .stat-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.animation = 'fadeIn 0.5s ease forwards';
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // scan interval logic
  useEffect(() => {
    if (!scanRunning) return undefined;
    let idx = 0;
    setScanData([]);
    setScanPct(0);
    setScanCount(0);

    const id = setInterval(() => {
      if (idx >= mockCandidates.length) {
        clearInterval(id);
        setScanRunning(false);
        showToast(`Scan complete! ${mockCandidates.length} resumes ranked.`, 'success');
        setHistory((prev) => [
          {
            title: jobTitle || 'Senior Frontend Engineer',
            count: mockCandidates.length,
            date: 'Just now',
            status: 'completed',
            top: 'Alex Johnson — 91%',
          },
          ...prev,
        ]);
        return;
      }
      setScanData((prev) => [...prev, mockCandidates[idx]]);
      const newPct = Math.round(((idx + 1) / mockCandidates.length) * 100);
      setScanPct(newPct);
      setScanCount(idx + 1);
      idx += 1;
    }, 900);

    return () => clearInterval(id);
  }, [scanRunning, jobTitle, showToast]);

  const handleWeightsChange = (type, value) => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return;

    if (type === 'skill') {
      let other = expWeight;
      if (v + other > 0.7 + 0.0001) {
        other = Math.max(0, 0.7 - v);
        setExpWeight(other);
      }
      setSkillWeight(v);
    } else {
      let other = skillWeight;
      if (v + other > 0.7 + 0.0001) {
        other = Math.max(0, 0.7 - v);
        setSkillWeight(other);
      }
      setExpWeight(v);
    }
  };

  const goToStep2 = () => {
    if (!jobTitle.trim()) {
      showToast('Please enter a job title', 'error');
      return;
    }
    if (!jobDesc.trim()) {
      showToast('Please enter a job description', 'error');
      return;
    }
    setStep(2);
  };

  const startScanning = () => {
    setStep(3);
    setSection('new-job'); // stay in new-job step-3 content
    setScanRunning(true);
    showToast(`Scanning started — ${mockCandidates.length} resumes queued`, 'success');
  };

  const startStandaloneScan = () => {
    setSection('scanning');
    setScanRunning(true);
    showToast(`Scanning started — ${mockCandidates.length} resumes queued`, 'success');
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setSelectedFile(f);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  };

  const formatSize = (b) => {
    if (!b) return '2.4MB';
    return b > 1e6 ? `${(b / 1e6).toFixed(1)}MB` : `${(b / 1e3).toFixed(0)}KB`;
  };

  const validateDrive = () => {
    if (!driveUrl.includes('drive.google.com')) {
      setDriveStatus('<span style="color:var(--accent3)">✗ Invalid Google Drive URL.</span>');
      return;
    }
    setDriveStatus('<span style="color:var(--text2)">⏳ Validating...</span>');
    setTimeout(() => {
      setDriveStatus(
        '<span style="color:var(--accent2)">✓ Folder validated — 38 resumes found.</span>',
      );
      showToast('Drive folder connected — 38 resumes found', 'success');
    }, 1200);
  };

  const sortedScan = useMemo(
    () => [...scanData].sort((a, b) => b.score - a.score),
    [scanData],
  );

  const openCandidateModal = (c) => setModalCandidate(c);
  const closeModals = () => {
    setModalCandidate(null);
    setModalJob(null);
  };

  const openJobDetail = (title, score) => {
    setModalJob({ title, score });
  };

  const flowClass = (idx) => {
    if (step > idx) return 'flow-step done';
    if (step === idx) return 'flow-step active';
    return 'flow-step';
  };

  return (
    <>
      <div className="page" id="page-dashboard">
        <div className="dash-layout">
          <aside className="sidebar">
            <div style={{ padding: '0 1.25rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  fontFamily:
                    'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                }}
              >
                Sarah Connor
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>sarah@company.com</div>
            </div>
            <div className="sidebar-section">Main</div>
            <div
              className={`sidebar-item ${section === 'overview' ? 'active' : ''}`}
              id="nav-overview"
              onClick={() => setSection('overview')}
            >
              <span className="sidebar-icon">🏠</span> Overview
            </div>
            <div
              className={`sidebar-item ${section === 'new-job' ? 'active' : ''}`}
              id="nav-new-job"
              onClick={() => {
                setSection('new-job');
                setStep(1);
              }}
            >
              <span className="sidebar-icon">✚</span> New Job
            </div>
            <div
              className={`sidebar-item ${section === 'history' ? 'active' : ''}`}
              id="nav-history"
              onClick={() => setSection('history')}
            >
              <span className="sidebar-icon">📋</span> Job History
            </div>
            <div className="sidebar-section">Account</div>
            <div
              className="sidebar-item"
              onClick={() => showToast('Settings coming soon', 'info')}
            >
              <span className="sidebar-icon">⚙️</span> Settings
            </div>
          </aside>

          <main className="dash-content">
            {/* OVERVIEW */}
            {section === 'overview' && (
              <div id="dash-overview">
                <div className="dash-header">
                  <div className="dash-greeting">Good morning 👋</div>
                  <div className="dash-title">Dashboard</div>
                </div>
                <div className="dash-cards">
                  <div className="stat-card">
                    <div className="stat-label">Total Jobs</div>
                    <div className="stat-value">7</div>
                    <div className="stat-change">↑ 2 this week</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Resumes Scanned</div>
                    <div className="stat-value">342</div>
                    <div className="stat-change">↑ 48 today</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Avg. Score</div>
                    <div className="stat-value">71%</div>
                    <div className="stat-change">↑ 3% vs last month</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Active Jobs</div>
                    <div className="stat-value">2</div>
                    <div className="stat-change">3 completed</div>
                  </div>
                </div>
                <div className="section-heading">
                  Recent Jobs
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                    type="button"
                    onClick={() => setSection('history')}
                  >
                    View all
                  </button>
                </div>
                <div className="job-cards">
                  <div
                    className="job-card"
                    onClick={() => {
                      setSection('scanning');
                      setScanData(mockCandidates.slice(0, 5));
                      setScanPct(62);
                      setScanCount(5);
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <div className="job-card-title">Senior Frontend Engineer</div>
                      <div className="badge badge-processing">Live</div>
                    </div>
                    <div className="job-card-meta">
                      <span>📁 48 resumes</span>
                      <span>📅 Today</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar" style={{ width: '62%' }} />
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text2)',
                        marginTop: 4,
                      }}
                    >
                      62% complete
                    </div>
                  </div>
                  <div
                    className="job-card"
                    onClick={() => openJobDetail('Backend Engineer', 85)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <div className="job-card-title">Backend Engineer</div>
                      <div className="badge badge-completed">Done</div>
                    </div>
                    <div className="job-card-meta">
                      <span>📁 32 resumes</span>
                      <span>📅 Yesterday</span>
                    </div>
                    <div className="job-card-footer">
                      <div className="top-candidate">
                        <div className="top-dot" />
                        <span>Top: Alex Johnson — 91%</span>
                      </div>
                    </div>
                  </div>
                  <div className="job-card" onClick={() => setSection('new-job')}>
                    <div
                      style={{
                        border: '2px dashed var(--border2)',
                        borderRadius: 12,
                        padding: '2rem',
                        textAlign: 'center',
                        height: '100%',
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: 'var(--text2)',
                      }}
                    >
                      <div style={{ fontSize: '2rem', opacity: 0.4 }}>+</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        Create new job
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NEW JOB */}
            {section === 'new-job' && (
              <div id="dash-new-job">
                <div className="dash-header">
                  <div className="dash-greeting">
                    {step === 1 && 'Step 1 of 3'}
                    {step === 2 && 'Step 2 of 3'}
                    {step === 3 && 'Step 3 of 3'}
                  </div>
                  <div className="dash-title">Create New Job</div>
                </div>
                <div className="flow-steps">
                  <div className={flowClass(1)} id="flow1">
                    <div className="flow-step-num">{step > 1 ? '✓' : '1'}</div> Job Details
                  </div>
                  <div className={flowClass(2)} id="flow2">
                    <div className="flow-step-num">{step > 2 ? '✓' : '2'}</div> Upload Resumes
                  </div>
                  <div className={flowClass(3)} id="flow3">
                    <div className="flow-step-num">3</div> Scan &amp; Results
                  </div>
                </div>

                {step === 1 && (
                  <div id="step-1" className="create-job-card">
                    <div className="form-group">
                      <label className="form-label">Job Title *</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Senior Software Engineer"
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Department</label>
                        <input className="form-input" placeholder="Engineering" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input className="form-input" placeholder="Remote / New York" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Description *</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Paste the full job description here. Be specific about requirements."
                        id="jobDesc"
                        rows={5}
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        Optional Weightage{' '}
                        <span
                          style={{
                            background: 'rgba(79,126,255,0.1)',
                            color: 'var(--accent)',
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: 100,
                            fontWeight: 500,
                          }}
                        >
                          Optional
                        </span>
                      </label>
                      <div className="weightage-box">
                        <div
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text2)',
                            marginBottom: '1rem',
                            lineHeight: 1.6,
                          }}
                        >
                          Adjust how much weight the AI gives to{' '}
                          <strong style={{ color: 'var(--text)' }}>Skills</strong> vs{' '}
                          <strong style={{ color: 'var(--text)' }}>Experience</strong>. Combined
                          total cannot exceed{' '}
                          <strong style={{ color: 'var(--accent2)' }}>0.7</strong>.
                        </div>
                        <div className="weight-row">
                          <span className="weight-label">🛠 Skills</span>
                          <input
                            type="range"
                            className="weight-slider"
                            min="0"
                            max="0.7"
                            step="0.05"
                            value={skillWeight}
                            onChange={(e) => handleWeightsChange('skill', e.target.value)}
                          />
                          <span className="weight-val" id="skillVal">
                            {skillWeight.toFixed(2)}
                          </span>
                        </div>
                        <div className="weight-row">
                          <span className="weight-label">📈 Experience</span>
                          <input
                            type="range"
                            className="weight-slider"
                            min="0"
                            max="0.7"
                            step="0.05"
                            value={expWeight}
                            onChange={(e) => handleWeightsChange('exp', e.target.value)}
                          />
                          <span className="weight-val" id="expVal">
                            {expWeight.toFixed(2)}
                          </span>
                        </div>
                        <div className="weight-total">
                          <div>
                            <div className="weight-total-label">Combined total</div>
                            <div className="weight-hint">
                              Must be ≤ 0.70 to continue
                            </div>
                          </div>
                          <div
                            className={`weight-total-val ${
                              weightValid ? 'valid' : 'invalid'
                            }`}
                            id="weightTotal"
                          >
                            {totalWeight.toFixed(2)} {weightValid ? '✓' : '✗'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '1.5rem',
                      }}
                    >
                      <button
                        className="btn btn-primary btn-lg"
                        type="button"
                        onClick={goToStep2}
                      >
                        Continue to Upload →
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div id="step-2">
                    <div className="create-job-card">
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div
                          style={{
                            fontFamily:
                              'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            marginBottom: '0.3rem',
                          }}
                          id="step2JobTitle"
                        >
                          Uploading resumes for:{' '}
                          <span style={{ color: 'var(--accent)' }}>
                            {jobTitle || '—'}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--text2)',
                          }}
                        >
                          Choose how you&apos;d like to provide candidate resumes.
                        </div>
                      </div>
                      <div className="upload-tabs">
                        {/* ZIP tab only (Drive still present below) */}
                        <button
                          className="upload-tab active"
                          type="button"
                        >
                          📦 ZIP File
                        </button>
                        <button
                          className="upload-tab"
                          type="button"
                        >
                          ☁️ Google Drive
                        </button>
                      </div>
                      <div id="upload-zip">
                        <div
                          className="dropzone"
                          id="dropzone"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('drag');
                          }}
                          onDragLeave={(e) =>
                            e.currentTarget.classList.remove('drag')
                          }
                          onDrop={handleFileDrop}
                          onClick={() =>
                            document.getElementById('fileInput')?.click()
                          }
                        >
                          <div className="dropzone-icon">📂</div>
                          <div className="dropzone-text">Drop your ZIP file here</div>
                          <div className="dropzone-hint">
                            or click to browse — accepts .zip files containing PDF, DOC,
                            DOCX resumes
                          </div>
                          <input
                            type="file"
                            id="fileInput"
                            accept=".zip"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                          />
                        </div>
                        <div className="file-list" id="fileList">
                          {selectedFile && (
                            <div className="file-item">
                              <span>📦</span>
                              <span className="file-name">
                                {selectedFile.name || 'resumes.zip'}
                              </span>
                              <span className="file-size">
                                {formatSize(selectedFile.size || 2400000)}
                              </span>
                              <button
                                className="file-remove"
                                type="button"
                                onClick={() => setSelectedFile(null)}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div id="upload-drive" style={{ marginTop: '1.5rem' }}>
                        <div
                          style={{
                            background: 'rgba(79,126,255,0.05)',
                            border: '1px solid rgba(79,126,255,0.15)',
                            borderRadius: 12,
                            padding: '1.25rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.85rem',
                            color: 'var(--text2)',
                            lineHeight: 1.6,
                          }}
                        >
                          <strong style={{ color: 'var(--text)' }}>
                            📋 How to share your Drive folder:
                          </strong>
                          <br />
                          Open Google Drive → Right-click folder → &quot;Share&quot; → &quot;Anyone
                          with link can view&quot; → Copy link and paste below.
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-end',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <label className="form-label">
                              Google Drive Folder URL
                            </label>
                            <input
                              className="form-input"
                              placeholder="https://drive.google.com/drive/folders/..."
                              id="driveUrl"
                              value={driveUrl}
                              onChange={(e) => setDriveUrl(e.target.value)}
                            />
                          </div>
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={validateDrive}
                          >
                            Validate
                          </button>
                        </div>
                        <div
                          id="driveStatus"
                          style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{ __html: driveStatus }}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '2rem',
                        }}
                      >
                        <button
                          className="btn btn-ghost"
                          type="button"
                          onClick={() => setStep(1)}
                        >
                          ← Back
                        </button>
                        <button
                          className="btn btn-teal btn-lg"
                          type="button"
                          onClick={startScanning}
                        >
                          Start Scanning ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div id="step-3">
                    <div id="dash-scan-inner">
                      <ScanView
                        title={jobTitle || 'New Job'}
                        candidates={mockCandidates}
                        sorted={sortedScan}
                        pct={scanPct}
                        count={scanCount}
                        openCandidate={openCandidateModal}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCANNING STANDALONE */}
            {section === 'scanning' && (
              <div id="dash-scanning">
                <div className="dash-header">
                  <div className="dash-greeting">Senior Frontend Engineer</div>
                  <div className="dash-title">Live Scan Results</div>
                </div>
                <ScanView
                  title="Senior Frontend Engineer"
                  candidates={mockCandidates}
                  sorted={sortedScan}
                  pct={scanPct}
                  count={scanCount}
                  openCandidate={openCandidateModal}
                  onStart={startStandaloneScan}
                />
              </div>
            )}

            {/* HISTORY */}
            {section === 'history' && (
              <div id="dash-history">
                <div className="dash-header">
                  <div className="dash-greeting">All past scans</div>
                  <div className="dash-title">Job History</div>
                </div>
                <div className="job-cards" id="historyGrid">
                  {history.map((j, i) => (
                    <div
                      key={j.title + j.date}
                      className="job-card"
                      onClick={() => openJobDetail(j.title, 80 + i)}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.4rem',
                        }}
                      >
                        <div className="job-card-title">{j.title}</div>
                        <div
                          className={`badge badge-${j.status}`}
                        >
                          {j.status === 'completed' ? '✓ Done' : j.status}
                        </div>
                      </div>
                      <div className="job-card-meta">
                        <span>📁 {j.count} resumes</span>
                        <span>📅 {j.date}</span>
                      </div>
                      <div className="job-card-footer">
                        <div className="top-candidate">
                          <div className="top-dot" />
                          <span>Top: {j.top}</span>
                        </div>
                        <button
                          className="btn btn-ghost"
                          style={{
                            fontSize: '0.78rem',
                            padding: '0.3rem 0.75rem',
                          }}
                          type="button"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                  <div
                    className="job-card"
                    onClick={() => {
                      setSection('new-job');
                      setStep(1);
                    }}
                  >
                    <div
                      style={{
                        border: '2px dashed var(--border2)',
                        borderRadius: 12,
                        padding: '2rem',
                        textAlign: 'center',
                        height: '100%',
                        minHeight: 120,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: 'var(--text2)',
                      }}
                    >
                      <div style={{ fontSize: '2rem', opacity: 0.4 }}>+</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        New job
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODALS */}
      {(modalCandidate || modalJob) && (
        <div
          className="modal-overlay"
          id="modalOverlay"
          onClick={(e) => {
            if (e.target.id === 'modalOverlay') closeModals();
          }}
        >
          <div className="modal" id="modalBox">
            {modalCandidate && <CandidateModal candidate={modalCandidate} close={closeModals} showToast={showToast} />}
            {modalJob && (
              <JobModal
                job={modalJob}
                candidates={mockCandidates}
                close={closeModals}
                openScan={() => {
                  setSection('scanning');
                  closeModals();
                  setScanRunning(true);
                }}
                showToast={showToast}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ScanView({ title, candidates, sorted, pct, count, openCandidate }) {
  return (
    <div style={{ maxWidth: 800 }}>
      <div className="scan-header">
        <div>
          <div
            style={{
              fontFamily:
                'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 700,
              fontSize: '1.2rem',
              marginBottom: '0.25rem',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
            {candidates.length} resumes in queue
          </div>
        </div>
        <div className="scan-status-badge">
          <div className="scan-pulse" /> Processing
        </div>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar" id="scanBar" style={{ width: `${pct}%` }} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: 'var(--text2)',
          marginBottom: '2rem',
        }}
      >
        <span id="scanPct">{pct}% complete</span>
        <span id="scanCount">
          {count} / {candidates.length} processed
        </span>
      </div>
      <div className="resume-grid" id="scanList">
        {sorted.map((c, i) => {
          const sc =
            c.score >= 85 ? 'score-excellent' : c.score >= 70 ? 'score-good' : 'score-ok';
          const initials = c.name
            .split(' ')
            .map((n) => n[0])
            .join('');
          return (
            <div
              key={c.name}
              className="resume-card"
              style={{ cursor: 'pointer' }}
              onClick={() => openCandidate(c)}
            >
              <div className={`resume-rank ${i < 3 ? 'top' : ''}`}>{i + 1}</div>
              <div className="resume-avatar">{initials}</div>
              <div className="resume-info">
                <div className="resume-name">{c.name}</div>
                <div className="resume-meta">{c.role}</div>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.4rem',
                    flexWrap: 'wrap',
                    marginTop: 6,
                  }}
                >
                  {(c.tags || [])
                    .slice(0, 3)
                    .map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                </div>
              </div>
              <div className="resume-bars">
                <div className="mini-bar-row">
                  <span className="mini-bar-label">Skills</span>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill skill"
                      style={{ width: `${c.skill}%` }}
                    />
                  </div>
                </div>
                <div className="mini-bar-row">
                  <span className="mini-bar-label">Exp</span>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill exp"
                      style={{ width: `${c.exp}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="resume-score">
                <div className="score-label">Score</div>
                <div className={sc}>{c.score}%</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="processing-card" id="processingCard" style={{ marginTop: '0.75rem' }}>
        <div className="spinner" />
        <span style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>
          Analyzing next resume...
        </span>
      </div>
    </div>
  );
}

function CandidateModal({ candidate: c, close, showToast }) {
  const scColor =
    c.score >= 85 ? 'var(--accent2)' : c.score >= 70 ? 'var(--accent)' : '#f59e0b';
  const circ = 2 * Math.PI * 30;
  const dash = circ * (1 - c.score / 100);

  return (
    <>
      <div className="modal-header">
        <div>
          <div className="modal-title">{c.name}</div>
          <div
            style={{
              fontSize: '0.85rem',
              color: 'var(--text2)',
              marginTop: 2,
            }}
          >
            {c.role}
          </div>
        </div>
        <button className="modal-close" type="button" onClick={close}>
          ✕
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="score-ring">
          <svg viewBox="0 0 70 70" width={80} height={80}>
            <circle
              cx="35"
              cy="35"
              r="30"
              fill="none"
              stroke="rgba(128,128,128,0.15)"
              strokeWidth="5"
            />
            <circle
              cx="35"
              cy="35"
              r="30"
              fill="none"
              stroke={scColor}
              strokeWidth="5"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
            />
          </svg>
          <div
            className="score-ring-label"
            style={{ color: scColor }}
          >
            {c.score}%
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--text2)',
              marginBottom: '0.25rem',
            }}
          >
            Overall Match Score
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontFamily:
                'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 800,
              color: scColor,
            }}
          >
            {c.score >= 85 ? 'Excellent' : c.score >= 70 ? 'Good' : 'Fair'} match
          </div>
          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--text2)',
              marginTop: 4,
            }}
          >
            {c.score >= 85
              ? 'Strongly recommended'
              : c.score >= 70
              ? 'Recommended for review'
              : 'May need further evaluation'}
          </div>
        </div>
      </div>
      <div
        style={{
          background: 'var(--bg3)',
          borderRadius: 12,
          padding: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: 'var(--text2)',
              marginBottom: '0.5rem',
            }}
          >
            <span>🛠 Skills match</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.skill}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{ width: `${c.skill}%` }} />
          </div>
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: 'var(--text2)',
              marginBottom: '0.5rem',
            }}
          >
            <span>📈 Experience match</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.exp}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar"
              style={{
                width: `${c.exp}%`,
                background: 'linear-gradient(90deg,var(--accent2),#00e8bb)',
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: '0.82rem',
          color: 'var(--text2)',
          marginBottom: '0.5rem',
          fontWeight: 500,
        }}
      >
        Matched Skills
      </div>
      <div className="skill-tags">
        {(c.tags || []).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          className="btn btn-primary btn-lg"
          style={{ flex: 1 }}
          type="button"
          onClick={() => {
            showToast(`Interview invite sent to ${c.name}`, 'success');
            close();
          }}
        >
          Schedule Interview
        </button>
        <button
          className="btn btn-ghost btn-lg"
          type="button"
          onClick={() => {
            showToast('Report exported', 'info');
            close();
          }}
        >
          Export Report
        </button>
      </div>
    </>
  );
}

function JobModal({ job, candidates, close, openScan, showToast }) {
  const { title, score } = job;
  return (
    <>
      <div className="modal-header">
        <div>
          <div className="modal-title">{title}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
            Completed scan · 32 resumes
          </div>
        </div>
        <button className="modal-close" type="button" onClick={close}>
          ✕
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="stat-card">
          <div className="stat-label">Scanned</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            32
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Score</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            {score}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top Match</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            91%
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily:
            'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 700,
          marginBottom: '1rem',
        }}
      >
        Top Candidates
      </div>
      {candidates.slice(0, 4).map((c, i) => (
        <div
          key={c.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontFamily:
                'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 800,
              color: i < 3 ? 'var(--accent2)' : 'var(--text3)',
              width: 24,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{c.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{c.role}</div>
          </div>
          <div
            style={{
              fontFamily:
                'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 700,
              color: c.score >= 85 ? 'var(--accent2)' : 'var(--accent)',
            }}
          >
            {c.score}%
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          className="btn btn-primary btn-lg"
          style={{ flex: 1 }}
          type="button"
          onClick={() => {
            openScan();
          }}
        >
          View Full Results
        </button>
        <button
          className="btn btn-ghost btn-lg"
          type="button"
          onClick={() => {
            showToast('Exported to CSV', 'info');
            close();
          }}
        >
          Export CSV
        </button>
      </div>
    </>
  );
}

export default Dashboard;

