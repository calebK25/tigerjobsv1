
import React from 'react';

const SankeyLegend: React.FC = () => (
  <div className="flex justify-center mt-6 mb-6 space-x-6 flex-wrap px-4">
    <div className="flex items-center">
      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
      <span className="text-sm">Applied</span>
    </div>
    <div className="flex items-center">
      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
      <span className="text-sm">Interviewing</span>
    </div>
    <div className="flex items-center">
      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
      <span className="text-sm">Offers</span>
    </div>
    <div className="flex items-center">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
      <span className="text-sm">Rejected</span>
    </div>
  </div>
);

export default SankeyLegend;
