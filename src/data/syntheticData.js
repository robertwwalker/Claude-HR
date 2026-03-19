// ─── Model 2: Candidate Matching ───────────────────────────────────────────
export const SKILL_TAXONOMY = [
  'Python', 'SQL', 'Machine Learning', 'Data Visualization', 'Excel',
  'Project Management', 'Communication', 'Statistics', 'Leadership',
  'Cloud (AWS/GCP)', 'Java', 'Product Strategy', 'UX Design', 'Finance',
];

export const CANDIDATES = [
  { id: 1, name: 'Alex Rivera', skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'] },
  { id: 2, name: 'Jordan Lee',  skills: ['Excel', 'SQL', 'Communication', 'Project Management', 'Finance'] },
  { id: 3, name: 'Sam Patel',   skills: ['Python', 'Cloud (AWS/GCP)', 'Machine Learning', 'Java', 'Statistics'] },
  { id: 4, name: 'Casey Morgan', skills: ['Leadership', 'Communication', 'Project Management', 'Product Strategy', 'Finance'] },
  { id: 5, name: 'Drew Kim',    skills: ['SQL', 'Excel', 'Data Visualization', 'Statistics', 'Communication'] },
];

// ─── Model 3: Performance Calibration ──────────────────────────────────────
export const MANAGERS = [
  { id: 'M1', name: 'Sarah C.', avgRating: 3.9, ratings: [3,4,4,5,3,4,4,3,4,5] },
  { id: 'M2', name: 'Tom R.',   avgRating: 4.6, ratings: [4,5,5,5,4,5,5,4,5,5] },
  { id: 'M3', name: 'Priya S.', avgRating: 3.2, ratings: [3,2,3,4,3,3,2,4,3,3] },
  { id: 'M4', name: 'James W.', avgRating: 3.8, ratings: [4,4,3,4,4,3,4,3,4,4] },
];

// ─── Model 4: Internal Mobility ────────────────────────────────────────────
export const ROLES = [
  { id: 'r1',  title: 'Analyst',             skills: ['SQL','Excel','Statistics','Communication'] },
  { id: 'r2',  title: 'Sr. Analyst',         skills: ['SQL','Excel','Statistics','Communication','Python'] },
  { id: 'r3',  title: 'Data Scientist',      skills: ['Python','Machine Learning','Statistics','SQL','Data Visualization'] },
  { id: 'r4',  title: 'Sr. Data Scientist',  skills: ['Python','Machine Learning','Statistics','SQL','Leadership','Data Visualization'] },
  { id: 'r5',  title: 'DS Manager',          skills: ['Leadership','Communication','Python','Project Management','Statistics'] },
  { id: 'r6',  title: 'Product Analyst',     skills: ['SQL','Product Strategy','Communication','Data Visualization','Excel'] },
  { id: 'r7',  title: 'Product Manager',     skills: ['Product Strategy','Communication','Leadership','Project Management','UX Design'] },
  { id: 'r8',  title: 'Finance Analyst',     skills: ['Finance','Excel','SQL','Communication','Statistics'] },
  { id: 'r9',  title: 'ML Engineer',         skills: ['Python','Machine Learning','Cloud (AWS/GCP)','Java','SQL'] },
  { id: 'r10', title: 'Engineering Manager', skills: ['Leadership','Java','Project Management','Communication','Cloud (AWS/GCP)'] },
];

// ─── Model 5: Pay Equity ────────────────────────────────────────────────────
export const EMPLOYEES_PAY = [
  { id:1,  name:'A.B.', group:'A', exp:2,  perf:4, level:1, salary:72000  },
  { id:2,  name:'C.D.', group:'B', exp:2,  perf:3, level:1, salary:68000  },
  { id:3,  name:'E.F.', group:'A', exp:4,  perf:4, level:2, salary:88000  },
  { id:4,  name:'G.H.', group:'B', exp:4,  perf:4, level:2, salary:81000  },
  { id:5,  name:'I.J.', group:'A', exp:6,  perf:5, level:2, salary:96000  },
  { id:6,  name:'K.L.', group:'B', exp:6,  perf:4, level:2, salary:87000  },
  { id:7,  name:'M.N.', group:'A', exp:8,  perf:5, level:3, salary:115000 },
  { id:8,  name:'O.P.', group:'B', exp:8,  perf:5, level:3, salary:104000 },
  { id:9,  name:'Q.R.', group:'A', exp:10, perf:4, level:3, salary:120000 },
  { id:10, name:'S.T.', group:'B', exp:10, perf:5, level:3, salary:112000 },
  { id:11, name:'U.V.', group:'A', exp:3,  perf:3, level:1, salary:76000  },
  { id:12, name:'W.X.', group:'B', exp:3,  perf:4, level:1, salary:71000  },
  { id:13, name:'Y.Z.', group:'A', exp:5,  perf:5, level:2, salary:93000  },
  { id:14, name:'A2.',  group:'B', exp:5,  perf:3, level:2, salary:83000  },
  { id:15, name:'B2.',  group:'A', exp:7,  perf:4, level:3, salary:108000 },
  { id:16, name:'C2.',  group:'B', exp:7,  perf:4, level:3, salary:99000  },
];

// ─── Model 7: Recruiting Source ─────────────────────────────────────────────
export const CHANNELS = [
  {
    id: 'linkedin',  name: 'LinkedIn',
    costPerApplicant: 45,
    convApplyToScreen: 0.28, convScreenToInterview: 0.55, convInterviewToOffer: 0.40,
    convOfferToHire: 0.75, conv6moRetention: 0.82,
    qualityScore: 3.8,
  },
  {
    id: 'referral',  name: 'Employee Referral',
    costPerApplicant: 10,
    convApplyToScreen: 0.52, convScreenToInterview: 0.68, convInterviewToOffer: 0.45,
    convOfferToHire: 0.85, conv6moRetention: 0.91,
    qualityScore: 4.5,
  },
  {
    id: 'jobboard', name: 'Job Boards',
    costPerApplicant: 20,
    convApplyToScreen: 0.15, convScreenToInterview: 0.40, convInterviewToOffer: 0.30,
    convOfferToHire: 0.70, conv6moRetention: 0.72,
    qualityScore: 3.2,
  },
  {
    id: 'agency',   name: 'Staffing Agency',
    costPerApplicant: 120,
    convApplyToScreen: 0.60, convScreenToInterview: 0.70, convInterviewToOffer: 0.50,
    convOfferToHire: 0.80, conv6moRetention: 0.68,
    qualityScore: 3.5,
  },
  {
    id: 'campus',   name: 'Campus Recruiting',
    costPerApplicant: 35,
    convApplyToScreen: 0.35, convScreenToInterview: 0.50, convInterviewToOffer: 0.38,
    convOfferToHire: 0.65, conv6moRetention: 0.78,
    qualityScore: 3.6,
  },
];

// ─── Model 8: Skills Gap ────────────────────────────────────────────────────
export const SKILL_DIMENSIONS = [
  'AI/ML',
  'Data Engineering',
  'Cloud Infra',
  'Cybersecurity',
  'Product Management',
  'Analytics',
  'Soft Skills',
  'Domain Expertise',
];

export const CURRENT_SUPPLY = [45, 60, 40, 35, 70, 75, 80, 65];

// ─── Model 9: Referral Network ──────────────────────────────────────────────
export const NETWORK_NODES = [
  { id: 1,  name: 'Emma T.',   dept: 'Eng',     diverse: true,  retained: true,  perf: 4 },
  { id: 2,  name: 'Liam K.',   dept: 'Eng',     diverse: false, retained: true,  perf: 5 },
  { id: 3,  name: 'Aisha M.',  dept: 'Product', diverse: true,  retained: true,  perf: 4 },
  { id: 4,  name: 'Carlos V.', dept: 'Sales',   diverse: true,  retained: false, perf: 3 },
  { id: 5,  name: 'Nina B.',   dept: 'Eng',     diverse: false, retained: true,  perf: 4 },
  { id: 6,  name: 'Raj P.',    dept: 'HR',      diverse: true,  retained: true,  perf: 5 },
  { id: 7,  name: 'Tom H.',    dept: 'Eng',     diverse: false, retained: true,  perf: 3 },
  { id: 8,  name: 'Zoe L.',    dept: 'Finance', diverse: false, retained: false, perf: 2 },
  { id: 9,  name: 'Omar F.',   dept: 'Eng',     diverse: true,  retained: true,  perf: 4 },
  { id: 10, name: 'Sara W.',   dept: 'Product', diverse: false, retained: true,  perf: 5 },
  { id: 11, name: 'Dev A.',    dept: 'Eng',     diverse: true,  retained: true,  perf: 4 },
  { id: 12, name: 'Mia C.',    dept: 'Sales',   diverse: false, retained: false, perf: 3 },
];

export const NETWORK_EDGES = [
  { source: 2, target: 1 }, { source: 2, target: 7 }, { source: 2, target: 5 },
  { source: 5, target: 9 }, { source: 10, target: 3 }, { source: 6, target: 11 },
  { source: 1, target: 4 }, { source: 7, target: 12 }, { source: 3, target: 6 },
  { source: 9, target: 11 }, { source: 10, target: 8 },
];

// ─── Model 10: High-Potential ────────────────────────────────────────────────
export const TALENT_POOL = [
  { id:1,  name:'Alice M.',   perf:4.8, potential:4.7, role:'Sr. Engineer',   succession:['VP Eng'] },
  { id:2,  name:'Bob S.',     perf:4.5, potential:3.2, role:'Product Mgr',    succession:[] },
  { id:3,  name:'Clara D.',   perf:3.1, potential:4.6, role:'Analyst',        succession:['Sr. Analyst','DS Manager'] },
  { id:4,  name:'David K.',   perf:3.0, potential:3.0, role:'Sales Rep',      succession:[] },
  { id:5,  name:'Eva L.',     perf:4.7, potential:4.9, role:'DS Manager',     succession:['VP Analytics','CTO'] },
  { id:6,  name:'Frank R.',   perf:2.1, potential:2.3, role:'HR Specialist',  succession:[] },
  { id:7,  name:'Grace H.',   perf:3.8, potential:4.0, role:'Finance Analyst',succession:['Finance Manager'] },
  { id:8,  name:'Henry P.',   perf:2.5, potential:4.2, role:'Jr. Engineer',   succession:['Sr. Engineer'] },
  { id:9,  name:'Iris T.',    perf:4.3, potential:3.5, role:'Marketing Mgr',  succession:[] },
  { id:10, name:'Jake W.',    perf:3.5, potential:3.8, role:'Operations Lead', succession:['Ops Director'] },
  { id:11, name:'Kara N.',    perf:4.6, potential:4.5, role:'Sr. Analyst',    succession:['Analytics Director'] },
  { id:12, name:'Leo C.',     perf:2.8, potential:2.0, role:'Support Spec.',  succession:[] },
];
