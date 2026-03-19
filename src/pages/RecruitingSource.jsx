import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, FunnelChart, Funnel, LabelList,
} from 'recharts';
import ModelPage from '../components/ModelPage';
import { CHANNELS } from '../data/syntheticData';

const FUNNEL_STAGES = ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired', 'Retained 6mo'];

export default function RecruitingSource() {
  const [active, setActive] = useState({ linkedin: true, referral: true, jobboard: true, agency: false, campus: true });
  const [budgets, setBudgets] = useState({ linkedin: 200, referral: 100, jobboard: 150, agency: 50, campus: 80 });
  const [selected, setSelected] = useState('linkedin');

  const activeChannels = CHANNELS.filter(c => active[c.id]);

  const funnelData = useMemo(() => {
    const ch = CHANNELS.find(c => c.id === selected);
    if (!ch) return [];
    const n = budgets[selected] / ch.costPerApplicant;
    const screened = n * ch.convApplyToScreen;
    const interviewed = screened * ch.convScreenToInterview;
    const offered = interviewed * ch.convInterviewToOffer;
    const hired = offered * ch.convOfferToHire;
    const retained = hired * ch.conv6moRetention;
    return [
      { name: 'Applied', value: Math.round(n), fill: '#3b82f6' },
      { name: 'Screened', value: Math.round(screened), fill: '#6366f1' },
      { name: 'Interviewed', value: Math.round(interviewed), fill: '#8b5cf6' },
      { name: 'Offered', value: Math.round(offered), fill: '#a855f7' },
      { name: 'Hired', value: Math.round(hired), fill: '#22c55e' },
      { name: 'Retained 6mo', value: Math.round(retained), fill: '#10b981' },
    ];
  }, [selected, budgets]);

  const costPerHire = useMemo(() => {
    return CHANNELS.filter(c => active[c.id]).map(ch => {
      const n = budgets[ch.id] / ch.costPerApplicant;
      const hired = n * ch.convApplyToScreen * ch.convScreenToInterview * ch.convInterviewToOffer * ch.convOfferToHire;
      const cph = hired > 0 ? budgets[ch.id] / hired : 0;
      const cphq = hired > 0 ? budgets[ch.id] / (hired * (ch.conv6moRetention)) : 0;
      return { name: ch.name, 'Cost / Hire': Math.round(cph), 'Cost / Quality Hire': Math.round(cphq), quality: ch.qualityScore };
    });
  }, [active, budgets]);

  return (
    <ModelPage
      number="7"
      title="Recruiting Source & Channel Effectiveness"
      badge="Talent Acquisition"
      purpose="Determine which channels deliver the strongest outcomes across the full hiring funnel — from applications through retention — enabling smarter budget allocation and source strategy."
      methods={['Funnel / conversion analysis', 'Multi-touch attribution (Markov chains)', 'Cost-per-outcome modeling', 'Source quality scoring']}
      inputs={['Source tags & UTM parameters', 'Funnel conversion rates', 'Assessment & offer outcomes', 'Cost-per-hire & time-to-fill', 'Early tenure performance & retention']}
      caution="The fastest channel is not always the best. A source that produces quick hires may underperform over the long term. Source analytics requires a clear definition of 'value' that includes downstream outcomes."
    >
      <div className="space-y-6">
        {/* Channel toggles and budgets */}
        <div className="sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-4">Active Channels & Budget ($/month)</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map(ch => (
              <div key={ch.id} className={`p-3 rounded-lg border transition-all ${active[ch.id] ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={active[ch.id]}
                      onChange={e => setActive(p => ({ ...p, [ch.id]: e.target.checked }))}
                      className="accent-blue-600 w-4 h-4" />
                    <span className="text-sm font-semibold text-gray-800">{ch.name}</span>
                  </label>
                  <span className="text-xs text-gray-500">⭐ {ch.qualityScore}</span>
                </div>
                {active[ch.id] && (
                  <>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Budget</span>
                      <span className="font-bold text-blue-700">${budgets[ch.id]}</span>
                    </div>
                    <input type="range" className="slider" min={20} max={500} step={10}
                      value={budgets[ch.id]}
                      onChange={e => setBudgets(p => ({ ...p, [ch.id]: Number(e.target.value) }))} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Funnel for selected channel */}
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Hiring Funnel — Select Channel</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {CHANNELS.filter(c => active[c.id]).map(c => (
                <button key={c.id} onClick={() => setSelected(c.id)}
                  className={selected === c.id ? 'btn-primary' : 'btn-secondary'}>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {funnelData.map((stage, i) => (
                <div key={stage.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 text-right">{stage.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                    <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${Math.max(5, (stage.value / funnelData[0].value) * 100)}%`, backgroundColor: stage.fill }}>
                      <span className="text-white text-xs font-bold">{stage.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost comparison */}
          <div className="sim-card">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Cost per (Quality) Hire by Channel</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={costPerHire} margin={{ bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => `$${v}`} />
                <Legend />
                <Bar dataKey="Cost / Hire" fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="Cost / Quality Hire" fill="#f59e0b" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">Quality hire = hired and retained at 6 months</p>
          </div>
        </div>
      </div>
    </ModelPage>
  );
}
