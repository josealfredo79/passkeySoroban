'use client';

import React, { useState } from 'react';
import LandingPage from './LandingPage';
import IncomeDashboard from './IncomeDashboard';
import CreditProfile from './CreditProfile';
import SuccessNotification from './SuccessNotification';

type FlowStep = 'landing' | 'income' | 'credit' | 'success';

interface IncomeData {
  monthly_earnings: number[];
  gig_platforms: string[];
  average_hours_per_week: number;
  years_experience: number;
  education_level: 'high_school' | 'bachelor' | 'master' | 'phd' | 'none';
  employment_type: 'full_time_gig' | 'part_time_gig' | 'mixed' | 'unemployed';
  bank_account_age_months: number;
  has_savings: boolean;
  debt_to_income_ratio: number;
}

const CreditScoringFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('landing');
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState<number>(0);
  
  // Mock user address - in real app this would come from wallet connection
  // Using a valid testnet address (56 characters, starts with G)
  const mockUserAddress = 'GDJYLRW4DZK7LVGCNAKBO42FGWVDRP2G7BEAXWWUC5E63ZENZ3RAPAKL';

  const handleStartSession = () => {
    setCurrentStep('income');
  };

  const handleIncomeDataReady = (data: IncomeData) => {
    setIncomeData(data);
  };

  const handleIncomeNext = () => {
    if (incomeData) {
      setCurrentStep('credit');
    }
  };

  const handleRequestLoan = (amount: number) => {
    setSelectedLoanAmount(amount);
    setCurrentStep('success');
  };

  const handleBackToIncome = () => {
    setCurrentStep('income');
  };

  const handleStartOver = () => {
    setCurrentStep('landing');
    setIncomeData(null);
    setSelectedLoanAmount(0);
  };

  const handleViewDashboard = () => {
    // In real app, this would navigate to a user dashboard
    // For MVP, let's go back to credit profile
    setCurrentStep('credit');
  };

  return (
    <div className="min-h-screen">
      {currentStep === 'landing' && (
        <LandingPage onStartSession={handleStartSession} />
      )}
      
      {currentStep === 'income' && (
        <IncomeDashboard
          onDataReady={handleIncomeDataReady}
          onNext={handleIncomeNext}
        />
      )}
      
      {currentStep === 'credit' && incomeData && (
        <CreditProfile
          incomeData={incomeData}
          onRequestLoan={handleRequestLoan}
          onBack={handleBackToIncome}
        />
      )}
      
      {currentStep === 'success' && (
        <SuccessNotification
          loanAmount={selectedLoanAmount}
          userAddress={mockUserAddress}
          onStartOver={handleStartOver}
          onViewDashboard={handleViewDashboard}
        />
      )}
    </div>
  );
};

export default CreditScoringFlow;