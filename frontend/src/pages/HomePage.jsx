import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { features } from '../data/mockData.jsx';

export default function HomePage() {
  const { navigate } = useApp();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="animate-fade-in">

      {/* ── HERO ── */}
      <section style={{ background: 'var(--hero-grad)', transition: 'background 0.35s' }}>
        <div className="max-w-[1200px] mx-auto px-12 pt-[140px] pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs"
            style={{ background: 'rgba(79,126,255,0.1)', borderColor: 'rgba(79,126,255,0.25)', color: 'var(--accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: 'var(--accent2)' }} />
            AI-Powered Recruitment Platform
          </div>

          {/* Headline */}
          <h1 className="font-syne font-extrabold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem,6vw,5.5rem)', color: 'var(--text)' }}>
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
              onClick={() => navigate('signup')}
            >
              Start for free →
            </button>
            <button
              className="px-8 py-3.5 rounded-xl border font-medium cursor-pointer bg-transparent transition-all duration-200 text-base"
              style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
              onClick={() => scrollTo('how')}
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

      {/* ── FEATURES ── */}
      <section id="features">
        <div className="max-w-[1200px] mx-auto px-12 py-24">
          <div className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: 'var(--accent)' }}>Features</div>
          <h2 className="font-syne font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', color: 'var(--text)' }}>
            Everything you need to hire smarter
          </h2>
          <p className="text-base leading-relaxed mb-12 max-w-[520px]" style={{ color: 'var(--text2)' }}>
            From job creation to ranked shortlists — RecruitAI handles the heavy lifting so your team can focus on people, not paperwork.
          </p>
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
            {features.map(f => (
              <div
                key={f.title}
                className="relative overflow-hidden rounded-2xl p-8 border group transition-all duration-300 cursor-default"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,126,255,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(79,126,255,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: 'rgba(79,126,255,0.1)' }}>
                  {f.icon}
                </div>
                <div className="font-syne font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>{f.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: 'var(--bg2)', transition: 'background 0.3s' }}>
        <div className="max-w-[1200px] mx-auto px-12 py-24">
          <div className="text-xs tracking-widest uppercase font-medium mb-4" style={{ color: 'var(--accent)' }}>Workflow</div>
          <h2 className="font-syne font-extrabold mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', color: 'var(--text)' }}>
            From job post to ranked list in minutes
          </h2>
          <p className="text-base leading-relaxed mb-12 max-w-[520px]" style={{ color: 'var(--text2)' }}>
            A streamlined four-step flow designed for speed and precision.
          </p>
          <div className="flex gap-8 items-start flex-wrap">
            {[
              ['01','Create a Job',       'Enter the job description and set skill/experience weightages.'],
              ['02','Upload Resumes',     'Drop a ZIP file or paste a Google Drive folder link.'],
              ['03','Start Scanning',     'AI processes each resume and streams results live.'],
              ['04','View Rankings',      'Get a prioritized shortlist with detailed breakdowns.'],
            ].map(([num, title, desc], i, arr) => (
              <React.Fragment key={num}>
                <div className="flex-1 min-w-[180px]">
                  <div className="font-syne font-extrabold text-[3rem] leading-none mb-3"
                    style={{ color: 'rgba(79,126,255,0.2)' }}>{num}</div>
                  <div className="font-syne font-bold text-base mb-1.5" style={{ color: 'var(--text)' }}>{title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>{desc}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-15 h-px mt-7 shrink-0" style={{ background: 'var(--border2)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
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
                <button className="mt-5 w-full py-2 rounded-lg border bg-transparent text-sm font-medium cursor-pointer transition-all duration-200"
                  style={{ borderColor: 'var(--border2)', color: 'var(--text2)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}
                  onClick={() => navigate('signup')}>Get started</button>
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
                <button className="mt-5 w-full py-2 rounded-lg text-white text-sm font-medium border-none cursor-pointer"
                  style={{ background: 'var(--accent)' }} onClick={() => navigate('signup')}>
                  Start free trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t px-12 py-8 flex items-center justify-between flex-wrap gap-4 transition-all duration-300"
        style={{ borderColor: 'var(--border)', background: 'var(--footer-bg)' }}>
        <div className="flex items-center gap-2 font-syne font-extrabold text-xl cursor-pointer" style={{ color: 'var(--text)' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          RecruitAI
        </div>
        <div className="text-xs" style={{ color: 'var(--text3)' }}>© 2025 RecruitAI. Built for modern HR teams.</div>
        <div className="flex gap-6">
          {['Privacy','Terms','Contact'].map(l => (
            <span key={l} className="text-xs cursor-pointer hover:underline" style={{ color: 'var(--text3)' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
