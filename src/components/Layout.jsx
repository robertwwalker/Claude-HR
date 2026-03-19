import { Link, NavLink, useLocation } from 'react-router-dom';

const MODELS = [
  { path: '/attrition',     label: '1. Attrition Risk' },
  { path: '/matching',      label: '2. Candidate Matching' },
  { path: '/calibration',   label: '3. Performance Calibration' },
  { path: '/mobility',      label: '4. Internal Mobility' },
  { path: '/pay-equity',    label: '5. Pay Equity' },
  { path: '/learning',      label: '6. Learning Effectiveness' },
  { path: '/recruiting',    label: '7. Recruiting Channels' },
  { path: '/skills-gap',    label: '8. Skills Gap Forecast' },
  { path: '/referral',      label: '9. Referral Network' },
  { path: '/high-potential',label: '10. High-Potential' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const currentIndex = MODELS.findIndex(m => location.pathname === m.path);
  const prev = currentIndex > 0 ? MODELS[currentIndex - 1] : null;
  const next = currentIndex < MODELS.length - 1 && currentIndex >= 0 ? MODELS[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="font-bold text-lg tracking-tight hover:text-blue-200 transition-colors">
              People Analytics
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {MODELS.map(m => (
                <NavLink
                  key={m.path}
                  to={m.path}
                  className={({ isActive }) =>
                    `px-2 py-1 rounded text-xs font-medium transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white hover:bg-blue-700'
                    }`
                  }
                >
                  {m.label.split('. ')[1]}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Prev / Next navigation */}
      {currentIndex >= 0 && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            {prev ? (
              <Link to={prev.path} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                ← {prev.label}
              </Link>
            ) : <div />}
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">All Models</Link>
            {next ? (
              <Link to={next.path} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                {next.label} →
              </Link>
            ) : <div />}
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-gray-400 text-xs text-center py-4">
        People Analytics Model Showcase · Simulations use synthetic data for illustrative purposes only
      </footer>
    </div>
  );
}
