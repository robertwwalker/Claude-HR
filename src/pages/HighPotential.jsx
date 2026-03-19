import { useState, useMemo } from 'react';
import ModelPage from '../components/ModelPage';
import { TALENT_POOL } from '../data/syntheticData';

const BOXES = [
  { row: 3, col: 1, label: 'Inconsistent Player', bg: 'bg-amber-100', text: 'text-amber-800' },
  { row: 3, col: 2, label: 'High Performer',      bg: 'bg-green-100', text: 'text-green-800' },
  { row: 3, col: 3, label: 'Star',                bg: 'bg-green-200', text: 'text-green-900' },
  { row: 2, col: 1, label: 'Underperformer',      bg: 'bg-red-100',   text: 'text-red-800'   },
  { row: 2, col: 2, label: 'Core Contributor',    bg: 'bg-blue-100',  text: 'text-blue-800'  },
  { row: 2, col: 3, label: 'High Potential',      bg: 'bg-blue-200',  text: 'text-blue-900'  },
  { row: 1, col: 1, label: 'Risk',                bg: 'bg-red-200',   text: 'text-red-900'   },
  { row: 1, col: 2, label: 'Developing',          bg: 'bg-gray-100',  text: 'text-gray-700'  },
  { row: 1, col: 3, label: 'Diamond in Rough',    bg: 'bg-purple-100',text: 'text-purple-800'},
];

function getBox(perf, potential, perfWeight, potWeight) {
  const normPerf = perf / 5;
  const normPot  = potential / 5;
  const score = normPerf * perfWeight + normPot * potWeight;
  // col = performance tier, row = potential tier
  const col = perf >= 4.3 ? 3 : perf >= 3.3 ? 2 : 1;
  const row = potential >= 4.3 ? 3 : potential >= 3.3 ? 2 : 1;
  return { col, row };
}

export default function HighPotential() {
  const [perfWeight, setPerfWeight] = useState(0.5);
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const potWeight = 1 - perfWeight;

  const placed = useMemo(() =>
    TALENT_POOL.map(e => ({
      ...e,
      ...getBox(e.perf, e.potential, perfWeight, potWeight),
    })),
    [perfWeight]
  );

  const boxEmployees = (row, col) => placed.filter(e => e.row === row && e.col === col);

  const selectedBoxData = selectedBox
    ? boxEmployees(selectedBox.row, selectedBox.col)
    : [];

  return (
    <ModelPage
      number="10"
      title="High-Potential & Succession Analytics"
      badge="Succession Planning"
      purpose="Identify patterns associated with future leadership readiness and accelerated progression — broadening the talent discussion beyond tenure, visibility, or line-manager advocacy."
      methods={['Talent segmentation (9-box)', 'Supervised progression models', 'Clustering / cohort analysis', 'Succession depth modeling']}
      inputs={['Performance history & breadth of assignments', 'Progression rate', 'Project leadership', 'Learning engagement', 'Mobility history', 'Stakeholder feedback']}
      caution="Potential is conceptually distinct from performance, and both are often measured imperfectly. The 9-box should prompt inquiry and deliberation — not function as an automated label or decision rule for individuals."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="sim-card space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Rating Weights</h3>
          <p className="text-xs text-gray-500">Adjust how performance vs. potential influences placement in the 9-box.</p>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Performance weight</label>
              <span className="text-sm font-bold text-blue-700">{Math.round(perfWeight * 100)}%</span>
            </div>
            <input type="range" className="slider" min={0.1} max={0.9} step={0.05}
              value={perfWeight} onChange={e => setPerfWeight(parseFloat(e.target.value))} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Potential weight</label>
              <span className="text-sm font-bold text-purple-700">{Math.round(potWeight * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${potWeight * 100}%` }} />
            </div>
          </div>

          {selectedEmployee && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-2">Employee Detail</p>
              <p className="text-sm font-bold text-gray-800 mb-1">{selectedEmployee.name}</p>
              <p className="text-xs text-gray-600 mb-1">{selectedEmployee.role}</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                <span>Perf: <b>{selectedEmployee.perf}</b></span>
                <span>Potential: <b>{selectedEmployee.potential}</b></span>
              </div>
              {selectedEmployee.succession.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-green-700 mb-1">Succession Pipeline:</p>
                  {selectedEmployee.succession.map(s => (
                    <span key={s} className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs mr-1 mb-1">{s}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
            <p className="font-semibold mb-1">Governance Note</p>
            <p>Segmentation reflects historical data quality. Use as one input into structured HR review, not an automated verdict.</p>
          </div>
        </div>

        {/* 9-box grid */}
        <div className="lg:col-span-2 sim-card">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-1">9-Box Talent Grid</h3>
          <p className="text-xs text-gray-500 mb-3">Click a box to see the employees placed there. Click an employee to view their profile.</p>

          {/* Y-axis label */}
          <div className="flex">
            <div className="flex flex-col items-center justify-center mr-2">
              <span className="text-xs text-gray-500 -rotate-90 whitespace-nowrap" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Potential →
              </span>
            </div>
            <div className="flex-1">
              {[3, 2, 1].map(row => (
                <div key={row} className="grid grid-cols-3 gap-1 mb-1">
                  {[1, 2, 3].map(col => {
                    const box = BOXES.find(b => b.row === row && b.col === col);
                    const emps = boxEmployees(row, col);
                    const isSelected = selectedBox?.row === row && selectedBox?.col === col;
                    return (
                      <div
                        key={col}
                        onClick={() => { setSelectedBox({ row, col }); setSelectedEmployee(null); }}
                        className={`${box.bg} rounded-lg p-2 cursor-pointer min-h-[80px] border-2 transition-all ${
                          isSelected ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <p className={`text-xs font-semibold ${box.text} mb-2 leading-tight`}>{box.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {emps.map(e => (
                            <button
                              key={e.id}
                              onClick={ev => { ev.stopPropagation(); setSelectedEmployee(e); setSelectedBox({ row, col }); }}
                              className="px-1.5 py-0.5 bg-white/70 rounded text-xs font-medium text-gray-700 hover:bg-white shadow-sm transition-all"
                              title={`${e.name} — ${e.role}`}
                            >
                              {e.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center mt-1">← Performance →</p>
            </div>
          </div>

          {selectedBox && selectedBoxData.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                {BOXES.find(b => b.row === selectedBox.row && b.col === selectedBox.col)?.label} — {selectedBoxData.length} employee(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedBoxData.map(e => (
                  <div key={e.id} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <p className="font-semibold text-gray-800">{e.name}</p>
                    <p className="text-gray-500">{e.role}</p>
                    <p className="text-gray-500">Perf {e.perf} · Pot {e.potential}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModelPage>
  );
}
