import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import ModelPage from '../components/ModelPage';
import { MANAGERS } from '../data/syntheticData';

function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function std(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
}

const RATING_LABELS = ['1', '2', '3', '4', '5'];

export default function PerformanceCalibration() {
  const [adjustments, setAdjustments] = useState({ M1: 0, M2: 0, M3: 0, M4: 0 });

  const managers = useMemo(() => {
    return MANAGERS.map(m => {
      const shifted = m.ratings.map(r => Math.min(5, Math.max(1, r + adjustments[m.id])));
      const avg = mean(shifted);
      return { ...m, adjustedRatings: shifted, adjustedAvg: avg };
    });
  }, [adjustments]);

  const allAdjusted = managers.flatMap(m => m.adjustedRatings);
  const globalMean = mean(allAdjusted);
  const globalStd = std(allAdjusted);

  const distributionData = RATING_LABELS.map((label, i) => {
    const obj = { rating: label };
    managers.forEach(m => {
      obj[m.name] = m.adjustedRatings.filter(r => Math.round(r) === i + 1).length;
    });
    return obj;
  });

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

  return (
    <ModelPage
      number="3"
      title="Performance Calibration & Bias Diagnostics"
      badge="Talent Management"
      purpose="Detect rating inflation, compression, drift, or systematic differences across managers and business units that may reflect bias or inconsistent standards — surfacing patterns for structured calibration review."
      methods={['Manager-effects models', 'Hierarchical regression', 'Inter-rater reliability (ICC)', 'Z-score deviation analysis', 'Fairness diagnostics']}
      inputs={['Performance ratings & manager IDs', 'Job family & org unit', 'Objective business outcomes', 'Review text characteristics', 'Historical rating trends']}
      caution="Analytics should surface patterns that merit structured review, not algorithmically overwrite managerial judgment. Ratings are socially produced and context-dependent; models highlight inconsistencies for deliberation."
    >
      <div className="space-y-6">
        {/* Manager bias adjustment */}
        <div className="sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-4">
            Simulate Manager Adjustments
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Use the sliders to explore how a calibration committee might shift a manager's ratings. The distribution chart updates in real time.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {managers.map((m, i) => {
              const zScore = globalStd > 0 ? ((m.adjustedAvg - globalMean) / globalStd).toFixed(2) : '0.00';
              const isOutlier = Math.abs(zScore) > 1.0;
              return (
                <div key={m.id} className={`p-4 rounded-lg border ${isOutlier ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                    {isOutlier && <span className="text-xs text-amber-600 font-medium">⚠ Outlier</span>}
                  </div>
                  <div className="text-xs text-gray-500 mb-3 space-y-0.5">
                    <div>Avg: <span className="font-bold text-gray-800">{m.adjustedAvg.toFixed(2)}</span></div>
                    <div>Z-score: <span className={`font-bold ${isOutlier ? 'text-amber-600' : 'text-gray-800'}`}>{zScore}</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Adjust</span>
                      <span className="font-bold text-blue-600">
                        {adjustments[m.id] >= 0 ? '+' : ''}{adjustments[m.id].toFixed(1)}
                      </span>
                    </div>
                    <input type="range" className="slider" min={-1.5} max={1.5} step={0.1}
                      value={adjustments[m.id]}
                      onChange={e => setAdjustments(prev => ({ ...prev, [m.id]: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Company mean: <span className="font-bold text-gray-800">{globalMean.toFixed(2)}</span> &nbsp;|&nbsp;
            Std dev: <span className="font-bold text-gray-800">{globalStd.toFixed(2)}</span>
          </div>
        </div>

        {/* Distribution chart */}
        <div className="sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-4">Rating Distributions by Manager</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distributionData} margin={{ bottom: 5 }}>
              <XAxis dataKey="rating" label={{ value: 'Rating', position: 'insideBottom', offset: -3 }} />
              <YAxis label={{ value: '# Employees', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip />
              <Legend />
              {managers.map((m, i) => (
                <Bar key={m.id} dataKey={m.name} fill={COLORS[i]} />
              ))}
              <ReferenceLine y={0} stroke="#000" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ModelPage>
  );
}
