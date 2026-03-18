import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import AuthLayout from './AuthLayout.jsx';
import { inp, inpBlur, inpFocus } from './authStyles.js';
import { verifyEmail, resendVerification } from '../../../api/authapi.js';

export default function VerifyCodePage() {
  const { pendingEmail, showToast, clearEmailFlow, navigate } = useApp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email = pendingEmail;

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">📬</div>
        <div className="font-syne font-extrabold text-2xl mb-1" style={{ color: 'var(--text)' }}>Verify your email</div>
        <div className="text-sm" style={{ color: 'var(--text2)' }}>
          We sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{email || 'your email'}</strong>
        </div>
      </div>

      <div className="mb-5">
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

      <button
        className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-4"
        style={{ background: 'var(--accent)', opacity: loading ? 0.8 : 1 }}
        onClick={async () => {
          if (!email) { showToast('No email in context. Please sign up again.', 'error'); navigate('signup'); return; }
          if (code.length !== 6) { showToast('Please enter the 6-digit code', 'error'); return; }
          setLoading(true);
          try {
            await verifyEmail({ email, code });
            showToast('Email verified successfully', 'success');
            clearEmailFlow();
            navigate('login');
          } catch (e) {
            showToast(e?.response?.data?.detail || 'Invalid or expired code', 'error');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Verifying...' : 'Verify & continue'}
      </button>

      <button
        className="w-full py-2.5 rounded-lg border bg-transparent text-sm font-medium cursor-pointer mb-5"
        style={{ borderColor: 'var(--border2)', color: 'var(--text2)', opacity: resending ? 0.8 : 1 }}
        onClick={async () => {
          if (!email) { showToast('No email in context. Please sign up again.', 'error'); navigate('signup'); return; }
          setResending(true);
          try {
            await resendVerification({ email });
            showToast('New code sent to your email', 'success');
          } catch (e) {
            showToast(e?.response?.data?.detail || 'Failed to resend code', 'error');
          } finally {
            setResending(false);
          }
        }}
      >
        {resending ? 'Resending...' : 'Resend code'}
      </button>

      <div className="text-center text-sm" style={{ color: 'var(--text2)' }}>
        Entered the wrong email?{' '}
        <button
          className="bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif", fontSize: 'inherit' }}
          onClick={() => { clearEmailFlow(); navigate('signup'); }}
        >
          Go back to sign up
        </button>
      </div>
    </AuthLayout>
  );
}

