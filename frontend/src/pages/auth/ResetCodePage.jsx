import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import AuthLayout from './AuthLayout.jsx';
import { inp, inpBlur, inpFocus } from './authStyles.js';
import { resetPassword } from '../../../api/authapi.js';

export default function ResetCodePage() {
  const { pendingEmail, showToast, clearEmailFlow, navigate } = useApp();
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);

  const email = pendingEmail;

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔑</div>
        <div className="font-syne font-extrabold text-2xl mb-1" style={{ color: 'var(--text)' }}>Enter reset code</div>
        <div className="text-sm" style={{ color: 'var(--text2)' }}>
          A 6-digit code was sent to <strong style={{ color: 'var(--text)' }}>{email || 'your email'}</strong>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>6-digit code</label>
        <input
          type="text"
          maxLength={6}
          inputMode="numeric"
          className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)', letterSpacing: '0.4em', textAlign: 'center' }}
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>New password</label>
        <input
          type="password"
          className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="Min. 8 characters"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onFocus={inpFocus}
          onBlur={inpBlur}
        />
      </div>

      <button
        className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-4"
        style={{ background: 'var(--accent)', opacity: loading ? 0.8 : 1 }}
        onClick={async () => {
          if (!email) { showToast('No email in context. Please start from Forgot Password.', 'error'); navigate('forgot'); return; }
          if (code.length !== 6) { showToast('Please enter the 6-digit code', 'error'); return; }
          if (!pw.trim()) { showToast('Please enter a new password', 'error'); return; }
          setLoading(true);
          try {
            await resetPassword({ email, code, new_password: pw });
            showToast('Password reset successfully', 'success');
            clearEmailFlow();
            navigate('login');
          } catch (e) {
            showToast(e?.response?.data?.detail || 'Failed to reset password', 'error');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Updating...' : 'Update password'}
      </button>

      <div className="text-center text-sm" style={{ color: 'var(--text2)' }}>
        Remember your password?{' '}
        <button
          className="bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif", fontSize: 'inherit' }}
          onClick={() => navigate('login')}
        >
          Back to login
        </button>
      </div>
    </AuthLayout>
  );
}

