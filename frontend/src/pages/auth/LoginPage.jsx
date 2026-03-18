import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import AuthLayout from './AuthLayout.jsx';
import { inp, inpBlur, inpFocus } from './authStyles.js';

export default function LoginPage() {
  const { navigate, doLogin, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  return (
    <AuthLayout>
      <div className="font-syne font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>Welcome back</div>
      <div className="text-sm mb-8" style={{ color: 'var(--text2)' }}>Sign in to your RecruitAI account</div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Email address</label>
        <input
          type="email"
          className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Password</label>
        <input
          type="password"
          className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="••••••••"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>
      <div className="text-right mb-5">
        <button
          className="text-sm bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif" }}
          onClick={() => navigate('forgot')}
        >
          Forgot password?
        </button>
      </div>

      <button
        className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer transition-all duration-200 mb-5"
        style={{ background: 'var(--accent)' }}
        onClick={doLogin}
      >
        Sign in
      </button>

      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--text3)' }}>or continue with</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      <button
        className="w-full py-2.5 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium bg-transparent cursor-pointer transition-all duration-200"
        style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
        onClick={() => showToast('Google OAuth coming soon', 'info')}
      >
        🔵 Continue with Google
      </button>

      <div className="text-center mt-6 text-sm" style={{ color: 'var(--text2)' }}>
        Don't have an account?{' '}
        <button
          className="bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif", fontSize: 'inherit' }}
          onClick={() => navigate('signup')}
        >
          Sign up free
        </button>
      </div>
    </AuthLayout>
  );
}

