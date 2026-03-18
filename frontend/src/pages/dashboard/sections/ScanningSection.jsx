import React from 'react';
import ScanView from '../../../components/ScanView.jsx';
import { mockCandidates } from '../../../data/mockData.jsx';

export default function ScanningSection() {
  return (
    <>
      <div className="mb-10">
        <div className="text-sm mb-1" style={{ color: 'var(--text2)' }}>Senior Frontend Engineer</div>
        <div className="font-syne font-extrabold text-3xl" style={{ color: 'var(--text)' }}>Live Scan Results</div>
      </div>
      <ScanView jobTitle="Senior Frontend Engineer" initialData={mockCandidates.slice(0, 5)} />
    </>
  );
}

