import React from 'react';

export default function HeroSection({ onGetStarted, onSeeHow }) {
  return (
    <section style={{ background: 'var(--hero-grad)', transition: 'background 0.35s' }}>
      <div className="max-w-[1200px] mx-auto px-12 pt-[140px] pb-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs"
          style={{ background: 'rgba(79,126,255,0.1)', borderColor: 'rgba(79,126,255,0.25)', color: 'var(--accent)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: 'var(--accent2)' }} />
          AI-Powered Recruitment Platform
        </div>

        {/* Headline */}
        <h1
          className="font-syne font-extrabold leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.8rem,6vw,5.5rem)', color: 'var(--text)' }}
        >
          Screen Resumes<br />
          <span className="grad-text">10× Faster</span><br />
          with AI
        </h1>

        <p className="text-lg mb-10 max-w-[560px] leading-relaxed" style={{ color: 'var(--text2)' }}>
          Upload hundreds of resumes, define what matters, and get intelligent rankings in seconds.
          Purpose-built for modern HR teams.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap mb-16">
          <button
            className="px-8 py-3.5 rounded-xl text-white font-medium border-none cursor-pointer transition-all duration-200 text-base"
            style={{ background: 'var(--accent)' }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
            onClick={onGetStarted}
          >
            Start for free →
          </button>
          <button
            className="px-8 py-3.5 rounded-xl border font-medium cursor-pointer bg-transparent transition-all duration-200 text-base"
            style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
            onClick={onSeeHow}
          >
            See how it works
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-12 flex-wrap pt-10 border-t" style={{ borderColor: 'var(--border)' }}>
          {[['10K+','Resumes scanned'],['98%','Accuracy rate'],['3 min','Avg. job setup']].map(([num, label]) => (
            <div key={label}>
              <div className="font-syne font-extrabold text-[2.2rem] grad-text">{num}</div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--text2)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

