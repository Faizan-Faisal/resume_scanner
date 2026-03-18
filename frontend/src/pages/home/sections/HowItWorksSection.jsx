import React from 'react';

export default function HowItWorksSection() {
  return (
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
            ['01', 'Create a Job', 'Enter the job description and set skill/experience weightages.'],
            ['02', 'Upload Resumes', 'Drop a ZIP file or paste a Google Drive folder link.'],
            ['03', 'Start Scanning', 'AI processes each resume and streams results live.'],
            ['04', 'View Rankings', 'Get a prioritized shortlist with detailed breakdowns.'],
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
  );
}

