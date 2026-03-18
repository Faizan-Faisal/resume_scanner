import React from 'react';

export default function PricingSection({ onGetStarted }) {
  return (
    <section id="pricing">
      <div className="max-w-[1200px] mx-auto px-12 py-24">
        <div
          className="flex items-center justify-between flex-wrap gap-8 p-12 rounded-2xl border mt-0"
          style={{ background: 'linear-gradient(135deg,rgba(79,126,255,0.06) 0%,rgba(0,212,170,0.04) 100%)', borderColor: 'rgba(79,126,255,0.15)' }}
        >
          <div>
            <div className="text-xs tracking-widest uppercase font-medium mb-3" style={{ color: 'var(--accent)' }}>Pricing</div>
            <h2 className="font-syne font-extrabold text-3xl mb-2" style={{ color: 'var(--text)' }}>Simple, transparent pricing</h2>
            <p className="text-sm leading-relaxed max-w-[400px]" style={{ color: 'var(--text2)' }}>
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="flex gap-6 flex-wrap">
            {/* Starter */}
            <div className="rounded-2xl p-7 border min-w-[200px]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="font-syne font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Starter</div>
              <div className="font-syne font-extrabold text-3xl mb-3" style={{ color: 'var(--text)' }}>Free</div>
              <div className="text-xs leading-7" style={{ color: 'var(--text2)' }}>
                50 resumes/month<br />2 active jobs<br />Basic analytics
              </div>
              <button
                className="mt-5 w-full py-2 rounded-lg border bg-transparent text-sm font-medium cursor-pointer transition-all duration-200"
                style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
                onClick={onGetStarted}
              >
                Get started
              </button>
            </div>
            {/* Pro */}
            <div className="relative rounded-2xl p-7 min-w-[200px]" style={{ background: 'var(--surface)', border: '2px solid var(--accent)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[0.7rem] font-semibold text-white"
                style={{ background: 'var(--accent)' }}>POPULAR</div>
              <div className="font-syne font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>Pro</div>
              <div className="font-syne font-extrabold text-3xl mb-3" style={{ color: 'var(--text)' }}>
                $29<span className="text-base font-normal" style={{ color: 'var(--text2)' }}>/mo</span>
              </div>
              <div className="text-xs leading-7" style={{ color: 'var(--text2)' }}>
                Unlimited resumes<br />Unlimited jobs<br />Drive integration + exports
              </div>
              <button
                className="mt-5 w-full py-2 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                style={{ background: 'var(--accent)' }}
                onClick={onGetStarted}
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

