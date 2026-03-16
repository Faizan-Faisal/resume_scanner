import React from 'react';

function Login({ onLogin, onSignup, onForgot }) {
  return (
    <div className="page" id="page-login">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your RecruitAI account</div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@company.com"
              defaultValue="sarah@company.com"
            />
          </div>
          <div className="form-group">
            <label
              className="form-label"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>Password</span>
              <button className="link-btn" type="button" onClick={onForgot}>
                Forgot password?
              </button>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              defaultValue="password123"
            />
          </div>
          <button
            className="btn btn-primary btn-block btn-lg"
            type="button"
            onClick={onLogin}
          >
            Sign in
          </button>
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-text">or</div>
            <div className="divider-line" />
          </div>
          <button
            className="btn btn-ghost btn-block"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            type="button"
            onClick={onLogin}
          >
            🔵 Continue with Google
          </button>
          <div className="auth-switch">
            Don&apos;t have an account?{' '}
            <button className="link-btn" type="button" onClick={onSignup}>
              Sign up free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

