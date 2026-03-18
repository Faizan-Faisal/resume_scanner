import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import AuthLayout from './AuthLayout.jsx';
import { inp, inpBlur, inpFocus } from './authStyles.js';

export default function SignupPage() {
  const { navigate, doLogin } = useApp();
  const is = { background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <AuthLayout>
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

      <button
        className="w-full py-3 rounded-xl text-white font-medium border-none cursor-pointer mb-5"
        style={{ background: 'var(--accent)' }}
        onClick={doLogin}
      >
        Create account →
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

