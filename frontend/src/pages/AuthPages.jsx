import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const inp = "w-full rounded-lg px-4 py-3 text-sm outline-none border transition-all duration-200 font-dm";
const inpFocus = (e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,126,255,0.1)'; };
const inpBlur  = (e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; };

function AuthWrap({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-8 pt-[90px] relative"
      style={{ background: 'var(--bg)' }}
    >
      {/* Glow backdrop */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 800px 600px at 50% 30%,rgba(79,126,255,0.06) 0%,transparent 70%)' }} />

      <div
        className="w-full max-w-[420px] relative z-10 rounded-2xl p-10 border animate-fade-in"
        style={{ background: 'var(--surface)', borderColor: 'var(--border2)' }}
      >
        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { navigate, doLogin, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  return (
    <AuthWrap>
      <div className="font-syne font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>Welcome back</div>
      <div className="text-sm mb-8" style={{ color: 'var(--text2)' }}>Sign in to your RecruitAI account</div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Email address</label>
        <input type="email" className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
          onFocus={inpFocus} onBlur={inpBlur} />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Password</label>
        <input type="password" className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)}
          onFocus={inpFocus} onBlur={inpBlur} />
      </div>
      <div className="text-right mb-5">
        <button className="text-sm bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif" }}
          onClick={() => navigate('forgot')}>Forgot password?</button>
      </div>

      <button className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer transition-all duration-200 mb-5"
        style={{ background: 'var(--accent)' }} onClick={doLogin}>Sign in</button>

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
        <button className="bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif", fontSize: 'inherit' }}
          onClick={() => navigate('signup')}>Sign up free</button>
      </div>
    </AuthWrap>
  );
}

export function SignupPage() {
  const { navigate, doLogin } = useApp();
  const is = { background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <AuthWrap>
      <div className="font-syne font-extrabold text-3xl mb-1" style={{ color: 'var(--text)' }}>Create account</div>
      <div className="text-sm mb-8" style={{ color: 'var(--text2)' }}>Start screening resumes in minutes</div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {[['First name','Sarah'],['Last name','Connor']].map(([label, ph]) => (
          <div key={label}>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>{label}</label>
            <input type="text" className={inp} style={is} placeholder={ph} onFocus={inpFocus} onBlur={inpBlur} />
          </div>
        ))}
      </div>
      {[['Work email','email','you@company.com'],['Password','password','Min. 8 characters'],['Company','text','Acme Corp']].map(([label, type, ph]) => (
        <div key={label} className="mb-5">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>{label}</label>
          <input type={type} className={inp} style={is} placeholder={ph} onFocus={inpFocus} onBlur={inpBlur} />
        </div>
      ))}

      <button className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-5"
        style={{ background: 'var(--accent)' }} onClick={doLogin}>Create account →</button>

      <div className="text-center text-sm" style={{ color: 'var(--text2)' }}>
        Already have an account?{' '}
        <button className="bg-none border-none cursor-pointer hover:underline"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif", fontSize: 'inherit' }}
          onClick={() => navigate('login')}>Sign in</button>
      </div>
    </AuthWrap>
  );
}

export function ForgotPage() {
  const { navigate, showToast } = useApp();
  return (
    <AuthWrap>
      <div className="text-5xl mb-4 text-center">🔐</div>
      <div className="font-syne font-extrabold text-2xl mb-1 text-center" style={{ color: 'var(--text)' }}>Reset password</div>
      <div className="text-sm mb-8 text-center" style={{ color: 'var(--text2)' }}>Enter your email and we'll send a reset link</div>
      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text2)' }}>Email address</label>
        <input type="email" className={inp}
          style={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
          placeholder="you@company.com" onFocus={inpFocus} onBlur={inpBlur} />
      </div>
      <button className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-5"
        style={{ background: 'var(--accent)' }}
        onClick={() => { showToast('Reset link sent! Check your inbox.', 'success'); navigate('login'); }}>
        Send reset link
      </button>
      <div className="text-center">
        <button className="bg-none border-none cursor-pointer hover:underline text-sm"
          style={{ color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif" }}
          onClick={() => navigate('login')}>← Back to log in</button>
      </div>
    </AuthWrap>
  );
}
