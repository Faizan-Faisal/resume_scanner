import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import AuthLayout from './AuthLayout.jsx';
import { inp, inpBlur, inpFocus } from './authStyles.js';
import { signup } from '../../../api/authapi.js';

export default function SignupPage() {
  const { navigate, showToast, startEmailFlow } = useApp();
  const is = { background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout>
      <div className="font-syne font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>Create account</div>
      <div className="text-sm mb-8" style={{ color: 'var(--text2)' }}>Start screening resumes in minutes</div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Name</label>
        <input
          type="text"
          className={inp}
          style={is}
          placeholder="Sarah Connor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Email</label>
        <input
          type="email"
          className={inp}
          style={is}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Password</label>
        <input
          type="password"
          className={inp}
          style={is}
          placeholder="Min. 8 characters"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>

      <button
        className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-5"
        style={{ background: 'var(--accent)', opacity: loading ? 0.8 : 1 }}
        onClick={async () => {
          if (!name.trim()) { showToast('Please enter your name', 'error'); return; }
          if (!email.trim()) { showToast('Please enter your email', 'error'); return; }
          if (!pw.trim()) { showToast('Please enter a password', 'error'); return; }
          setLoading(true);
          try {
            await signup({ name: name.trim(), email: email.trim(), password: pw });
            startEmailFlow(email.trim());
            showToast('Verification code sent to your email', 'success');
            navigate('verify');
          } catch (e) {
            showToast(e?.response?.data?.detail || 'Signup failed', 'error');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Creating...' : 'Create account →'}
      </button>

      <div className="text-center text-sm" style={{ color: 'var(--text2)' }}>
        Already have an account?{' '}
        <button
          className="bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif", fontSize: 'inherit' }}
          onClick={() => navigate('login')}
        >
          Sign in
        </button>
      </div>
    </AuthLayout>
  );
}

