
import React from 'react';
import AnalyticsAppFlowCard from '@/components/analytics/AnalyticsAppFlowCard';

const AnalyticsPage = () => {
  return (
    <main className="w-full px-4 py-6">
      {/* Application Flow - full width */}
      <AnalyticsAppFlowCard />
      {/* You can insert other analytics sections/components here in the future */}
    </main>
  );
};

export default AnalyticsPage;
