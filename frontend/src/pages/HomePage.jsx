import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';

export function HomePage() {
  const features = [
    {
      title: "Stock SIP Simulator",
      description: "Simulate real historical SIPs into specific stocks. See what your actual returns would have been using Rupee Cost Averaging.",
      link: "/simulator",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      title: "Compare Performance",
      description: "Compare the historical SIP growth of up to 3 different stocks simultaneously to find out the ultimate wealth creator.",
      link: "/compare",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      title: "SIP Calculator",
      description: "Estimate the future value of your systematic investments with fixed expected returns. See how small amounts grow over time.",
      link: "/calculator",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Step-Up SIP",
      description: "Calculate how matching your investment growth with your income growth can rapidly accelerate your path to financial freedom.",
      link: "/step-up",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <PageContainer>
      <div className="text-center py-12 lg:py-20 max-w-4xl mx-auto animate-fade-in-up">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-slate-900 dark:text-white">Master your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mt-2">
                Investment Journey
            </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A complete suite of tools to calculate, simulate, and compare Systematic Investment Plans (SIP). Find out how compounding can generate wealth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/simulator" className="primary-btn inline-block md:w-auto px-8 py-4 text-lg hover:scale-105 transition-transform">
                Run Simulation Now
            </Link>
            <Link to="/calculator" className="secondary-btn inline-block md:w-auto px-8 py-4 text-lg hover:scale-105 transition-transform">
                Simple Calculator
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pb-20">
          {features.map((feature, i) => (
              <Link 
                key={i} 
                to={feature.link} 
                className="card group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-900/20 cursor-pointer animate-pop-in border-transparent hover:border-primary-500/30"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                  <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 mt-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                  </p>
              </Link>
          ))}
      </div>
    </PageContainer>
  );
}
