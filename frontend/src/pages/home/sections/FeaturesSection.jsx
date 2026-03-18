import React from 'react';

export default function FeaturesSection({ features }) {
  return (
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
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(79,126,255,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(79,126,255,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
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
  );
}

