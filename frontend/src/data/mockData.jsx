export const mockCandidates = [
  { name: 'Alex Johnson',  role: 'React Developer, 5yr exp',      score: 91, skill: 88, exp: 95, tags: ['React','TypeScript','Node.js'] },
  { name: 'Maria Chen',    role: 'Frontend Lead, 7yr exp',        score: 87, skill: 92, exp: 82, tags: ['Vue','React','CSS'] },
  { name: 'Sam Williams',  role: 'UI Engineer, 4yr exp',          score: 83, skill: 85, exp: 80, tags: ['React','GraphQL','Sass'] },
  { name: 'Priya Patel',   role: 'Full-stack Dev, 6yr exp',       score: 79, skill: 76, exp: 83, tags: ['Angular','TypeScript'] },
  { name: 'James Kim',     role: 'Jr Frontend, 2yr exp',          score: 71, skill: 74, exp: 67, tags: ['React','JavaScript'] },
  { name: 'Nina Okafor',   role: 'Web Dev, 3yr exp',              score: 68, skill: 70, exp: 65, tags: ['JavaScript','HTML/CSS'] },
  { name: 'Luca Ferrari',  role: 'Frontend Specialist, 5yr',      score: 64, skill: 68, exp: 59, tags: ['React','Redux'] },
  { name: 'Aisha Rahman',  role: 'UI/UX Dev, 4yr exp',            score: 59, skill: 65, exp: 52, tags: ['HTML','CSS','jQuery'] },
];

export const initialJobHistory = [
  { title: 'Backend Engineer',   count: 32, date: 'Yesterday',   status: 'completed', top: 'Alex Johnson — 91%' },
  { title: 'Product Designer',   count: 24, date: '3 days ago',  status: 'completed', top: 'Maria Chen — 87%'   },
  { title: 'DevOps Lead',        count: 18, date: 'Last week',   status: 'completed', top: 'Sam Williams — 79%' },
  { title: 'Data Scientist',     count: 41, date: '2 weeks ago', status: 'completed', top: 'Priya Patel — 84%'  },
  { title: 'Mobile Developer',   count: 27, date: '3 weeks ago', status: 'completed', top: 'James Kim — 76%'    },
];

export const features = [
  { icon: '🧠', title: 'Smart Skill Matching',      desc: 'NLP engine extracts and matches technical skills, certifications, and qualifications from every resume automatically.' },
  { icon: '⚖️', title: 'Custom Weightage',           desc: 'Balance skills vs experience with precise sliders. Set your priorities and let the algorithm rank accordingly.' },
  { icon: '☁️', title: 'Google Drive Integration',  desc: "Paste a Google Drive folder link and we'll scan all resumes inside. No downloading, no uploading. Seamless and instant." },
  { icon: '📦', title: 'Bulk ZIP Upload',            desc: 'Upload a ZIP containing hundreds of resumes at once. PDF, DOC, DOCX and TXT all supported automatically.' },
  { icon: '⚡', title: 'Live Results Stream',        desc: 'Watch rankings appear in real-time as each resume is processed via WebSocket. See results as they happen.' },
  { icon: '📊', title: 'Historical Records',         desc: 'All past jobs and rankings saved automatically. Revisit, compare, and export any previous scan with one click.' },
];
