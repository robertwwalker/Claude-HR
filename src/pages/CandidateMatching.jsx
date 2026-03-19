import { useState, useMemo } from 'react';
import ModelPage from '../components/ModelPage';
import { SKILL_TAXONOMY, CANDIDATES } from '../data/syntheticData';

function jaccardScore(required, candidate) {
  if (required.length === 0) return 0;
  const intersection = required.filter(s => candidate.includes(s)).length;
  const union = new Set([...required, ...candidate]).size;
  return Math.round((intersection / union) * 100);
}

export default function CandidateMatching() {
  const [required, setRequired] = useState(['Python', 'SQL', 'Statistics', 'Machine Learning']);

  const toggle = (skill) => {
    setRequired(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const ranked = useMemo(() =>
    CANDIDATES.map(c => ({
      ...c,
      score: jaccardScore(required, c.skills),
      matched: required.filter(s => c.skills.includes(s)),
      missing: required.filter(s => !c.skills.includes(s)),
    })).sort((a, b) => b.score - a.score),
    [required]
  );

  return (
    <ModelPage
      number="2"
      title="Candidate-to-Role Matching & Semantic Ranking"
      badge="Recruiting"
      purpose="Use NLP-driven matching to surface candidates whose experience is semantically aligned with role requirements — going beyond keyword matching to capture skills adjacency and transferable experience."
      methods={['Embeddings-based retrieval', 'Skills extraction (NER)', 'Learning-to-rank models', 'Jaccard / cosine similarity']}
      inputs={['Resumes & work histories', 'Job descriptions', 'Certifications & skills', 'Structured assessments', 'Application responses']}
      caution="The matching target should be narrow job-relevant qualification alignment, not broad cultural fit. Social profile data introduces fairness and privacy risks. These models prioritize human review, not autonomous decisions."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Job requirements selector */}
        <div className="sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
            Job Requirements <span className="text-blue-600 font-bold">({required.length} selected)</span>
          </h3>
          <p className="text-xs text-gray-500 mb-4">Toggle the skills required for this role.</p>
          <div className="flex flex-wrap gap-2">
            {SKILL_TAXONOMY.map(skill => (
              <button
                key={skill}
                onClick={() => toggle(skill)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  required.includes(skill)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {required.length === 0 && (
            <p className="text-amber-600 text-xs mt-3">⚠ Select at least one skill to see matches.</p>
          )}
        </div>

        {/* Ranked candidates */}
        <div className="sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Candidate Rankings</h3>
          <div className="space-y-4">
            {ranked.map((c, idx) => (
              <div key={c.id} className={`p-3 rounded-lg border ${idx === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-gray-800">
                    {idx === 0 && <span className="text-blue-600 mr-1">★</span>}
                    {c.name}
                  </span>
                  <span className={`text-sm font-bold ${c.score >= 60 ? 'text-green-600' : c.score >= 35 ? 'text-amber-600' : 'text-red-500'}`}>
                    {c.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${c.score}%`, backgroundColor: c.score >= 60 ? '#22c55e' : c.score >= 35 ? '#f59e0b' : '#ef4444' }}
                  />
                </div>
                <div className="flex flex-wrap gap-1 text-xs">
                  {c.matched.map(s => (
                    <span key={s} className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">✓ {s}</span>
                  ))}
                  {c.missing.map(s => (
                    <span key={s} className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded">✗ {s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModelPage>
  );
}
