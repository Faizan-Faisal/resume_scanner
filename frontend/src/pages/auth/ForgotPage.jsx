import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import AuthLayout from './AuthLayout.jsx';
import { inp, inpBlur, inpFocus } from './authStyles.js';
import { forgotPassword } from '../../../api/authapi.js';

export default function ForgotPage() {
  const { navigate, showToast, startEmailFlow } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout>
      <div className="text-5xl mb-4 text-center">🔐</div>
      <div className="font-syne font-extrabold text-2xl mb-1 text-center" style={{ color: 'var(--text)' }}>Reset password</div>
      <div className="text-sm mb-8 text-center" style={{ color: 'var(--text2)' }}>
        Enter your email and we'll send a 6-digit code.
      </div>
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Email address</label>
        <input
          type="email"
          className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>
      <button
        className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-5"
        style={{ background: 'var(--accent)', opacity: loading ? 0.8 : 1 }}
        onClick={async () => {
          if (!email.trim()) { showToast('Please enter your email', 'error'); return; }
          setLoading(true);
          try {
            await forgotPassword({ email: email.trim() });
            startEmailFlow(email.trim());
            showToast('Reset code sent to your email', 'success');
            navigate('reset-code');
          } catch (e) {
            showToast(e?.response?.data?.detail || 'Failed to send reset code', 'error');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Sending...' : 'Send code'}
      </button>
      <div className="text-center">
        <button
          className="bg-none border-none cursor-pointer hover:underline text-sm"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif" }}
          onClick={() => navigate('login')}
        >
          ← Back to log in
        </button>
      </div>
    </AuthLayout>
  );
}

