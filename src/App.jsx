import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AttritionRisk from './pages/AttritionRisk';
import CandidateMatching from './pages/CandidateMatching';
import PerformanceCalibration from './pages/PerformanceCalibration';
import InternalMobility from './pages/InternalMobility';
import PayEquity from './pages/PayEquity';
import LearningEffectiveness from './pages/LearningEffectiveness';
import RecruitingSource from './pages/RecruitingSource';
import SkillsGap from './pages/SkillsGap';
import ReferralNetwork from './pages/ReferralNetwork';
import HighPotential from './pages/HighPotential';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attrition"      element={<AttritionRisk />} />
          <Route path="/matching"       element={<CandidateMatching />} />
          <Route path="/calibration"    element={<PerformanceCalibration />} />
          <Route path="/mobility"       element={<InternalMobility />} />
          <Route path="/pay-equity"     element={<PayEquity />} />
          <Route path="/learning"       element={<LearningEffectiveness />} />
          <Route path="/recruiting"     element={<RecruitingSource />} />
          <Route path="/skills-gap"     element={<SkillsGap />} />
          <Route path="/referral"       element={<ReferralNetwork />} />
          <Route path="/high-potential" element={<HighPotential />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
