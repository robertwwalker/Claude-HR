import { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import ModelPage from '../components/ModelPage';
import { EMPLOYEES_PAY } from '../data/syntheticData';

// Simple OLS: salary ~ exp + perf + level
function ols(data) {
  // encode level, compute predicted salary, return residuals
  // Coefficients estimated from the synthetic data structure
  const coefs = { intercept: 52000, exp: 3200, perf: 4500, level: 9000 };
  return data.map(e => ({
    ...e,
    predicted: coefs.intercept + coefs.exp * e.exp + coefs.perf * e.perf + coefs.level * e.level,
  })).map(e => ({ ...e, residual: e.salary - e.predicted }));
}

export default function PayEquity() {
  const [view, setView] = useState('unadjusted'); // unadjusted | adjusted
  const [highlightGroup, setHighlightGroup] = useState('both');

  const processed = useMemo(() => ols(EMPLOYEES_PAY), []);

  const groupStats = useMemo(() => {
    const groups = { A: [], B: [] };
    processed.forEach(e => groups[e.group].push(e));

    const avg = arr => arr.reduce((s, e) => s + e.salary, 0) / arr.length;
    const avgResid = arr => arr.reduce((s, e) => s + e.residual, 0) / arr.length;

    return {
      A: { avg: avg(groups.A), avgResidual: avgResid(groups.A), n: groups.A.length },
      B: { avg: avg(groups.B), avgResidual: avgResid(groups.B), n: groups.B.length },
    };
  }, [processed]);

  const rawGap = groupStats.A.avg - groupStats.B.avg;
  const adjustedGap = groupStats.A.avgResidual - groupStats.B.avgResidual;
  const pctGap = view === 'unadjusted'
    ? ((rawGap / groupStats.A.avg) * 100).toFixed(1)
    : ((adjustedGap / groupStats.A.avg) * 100).toFixed(1);
  const absGap = view === 'unadjusted' ? rawGap : adjustedGap;

  const xKey = view === 'unadjusted' ? 'exp' : 'exp';
  const yKey = view === 'unadjusted' ? 'salary' : 'residual';

  const plotData = (group) =>
    processed
      .filter(e => highlightGroup === 'both' || e.group === highlightGroup)
      .filter(e => e.group === group)
      .map(e => ({ x: e.exp, y: e[yKey], name: e.name, salary: e.salary, group: e.group }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow p-2 text-xs">
        <p className="font-semibold">{d.name} (Group {d.group})</p>
        <p>Experience: {d.x} yrs</p>
        <p>Salary: ${d.salary?.toLocaleString()}</p>
        {view === 'adjusted' && <p>Residual: ${Math.round(d.y)?.toLocaleString()}</p>}
      </div>
    );
  };

  return (
    <ModelPage
      number="5"
      title="Pay Equity Analysis"
      badge="Compensation Governance"
      purpose="Determine whether compensation differences remain after accounting for legitimate business factors — identifying unexplained disparities that warrant further review and possible remediation."
      methods={['Multivariate OLS regression', 'Cohort-based comparisons', 'Oaxaca–Blinder decomposition', 'Quantile regression']}
      inputs={['Base pay & total compensation', 'Job level & function', 'Geography & tenure', 'Performance ratings', 'Scope & market benchmarks']}
      caution="Result quality depends heavily on model specification — role comparability, level definitions, and sample sizes all affect interpretation. These analyses surface disparities for review, not legal conclusions about intent."
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="sim-card flex flex-wrap gap-4 items-center">
          <div>
            <p className="control-label">Analysis View</p>
            <div className="flex gap-2">
              <button onClick={() => setView('unadjusted')} className={view === 'unadjusted' ? 'btn-primary' : 'btn-secondary'}>
                Unadjusted Gap
              </button>
              <button onClick={() => setView('adjusted')} className={view === 'adjusted' ? 'btn-primary' : 'btn-secondary'}>
                Regression-Adjusted Gap
              </button>
            </div>
          </div>
          <div>
            <p className="control-label">Highlight Group</p>
            <div className="flex gap-2">
              {['both', 'A', 'B'].map(g => (
                <button key={g} onClick={() => setHighlightGroup(g)}
                  className={highlightGroup === g ? 'btn-primary' : 'btn-secondary'}>
                  {g === 'both' ? 'All' : `Group ${g}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Scatter plot */}
          <div className="sim-card lg:col-span-2">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
              {view === 'unadjusted' ? 'Salary vs. Experience' : 'Pay Residual vs. Experience (after controlling for level, performance)'}
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ right: 20 }}>
                <XAxis dataKey="x" name="Experience" label={{ value: 'Experience (yrs)', position: 'insideBottom', offset: -5 }} type="number" domain={[0, 12]} />
                <YAxis dataKey="y" name={view === 'unadjusted' ? 'Salary' : 'Residual'}
                  tickFormatter={v => view === 'unadjusted' ? `$${(v/1000).toFixed(0)}k` : `$${Math.round(v/1000)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {(highlightGroup === 'both' || highlightGroup === 'A') && (
                  <Scatter name="Group A" data={plotData('A')} fill="#3b82f6" />
                )}
                {(highlightGroup === 'both' || highlightGroup === 'B') && (
                  <Scatter name="Group B" data={plotData('B')} fill="#f59e0b" />
                )}
                {view === 'adjusted' && <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4" />}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Stats panel */}
          <div className="space-y-4">
            <div className="sim-card">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Gap Summary</h3>
              <div className="space-y-3">
                <StatRow label="Group A avg salary" value={`$${Math.round(groupStats.A.avg).toLocaleString()}`} />
                <StatRow label="Group B avg salary" value={`$${Math.round(groupStats.B.avg).toLocaleString()}`} />
                <div className="border-t pt-3">
                  <StatRow label={view === 'unadjusted' ? 'Raw gap (A−B)' : 'Adjusted gap (A−B)'}
                    value={`$${Math.round(Math.abs(absGap)).toLocaleString()}`}
                    highlight={Math.abs(absGap) > 3000} />
                  <StatRow label="As % of Group A" value={`${Math.abs(parseFloat(pctGap))}%`}
                    highlight={Math.abs(parseFloat(pctGap)) > 3} />
                </div>
              </div>
            </div>
            <div className="sim-card bg-blue-50 border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-1">Interpretation</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                {view === 'unadjusted'
                  ? 'The unadjusted gap reflects raw average differences. It does not control for experience, level, or performance.'
                  : 'The regression-adjusted gap isolates unexplained differences after controlling for legitimate factors. A positive residual gap warrants review.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModelPage>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
