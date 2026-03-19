import { Link } from 'react-router-dom';

const MODELS = [
  {
    num: '01', path: '/attrition', icon: '📉', title: 'Attrition Risk Modeling',
    purpose: 'Estimate employee exit likelihood and identify retention intervention targets.',
    badge: 'Retention',
  },
  {
    num: '02', path: '/matching', icon: '🎯', title: 'Candidate-to-Role Matching',
    purpose: 'Rank applicants by semantic skills alignment beyond keyword filtering.',
    badge: 'Recruiting',
  },
  {
    num: '03', path: '/calibration', icon: '⚖️', title: 'Performance Calibration',
    purpose: 'Detect rating inflation, bias, or inconsistency across managers and units.',
    badge: 'Talent Mgmt',
  },
  {
    num: '04', path: '/mobility', icon: '🔀', title: 'Internal Mobility',
    purpose: 'Surface career path recommendations based on skills adjacency and org need.',
    badge: 'Development',
  },
  {
    num: '05', path: '/pay-equity', icon: '💰', title: 'Pay Equity Analysis',
    purpose: 'Identify unexplained compensation gaps after controlling for legitimate factors.',
    badge: 'Compensation',
  },
  {
    num: '06', path: '/learning', icon: '📚', title: 'Learning Effectiveness',
    purpose: 'Estimate causal training impact using experimental and quasi-experimental designs.',
    badge: 'L&D',
  },
  {
    num: '07', path: '/recruiting', icon: '🔍', title: 'Recruiting Channel Effectiveness',
    purpose: 'Compare channels on full-funnel conversion and downstream quality outcomes.',
    badge: 'TA Analytics',
  },
  {
    num: '08', path: '/skills-gap', icon: '🗺️', title: 'Skills Gap Forecasting',
    purpose: 'Forecast future skill demand vs. supply to support strategic workforce planning.',
    badge: 'Workforce Planning',
  },
  {
    num: '09', path: '/referral', icon: '🕸️', title: 'Referral Network Modeling',
    purpose: 'Analyze referral patterns for quality and diversity risk using network analysis.',
    badge: 'Sourcing',
  },
  {
    num: '10', path: '/high-potential', icon: '⭐', title: 'High-Potential & Succession',
    purpose: 'Segment talent and identify succession pipelines using a structured 9-box grid.',
    badge: 'Succession',
  },
];

const PRINCIPLES = [
  { icon: '🎯', title: 'Decision Relevance', body: 'Every model must be linked to a clear use case, decision owner, and measurable success criterion. A technically elegant model that does not change a meaningful action has limited business value.' },
  { icon: '📏', title: 'Measurement Quality', body: 'Labels like performance, potential, or quality of hire often contain bias or inconsistency. If the underlying measures are weak, the model replicates those weaknesses with statistical polish.' },
  { icon: '🔬', title: 'Prediction vs. Intervention', body: 'A model may identify likely exits or likely promoters yet still provide little evidence about what action would alter the outcome. Prescriptive claims require credible causal evidence.' },
  { icon: '⚖️', title: 'Fairness & Legal Defensibility', body: 'In hiring, promotion, compensation, and succession, organizations must consider adverse impact, job relevance, explainability, and documentation. Fairness testing belongs in the model lifecycle, not appended after.' },
  { icon: '🔍', title: 'Explainability & Trust', body: 'Opaque models create practical and legal problems even when predictive performance is strong. Business leaders, HR partners, and counsel need to understand outputs at a level sufficient for responsible use.' },
  { icon: '🔄', title: 'Model Maintenance', body: 'Organizational structure changes, labor markets shift, and policies evolve. Models require routine monitoring for drift, periodic recalibration, and sometimes retirement.' },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center py-12 px-4">
        <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          People Analytics Model Showcase
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
          The Next Generation of<br className="hidden sm:block" /> People Analytics
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Leading organizations now use analytical models to inform hiring, retention, pay, development,
          internal mobility, and workforce planning. This showcase presents ten core model families —
          each with an interactive simulation using synthetic data — so you can build intuition
          before deploying in practice.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
            <span>🎮</span> Interactive simulations
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
            <span>🔒</span> Synthetic data only
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
            <span>📋</span> Governance guidance included
          </span>
        </div>
      </div>

      {/* Background */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Background & Context</h2>
        <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
          <p>
            Over the last decade, HR analytics has shifted from descriptive reporting toward predictive and
            prescriptive applications. Traditional reporting answered questions such as which teams had the
            highest turnover last quarter. Modern analytics aims to answer forward-looking questions: which
            employees may be at elevated risk of departure, which recruiting channels produce durable hires,
            which development interventions improve capability, and which skills gaps are likely to emerge.
          </p>
          <p>
            This shift has been enabled by the increasing availability of workforce data — structured HR
            information such as tenure, compensation, role history, and performance ratings, alongside
            growing quantities of unstructured text from resumes, surveys, reviews, and learning systems.
          </p>
          <p>
            The result is a more demanding environment for people analytics. Leaders must assess not only
            technical feasibility, but also job relevance, fairness, interpretability, privacy, and the
            practical link between model output and managerial action.
          </p>
        </div>
      </div>

      {/* Model grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ten Model Families</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODELS.map(m => (
            <Link key={m.path} to={m.path}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{m.badge}</span>
                  <p className="text-xs text-gray-400 mt-0.5">Model {m.num}</p>
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {m.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{m.purpose}</p>
              <div className="mt-4 text-xs font-semibold text-blue-600 group-hover:text-blue-800 flex items-center gap-1">
                Explore simulation <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cross-cutting principles */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Cross-Cutting Implementation Principles</h2>
        <p className="text-gray-500 text-sm text-center mb-8 max-w-2xl mx-auto">
          The organizational value of people analytics depends less on model complexity than on implementation quality.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRINCIPLES.map(p => (
            <div key={p.title} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-2xl mb-3">{p.icon}</div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 text-white text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">A Discipline of Restraint as Much as Ambition</h2>
        <p className="text-blue-100 leading-relaxed text-sm max-w-2xl mx-auto">
          The most effective organizations are not those that deploy the most advanced techniques. They are the ones
          that apply analytics to clearly defined workforce decisions, use valid and job-relevant measures, monitor
          fairness and drift, and preserve informed human oversight in high-stakes contexts. People analytics is
          best understood not as an engine for automating HR judgment, but as a disciplined decision-support capability.
        </p>
      </div>
    </div>
  );
}
