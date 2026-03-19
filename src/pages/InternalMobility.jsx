import { useState, useMemo } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ModelPage from '../components/ModelPage';
import { ROLES } from '../data/syntheticData';
import { SKILL_TAXONOMY } from '../data/syntheticData';

function adjacencyScore(roleA, roleB) {
  const intersection = roleA.skills.filter(s => roleB.skills.includes(s)).length;
  const union = new Set([...roleA.skills, ...roleB.skills]).size;
  return Math.round((intersection / union) * 100);
}

export default function InternalMobility() {
  const [currentRoleId, setCurrentRoleId] = useState('r1');

  const currentRole = ROLES.find(r => r.id === currentRoleId);

  const recommendations = useMemo(() => {
    return ROLES
      .filter(r => r.id !== currentRoleId)
      .map(r => ({
        ...r,
        score: adjacencyScore(currentRole, r),
        matched: currentRole.skills.filter(s => r.skills.includes(s)),
        gap: r.skills.filter(s => !currentRole.skills.includes(s)),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [currentRoleId]);

  const [selectedRec, setSelectedRec] = useState(null);
  const displayRole = selectedRec || recommendations[0];

  const radarData = displayRole
    ? displayRole.skills.map(skill => ({
        skill: skill.length > 12 ? skill.slice(0, 12) + '…' : skill,
        current: currentRole.skills.includes(skill) ? 100 : 0,
        target: 100,
      }))
    : [];

  return (
    <ModelPage
      number="4"
      title="Internal Mobility & Career Path Recommendation"
      badge="Talent Development"
      purpose="Surface roles, projects, or development opportunities that align employee capabilities with organizational needs — reducing dependence on informal networks and improving talent deployment speed."
      methods={['Recommender systems', 'Collaborative filtering', 'Skills adjacency modeling', 'Knowledge graph traversal']}
      inputs={['Current & historical roles', 'Skills inventories', 'Project histories', 'Learning records & certifications', 'Employee career interests', 'Internal application history']}
      caution="Historical mobility patterns can reflect uneven access to sponsorship or development opportunities. Recommendations must be explainable and developmental — not only what role fits, but what skills would improve readiness."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current role selector */}
        <div className="space-y-4">
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Current Role</h3>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={currentRoleId}
              onChange={e => { setCurrentRoleId(e.target.value); setSelectedRec(null); }}
            >
              {ROLES.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {currentRole.skills.map(s => (
                <span key={s} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>

          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Recommended Moves</h3>
            <div className="space-y-2">
              {recommendations.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setSelectedRec(rec)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    displayRole?.id === rec.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-800">{rec.title}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      rec.score >= 50 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>{rec.score}% match</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${rec.score}%` }} />
                  </div>
                  {rec.gap.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Skills gap: {rec.gap.join(', ')}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills radar */}
        <div className="sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-1">Skills Match: {currentRole.title} → {displayRole?.title}</h3>
          <p className="text-xs text-gray-500 mb-3">Click a recommendation to compare skills profiles.</p>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <Radar name="Target Role" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Radar name="Current Skills" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm">Select a role to view skills radar.</p>}

          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400 inline-block opacity-40" /> Target role skills</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block opacity-60" /> Current skills present</span>
          </div>

          {displayRole && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-semibold text-amber-800 mb-1">Development Gaps to Address:</p>
              {displayRole.gap.length > 0
                ? <div className="flex flex-wrap gap-1">{displayRole.gap.map(s => <span key={s} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">{s}</span>)}</div>
                : <p className="text-xs text-green-700">No gaps — strong readiness for this move.</p>
              }
            </div>
          )}
        </div>
      </div>
    </ModelPage>
  );
}
