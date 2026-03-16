import React from 'react';

function Signup({ onSignup, onLogin }) {
  return (
    <div className="page" id="page-signup">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Start screening smarter today — it's free</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input className="form-input" placeholder="Sarah" />
            </div>
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input className="form-input" placeholder="Connor" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Work email</label>
            <input type="email" className="form-input" placeholder="you@company.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" placeholder="Acme Corp" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min. 8 characters" />
          </div>
          <button
            className="btn btn-primary btn-block btn-lg"
            type="button"
            onClick={onSignup}
          >
            Create account →
          </button>
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text3)',
              textAlign: 'center',
              marginTop: '0.75rem',
            }}
          >
            By signing up, you agree to our Terms &amp; Privacy Policy.
          </div>
          <div className="auth-switch">
            Already have an account?{' '}
            <button className="link-btn" type="button" onClick={onLogin}>
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

