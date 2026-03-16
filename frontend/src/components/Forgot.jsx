import React from 'react';

function Forgot({ onBack, showToast }) {
  const handleSubmit = () => {
    showToast('Reset link sent! Check your inbox.', 'success');
    onBack();
  };

  return (
    <div className="page" id="page-forgot">
      <div className="auth-wrap">
        <div className="auth-card">
          <div
            style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            🔐
          </div>
          <div className="auth-title" style={{ textAlign: 'center' }}>
            Reset password
          </div>
          <div className="auth-sub" style={{ textAlign: 'center' }}>
            Enter your email and we&apos;ll send a reset link
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@company.com"
            />
          </div>
          <button
            className="btn btn-primary btn-block btn-lg"
            type="button"
            onClick={handleSubmit}
          >
            Send reset link
          </button>
          <div className="auth-switch">
            <button className="link-btn" type="button" onClick={onBack}>
              ← Back to log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot;

