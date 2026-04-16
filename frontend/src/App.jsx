import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CalculatorPage } from './pages/CalculatorPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ComparePage } from './pages/ComparePage';
import { StepUpPage } from './pages/StepUpPage';
import { AnimatedRoutes } from './components/layout/AnimatedRoutes';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg transition-colors duration-200 overflow-hidden">
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
