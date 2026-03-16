import React from 'react';

function Home({ onGetStarted, onScrollTo }) {
  return (
    <div className="page active" id="page-home">
      <section style={{ background: 'var(--hero-grad)', transition: 'background 0.35s' }}>
        <div className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" /> AI-Powered Recruitment Platform
          </div>
          <h1 className="hero-title">
            Screen Resumes
            <br />
            <span className="grad-text">10× Faster</span>
            <br />
            with AI
          </h1>
          <p className="hero-sub">
            Upload hundreds of resumes, define what matters, and get intelligent rankings in seconds. Purpose-built for modern HR teams.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-primary btn-lg" onClick={onGetStarted}>
              Start for free →
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => onScrollTo('how')}>
              See how it works
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num grad-text">10K+</div>
              <div className="hero-stat-label">Resumes scanned</div>
            </div>
            <div>
              <div className="hero-stat-num grad-text">98%</div>
              <div className="hero-stat-label">Accuracy rate</div>
            </div>
            <div>
              <div className="hero-stat-num grad-text">3 min</div>
              <div className="hero-stat-label">Avg. job setup</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="section">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to hire smarter</h2>
          <p className="section-sub">
            From job creation to ranked shortlists — RecruitAI handles the heavy lifting so your team can focus on people, not paperwork.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <div className="feature-title">Smart Skill Matching</div>
              <div className="feature-desc">
                NLP engine extracts and matches technical skills, certifications, and qualifications from every resume automatically.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <div className="feature-title">Custom Weightage</div>
              <div className="feature-desc">
                Balance skills vs experience with precise sliders. Set your priorities and let the algorithm rank accordingly — max 0.7 total
                bias.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">☁️</div>
              <div className="feature-title">Google Drive Integration</div>
              <div className="feature-desc">
                Paste a Google Drive folder link and we&apos;ll scan all resumes inside. No downloading, no uploading. Seamless and instant.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <div className="feature-title">Bulk ZIP Upload</div>
              <div className="feature-desc">
                Upload a ZIP containing hundreds of resumes at once. PDF, DOC, DOCX and TXT all supported automatically.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <div className="feature-title">Live Results Stream</div>
              <div className="feature-desc">
                Watch rankings appear in real-time as each resume is processed via WebSocket. See results as they happen.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <div className="feature-title">Historical Records</div>
              <div className="feature-desc">
                All past jobs and rankings saved automatically. Revisit, compare, and export any previous scan with one click.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="how-section">
        <div className="section">
          <div className="section-label">Workflow</div>
          <h2 className="section-title">From job post to ranked list in minutes</h2>
          <p className="section-sub">A streamlined four-step flow designed for speed and precision.</p>
          <div className="steps-row">
            <div className="step-item">
              <div className="step-num">01</div>
              <div className="step-title">Create a Job</div>
              <div className="step-desc">Enter the job description and set skill/experience weightages.</div>
            </div>
            <div className="step-connector" />
            <div className="step-item">
              <div className="step-num">02</div>
              <div className="step-title">Upload Resumes</div>
              <div className="step-desc">Drop a ZIP file or paste a Google Drive folder link.</div>
            </div>
            <div className="step-connector" />
            <div className="step-item">
              <div className="step-num">03</div>
              <div className="step-title">Start Scanning</div>
              <div className="step-desc">AI processes each resume and streams results live.</div>
            </div>
            <div className="step-connector" />
            <div className="step-item">
              <div className="step-num">04</div>
              <div className="step-title">View Rankings</div>
              <div className="step-desc">Get a prioritized shortlist with detailed breakdowns.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="section">
          <div className="pricing-strip">
            <div>
              <div className="section-label">Pricing</div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                Simple, transparent pricing
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', maxWidth: 400, lineHeight: 1.6 }}>
                Start free. Scale as you grow. No hidden fees.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="plan-card">
                <div
                  style={{
                    fontFamily: 'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.3rem',
                  }}
                >
                  Starter
                </div>
                <div
                  style={{
                    fontFamily: 'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '0.75rem',
                  }}
                >
                  Free
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                  50 resumes/month
                  <br />
                  2 active jobs
                  <br />
                  Basic analytics
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: '1.25rem', width: '100%' }}
                  onClick={onGetStarted}
                >
                  Get started
                </button>
              </div>
              <div
                className="plan-card"
                style={{ border: '2px solid var(--accent)', position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--accent)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 100,
                    fontWeight: 600,
                  }}
                >
                  POPULAR
                </div>
                <div
                  style={{
                    fontFamily: 'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '0.3rem',
                  }}
                >
                  Pro
                </div>
                <div
                  style={{
                    fontFamily: 'Syne, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '0.75rem',
                  }}
                >
                  $29
                  <span style={{ fontSize: '1rem', color: 'var(--text2)' }}>/mo</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                  Unlimited resumes
                  <br />
                  Unlimited jobs
                  <br />
                  Drive integration + exports
                </div>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1.25rem', width: '100%' }}
                  onClick={onGetStarted}
                >
                  Start free trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="nav-logo">RecruitAI</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>
          © 2025 RecruitAI. Built for modern HR teams.
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text3)', cursor: 'pointer' }}>Privacy</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text3)', cursor: 'pointer' }}>Terms</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text3)', cursor: 'pointer' }}>Contact</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;

