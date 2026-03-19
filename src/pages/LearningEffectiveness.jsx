import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ErrorBar,
} from 'recharts';
import ModelPage from '../components/ModelPage';

function normalRandom(mean, std) {
  const u1 = Math.random(), u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

function generateGroup(n, preMean, effect, noise) {
  return Array.from({ length: n }, () => {
    const pre = Math.min(100, Math.max(0, normalRandom(preMean, 10)));
    const post = Math.min(100, Math.max(0, pre + effect + normalRandom(0, noise)));
    return { pre, post, gain: post - pre };
  });
}

function meanArr(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function stdArr(arr) {
  const m = meanArr(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
}
function cohenD(g1, g2) {
  const m1 = meanArr(g1), m2 = meanArr(g2);
  const s1 = stdArr(g1), s2 = stdArr(g2);
  const pooled = Math.sqrt(((g1.length - 1) * s1 ** 2 + (g2.length - 1) * s2 ** 2) / (g1.length + g2.length - 2));
  return pooled > 0 ? (m1 - m2) / pooled : 0;
}

export default function LearningEffectiveness() {
  const [hours, setHours] = useState(16);
  const [preMean, setPreMean] = useState(55);
  const [sampleSize, setSampleSize] = useState(60);
  const [design, setDesign] = useState('rct'); // rct | quasi
  const [seed, setSeed] = useState(42);

  const { chartData, effectSize, ci, selectionBias } = useMemo(() => {
    // Seeded pseudo-random (simple)
    Math.seedrandom = null;
    const effect = Math.min(25, hours * 0.9 + 3);
    const noise = design === 'quasi' ? 14 : 9;
    const biasAdjust = design === 'quasi' ? 5 : 0; // quasi-experiment: treated group already higher-performing

    const treatment = generateGroup(sampleSize, preMean + biasAdjust, effect, noise);
    const control = generateGroup(sampleSize, preMean, 2, noise);

    const tGains = treatment.map(d => d.gain);
    const cGains = control.map(d => d.gain);

    const d = cohenD(tGains, cGains).toFixed(2);
    const se = Math.sqrt(2 / sampleSize);
    const ciLow = (parseFloat(d) - 1.96 * se).toFixed(2);
    const ciHigh = (parseFloat(d) + 1.96 * se).toFixed(2);

    const data = [
      {
        phase: 'Pre-Training',
        Treatment: parseFloat(meanArr(treatment.map(d => d.pre)).toFixed(1)),
        Control: parseFloat(meanArr(control.map(d => d.pre)).toFixed(1)),
      },
      {
        phase: 'Post-Training',
        Treatment: parseFloat(meanArr(treatment.map(d => d.post)).toFixed(1)),
        Control: parseFloat(meanArr(control.map(d => d.post)).toFixed(1)),
      },
    ];

    return {
      chartData: data,
      effectSize: d,
      ci: [ciLow, ciHigh],
      selectionBias: biasAdjust,
    };
  }, [hours, preMean, sampleSize, design, seed]);

  const effectLabel = effectSize < 0.2 ? 'Negligible' : effectSize < 0.5 ? 'Small' : effectSize < 0.8 ? 'Medium' : 'Large';
  const effectColor = effectSize < 0.2 ? '#ef4444' : effectSize < 0.5 ? '#f59e0b' : '#22c55e';

  return (
    <ModelPage
      number="6"
      title="Learning Effectiveness & Training Impact Evaluation"
      badge="L&D Analytics"
      purpose="Estimate whether a training intervention caused measurable improvement in knowledge, behavior, or business performance — moving beyond completion rates and satisfaction scores."
      methods={['Randomized controlled experiments (gold standard)', 'Matched comparison groups', 'Difference-in-differences (DiD)', 'Longitudinal regression']}
      inputs={['Pre- & post-training assessments', 'Participation & completion data', 'Control group outcomes', 'Manager observations', 'Promotion & retention outcomes']}
      caution="A training program that is well-liked may not improve capability, and one correlated with promotion may simply attract high performers. The goal is to isolate training effect from selection bias."
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="sim-card space-y-5">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Program Parameters</h3>

          <div>
            <p className="control-label">Study Design</p>
            <div className="flex gap-2">
              <button onClick={() => setDesign('rct')} className={design === 'rct' ? 'btn-primary' : 'btn-secondary'}>
                Randomized (RCT)
              </button>
              <button onClick={() => setDesign('quasi')} className={design === 'quasi' ? 'btn-primary' : 'btn-secondary'}>
                Quasi-Experimental
              </button>
            </div>
            {design === 'quasi' && (
              <p className="text-xs text-amber-600 mt-2">⚠ Treated group self-selected — likely higher baseline performance (+{selectionBias} pts simulated).</p>
            )}
          </div>

          <SliderRow label="Training Hours" value={hours} min={4} max={80} step={4}
            display={v => `${v} hrs`} onChange={setHours} />
          <SliderRow label="Baseline Score (pre-test mean)" value={preMean} min={30} max={80} step={5}
            display={v => `${v}/100`} onChange={setPreMean} />
          <SliderRow label="Sample Size (per group)" value={sampleSize} min={20} max={200} step={10}
            display={v => `n = ${v}`} onChange={setSampleSize} />

          <button onClick={() => setSeed(s => s + 1)} className="btn-secondary w-full text-center">
            🔄 Resample Data
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-4">Pre / Post Score Comparison</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={6}>
                <XAxis dataKey="phase" />
                <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Treatment" fill="#3b82f6" radius={[4,4,0,0]} />
                <Bar dataKey="Control" fill="#9ca3af" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="sim-card">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Effect Size (Cohen's d)</h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold" style={{ color: effectColor }}>{effectSize}</span>
              <span className="text-sm font-semibold pb-1" style={{ color: effectColor }}>{effectLabel} effect</span>
            </div>
            <p className="text-xs text-gray-500">95% CI: [{ci[0]}, {ci[1]}]</p>
            <div className="mt-3 bg-gray-100 rounded-full h-3 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gray-300" style={{ width: '25%' }} />
              <div className="absolute inset-y-0 left-[25%] bg-amber-300" style={{ width: '37.5%' }} />
              <div className="absolute inset-y-0 left-[62.5%] bg-green-400" style={{ width: '37.5%' }} />
              <div className="absolute inset-y-0 left-0 bg-blue-600 opacity-80 rounded-full transition-all"
                style={{ width: `${Math.min(100, parseFloat(effectSize) / 1.2 * 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0 Negligible</span><span>0.2 Small</span><span>0.5 Medium</span><span>0.8+ Large</span>
            </div>
          </div>
        </div>
      </div>
    </ModelPage>
  );
}

function SliderRow({ label, value, min, max, step, display, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-blue-700">{display(value)}</span>
      </div>
      <input type="range" className="slider" min={min} max={max} step={step}
        value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}
