import React from 'react';

export default function JobCard({ children, onClick }) {
  return (
    <div
      className="rounded-2xl p-6 border cursor-pointer transition-all duration-200"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(79,126,255,0.3)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 0 40px rgba(79,126,255,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {children}
    </div>
  );
}

