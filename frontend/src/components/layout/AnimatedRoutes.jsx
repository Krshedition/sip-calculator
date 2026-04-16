import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import { HomePage } from '../../pages/HomePage';
import { CalculatorPage } from '../../pages/CalculatorPage';
import { SimulatorPage } from '../../pages/SimulatorPage';
import { ComparePage } from '../../pages/ComparePage';
import { StepUpPage } from '../../pages/StepUpPage';
import { OutroPage } from '../../pages/OutroPage';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/step-up" element={<StepUpPage />} />
        <Route path="/about" element={<OutroPage />} />
      </Routes>
    </AnimatePresence>
  );
}
