export default function ModelPage({ number, title, badge, purpose, methods, inputs, caution, children }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
            {number}
          </div>
          <div>
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
              {badge}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
            <p className="text-blue-100 text-sm leading-relaxed max-w-3xl">{purpose}</p>
          </div>
        </div>
      </div>

      {/* Model summary cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard title="Methods" icon="⚙️" items={methods} />
        <SummaryCard title="Typical Inputs" icon="📋" items={inputs} />
        <CautionCard caution={caution} />
      </div>

      {/* Interactive simulation */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-blue-600">▶</span> Interactive Simulation
        </h2>
        {children}
      </div>
    </div>
  );
}

function SummaryCard({ title, icon, items }) {
  return (
    <div className="sim-card">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {icon} {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CautionCard({ caution }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
        ⚠️ Key Caution
      </h3>
      <p className="text-sm text-amber-900 leading-relaxed">{caution}</p>
    </div>
  );
}
