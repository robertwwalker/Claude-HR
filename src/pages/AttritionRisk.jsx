import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ModelPage from '../components/ModelPage';

const COEFFICIENTS = {
  tenure:          { weight: -0.12, label: 'Tenure (yrs)',           direction: 'lower risk' },
  payRatio:        { weight: -1.8,  label: 'Pay vs. Market (ratio)', direction: 'lower risk' },
  engagement:      { weight: -0.4,  label: 'Engagement Score',       direction: 'lower risk' },
  managerChanges:  { weight:  0.25, label: 'Manager Changes (#)',    direction: 'higher risk' },
  monthsSincePromo:{ weight:  0.018,label: 'Months Since Promotion', direction: 'higher risk' },
};

const INTERCEPT = 2.1;

function logistic(x) {
  return 1 / (1 + Math.exp(-x));
}

export default function AttritionRisk() {
  const [inputs, setInputs] = useState({
    tenure: 3,
    payRatio: 1.0,
    engagement: 3,
    managerChanges: 1,
    monthsSincePromo: 18,
  });

  const { riskPct, contributions } = useMemo(() => {
    const logit = INTERCEPT +
      COEFFICIENTS.tenure.weight * inputs.tenure +
      COEFFICIENTS.payRatio.weight * inputs.payRatio +
      COEFFICIENTS.engagement.weight * inputs.engagement +
      COEFFICIENTS.managerChanges.weight * inputs.managerChanges +
      COEFFICIENTS.monthsSincePromo.weight * inputs.monthsSincePromo;

    const prob = logistic(logit);
    const riskPct = Math.round(prob * 100);

    const contributions = Object.entries(COEFFICIENTS).map(([key, meta]) => {
      const raw = meta.weight * inputs[key];
      return {
        name: meta.label,
        value: Math.abs(raw),
        isRisk: raw > 0,
        direction: meta.direction,
      };
    }).sort((a, b) => b.value - a.value);

    return { riskPct, contributions };
  }, [inputs]);

  const riskColor = riskPct < 30 ? '#22c55e' : riskPct < 60 ? '#f59e0b' : '#ef4444';
  const riskLabel = riskPct < 30 ? 'Low Risk' : riskPct < 60 ? 'Moderate Risk' : 'High Risk';

  const set = (key, val) => setInputs(prev => ({ ...prev, [key]: parseFloat(val) }));

  return (
    <ModelPage
      number="1"
      title="Employee Attrition Risk Modeling"
      badge="Retention Strategy"
      purpose="Estimate the likelihood that an employee will leave within a defined period and identify the factors associated with elevated risk, enabling targeted retention interventions."
      methods={['Logistic Regression', 'Gradient-Boosted Trees (XGBoost)', 'Survival / Hazard Models', 'Event-History Analysis']}
      inputs={['Tenure & role history', 'Compensation vs. market', 'Promotion history', 'Manager changes', 'Engagement survey scores', 'Attendance & work arrangement']}
      caution="Predicting exit is not the same as identifying an effective intervention. Voluntary and involuntary exits should be modeled separately. Risk scores must be linked to a concrete retention action."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="sim-card space-y-5">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Employee Profile Inputs</h3>

          <Slider label="Tenure" value={inputs.tenure} min={0} max={15} step={0.5}
            display={v => `${v} yrs`} onChange={v => set('tenure', v)} />

          <Slider label="Pay vs. Market" value={inputs.payRatio} min={0.65} max={1.40} step={0.01}
            display={v => `${Math.round(v * 100)}%`} onChange={v => set('payRatio', v)} />

          <Slider label="Engagement Score (1–5)" value={inputs.engagement} min={1} max={5} step={0.5}
            display={v => `${v} / 5`} onChange={v => set('engagement', v)} />

          <Slider label="Manager Changes (past 2 yrs)" value={inputs.managerChanges} min={0} max={5} step={1}
            display={v => `${v}`} onChange={v => set('managerChanges', v)} />

          <Slider label="Months Since Last Promotion" value={inputs.monthsSincePromo} min={0} max={60} step={1}
            display={v => `${v} mo`} onChange={v => set('monthsSincePromo', v)} />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          {/* Risk gauge */}
          <div className="sim-card flex flex-col items-center gap-2">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide self-start">12-Month Exit Risk</h3>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={riskColor}
                  strokeWidth="12" strokeDasharray={`${riskPct * 3.14} 314`}
                  strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.4s ease' }} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold" style={{ color: riskColor }}>{riskPct}%</span>
                <span className="text-xs font-medium text-gray-500 mt-0.5">{riskLabel}</span>
              </div>
            </div>
          </div>

          {/* Feature contributions */}
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Factor Contributions</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={contributions} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => v.toFixed(2)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {contributions.map((c, i) => (
                    <Cell key={i} fill={c.isRisk ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> Increases risk</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Reduces risk</span>
            </div>
          </div>
        </div>
      </div>
    </ModelPage>
  );
}

function Slider({ label, value, min, max, step, display, onChange }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-blue-700">{display(value)}</span>
      </div>
      <input type="range" className="slider" min={min} max={max} step={step}
        value={value} onChange={e => onChange(e.target.value)} />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{display(min)}</span><span>{display(max)}</span>
      </div>
    </div>
  );
}
