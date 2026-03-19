import { useState, useMemo } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ModelPage from '../components/ModelPage';
import { SKILL_DIMENSIONS, CURRENT_SUPPLY } from '../data/syntheticData';

const STRATEGY_FACTORS = [
  { id: 'automation', label: 'Automation Adoption', affects: [0, 1, 2], multiplier: 1.4 },
  { id: 'ai',         label: 'AI / ML Investment',  affects: [0, 1, 5], multiplier: 1.5 },
  { id: 'cloud',      label: 'Cloud Migration',      affects: [2, 3, 1], multiplier: 1.3 },
  { id: 'security',   label: 'Cybersecurity Focus',  affects: [3, 2],    multiplier: 1.6 },
  { id: 'global',     label: 'Global Expansion',     affects: [4, 6, 7], multiplier: 1.2 },
];

const GAP_THRESHOLDS = { critical: -20, moderate: -10 };

export default function SkillsGap() {
  const [strategies, setStrategies] = useState({ automation: 0.3, ai: 0.5, cloud: 0.2, security: 0.1, global: 0.2 });
  const [horizon, setHorizon] = useState(2);

  const demand = useMemo(() => {
    const base = [...CURRENT_SUPPLY];
    const demand = base.map((v, i) => {
      let d = v;
      STRATEGY_FACTORS.forEach(sf => {
        if (sf.affects.includes(i)) {
          d += (sf.multiplier - 1) * strategies[sf.id] * v * horizon * 0.7;
        }
      });
      return Math.min(100, Math.round(d));
    });
    return demand;
  }, [strategies, horizon]);

  const gaps = SKILL_DIMENSIONS.map((dim, i) => ({
    dim,
    supply: CURRENT_SUPPLY[i],
    demand: demand[i],
    gap: CURRENT_SUPPLY[i] - demand[i],
  })).sort((a, b) => a.gap - b.gap);

  const radarData = SKILL_DIMENSIONS.map((dim, i) => ({
    skill: dim.length > 14 ? dim.slice(0, 14) + '…' : dim,
    Supply: CURRENT_SUPPLY[i],
    Demand: demand[i],
  }));

  const setStrategy = (id, val) => setStrategies(prev => ({ ...prev, [id]: parseFloat(val) }));

  return (
    <ModelPage
      number="8"
      title="Skills Inference & Future Skills Gap Forecasting"
      badge="Workforce Planning"
      purpose="Forecast the skills an organization will need in the future and compare projected demand with current and expected internal supply — enabling proactive reskilling, redeployment, or recruiting before gaps become acute."
      methods={['Skills taxonomy mapping', 'Scenario analysis', 'Time-series demand forecasting', 'Labor market signal integration']}
      inputs={['Business strategy & product roadmap', 'Project pipeline', 'Current skills inventories', 'Job architecture', 'Hiring & attrition trends', 'External labor market data']}
      caution="Forecasts should be presented as scenarios with uncertainty ranges, not precise predictions. Business demand, technology adoption, and labor market conditions are all subject to change."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strategy controls */}
        <div className="sim-card space-y-5">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Business Strategy Inputs</h3>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Planning Horizon</label>
              <span className="text-sm font-bold text-blue-700">{horizon} yr{horizon > 1 ? 's' : ''}</span>
            </div>
            <input type="range" className="slider" min={1} max={3} step={1}
              value={horizon} onChange={e => setHorizon(Number(e.target.value))} />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>1 yr</span><span>2 yrs</span><span>3 yrs</span>
            </div>
          </div>

          {STRATEGY_FACTORS.map(sf => (
            <div key={sf.id}>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">{sf.label}</label>
                <span className="text-sm font-bold text-blue-700">{Math.round(strategies[sf.id] * 100)}%</span>
              </div>
              <input type="range" className="slider" min={0} max={1} step={0.05}
                value={strategies[sf.id]} onChange={e => setStrategy(sf.id, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {/* Radar */}
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-2">Supply vs. Projected Demand</h3>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9 }} />
                <Radar name="Current Supply" dataKey="Supply" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Projected Demand" dataKey="Demand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap table */}
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Gap Analysis (sorted by severity)</h3>
            <div className="space-y-2">
              {gaps.map(g => {
                const severity = g.gap <= GAP_THRESHOLDS.critical ? 'critical'
                  : g.gap <= GAP_THRESHOLDS.moderate ? 'moderate' : 'ok';
                const color = severity === 'critical' ? 'text-red-600 bg-red-50 border-red-200'
                  : severity === 'moderate' ? 'text-amber-600 bg-amber-50 border-amber-200'
                  : 'text-green-600 bg-green-50 border-green-200';
                return (
                  <div key={g.dim} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${color}`}>
                    <span className="font-medium w-32">{g.dim}</span>
                    <div className="flex gap-4 text-xs">
                      <span>Supply: <b>{g.supply}</b></span>
                      <span>Demand: <b>{g.demand}</b></span>
                      <span className="font-bold">Gap: {g.gap > 0 ? '+' : ''}{g.gap}</span>
                    </div>
                    <span className="capitalize font-semibold">{severity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ModelPage>
  );
}
