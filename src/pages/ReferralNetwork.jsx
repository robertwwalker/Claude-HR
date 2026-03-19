import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ModelPage from '../components/ModelPage';
import { NETWORK_NODES, NETWORK_EDGES } from '../data/syntheticData';

const DEPT_COLORS = { Eng: '#3b82f6', Product: '#8b5cf6', Sales: '#f59e0b', HR: '#10b981', Finance: '#ef4444' };

export default function ReferralNetwork() {
  const svgRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('quality'); // quality | diversity

  const diversityPct = Math.round(
    (NETWORK_NODES.filter(n => n.diverse).length / NETWORK_NODES.length) * 100
  );
  const retentionPct = Math.round(
    (NETWORK_NODES.filter(n => n.retained).length / NETWORK_NODES.length) * 100
  );
  const diverseReferredDiverse = NETWORK_EDGES.filter(e => {
    const src = NETWORK_NODES.find(n => n.id === e.source);
    const tgt = NETWORK_NODES.find(n => n.id === e.target);
    return src?.diverse && tgt?.diverse;
  }).length;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 320;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const nodes = NETWORK_NODES.map(n => ({ ...n }));
    const links = NETWORK_EDGES.map(e => ({
      source: nodes.find(n => n.id === e.source),
      target: nodes.find(n => n.id === e.target),
    }));

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(70).strength(0.6))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(22));

    const link = svg.append('g').selectAll('line').data(links).join('line')
      .attr('stroke', d => {
        if (mode === 'quality') {
          return d.target.perf >= 4 ? '#22c55e' : d.target.perf >= 3 ? '#f59e0b' : '#ef4444';
        } else {
          return d.target.diverse ? '#8b5cf6' : '#d1d5db';
        }
      })
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    svg.append('defs').append('marker')
      .attr('id', 'arrow').attr('viewBox', '0 -5 10 10')
      .attr('refX', 18).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#9ca3af');

    const node = svg.append('g').selectAll('g').data(nodes).join('g')
      .style('cursor', 'pointer')
      .on('click', (event, d) => setSelected(d));

    node.call(d3.drag()
      .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    node.append('circle')
      .attr('r', 14)
      .attr('fill', d => DEPT_COLORS[d.dept] || '#6b7280')
      .attr('stroke', d => d.retained ? '#fff' : '#ef4444')
      .attr('stroke-width', 2)
      .attr('opacity', d => mode === 'diversity' && !d.diverse ? 0.4 : 1);

    node.append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-size', 8).attr('fill', 'white').attr('font-weight', 'bold')
      .text(d => d.name.split(' ')[0].slice(0, 4));

    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [mode]);

  return (
    <ModelPage
      number="9"
      title="Employee Referral & Talent Network Modeling"
      badge="Sourcing Analytics"
      purpose="Analyze referral patterns to improve program design by identifying where referrals are most likely to yield durable, high-quality hires — while monitoring for diversity risks from network homophily."
      methods={['Referral propensity models', 'Organizational network analysis (ONA)', 'Graph-based methods', 'Homophily detection']}
      inputs={['Referral histories & hiring outcomes', 'Retention data', 'Team-level patterns', 'ONA data (with consent)', 'Diversity metrics']}
      caution="Social and professional networks often cluster by background. Referral optimization can reinforce homophily and reduce workforce diversity if left unmonitored. Simpler analyses are often easier to govern than complex graph architectures."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Network graph */}
        <div className="lg:col-span-2 sim-card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Referral Network Graph</h3>
            <div className="flex gap-2">
              <button onClick={() => setMode('quality')} className={mode === 'quality' ? 'btn-primary' : 'btn-secondary'}>
                Hire Quality
              </button>
              <button onClick={() => setMode('diversity')} className={mode === 'diversity' ? 'btn-primary' : 'btn-secondary'}>
                Diversity
              </button>
            </div>
          </div>
          <svg ref={svgRef} className="w-full" style={{ height: 320 }} />

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            {mode === 'quality' ? (
              <>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block" /> High performer (4–5)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-400 inline-block" /> Mid performer (3)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Low performer</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-purple-500 inline-block" /> Diverse hire referral</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-gray-300 inline-block" /> Same-network referral</span>
              </>
            )}
            {Object.entries(DEPT_COLORS).map(([dept, color]) => (
              <span key={dept} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} /> {dept}
              </span>
            ))}
          </div>
        </div>

        {/* Stats + selected node */}
        <div className="space-y-4">
          <div className="sim-card">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Network Metrics</h3>
            <div className="space-y-3">
              <Metric label="Total employees" value={NETWORK_NODES.length} />
              <Metric label="Referral edges" value={NETWORK_EDGES.length} />
              <Metric label="Workforce diversity" value={`${diversityPct}%`} highlight={diversityPct < 40} />
              <Metric label="6-mo retention rate" value={`${retentionPct}%`} />
              <Metric label="Cross-network referrals" value={`${diverseReferredDiverse}/${NETWORK_EDGES.length}`} highlight={diverseReferredDiverse < 3} />
            </div>
          </div>

          {selected ? (
            <div className="sim-card border-blue-200 bg-blue-50">
              <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Selected Employee</h3>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-blue-900 text-sm">{selected.name}</p>
                <Metric label="Dept" value={selected.dept} />
                <Metric label="Diverse background" value={selected.diverse ? 'Yes' : 'No'} />
                <Metric label="Retained 6mo" value={selected.retained ? '✓ Yes' : '✗ No'} highlight={!selected.retained} />
                <Metric label="Performance" value={`${selected.perf} / 5`} />
              </div>
            </div>
          ) : (
            <div className="sim-card bg-gray-50 text-center py-6">
              <p className="text-xs text-gray-400">Click a node to inspect an employee</p>
            </div>
          )}

          <div className="sim-card bg-amber-50 border-amber-200">
            <p className="text-xs text-amber-800 font-semibold mb-1">⚠ Diversity Watch</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              {diverseReferredDiverse < 4
                ? 'Most referrals flow within homogeneous networks. Without monitoring, referral programs can reinforce existing demographic clusters.'
                : 'Good cross-network referral activity detected. Continue monitoring to maintain diversity gains.'}
            </p>
          </div>
        </div>
      </div>
    </ModelPage>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-bold ${highlight ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
