
import React, { createContext, useContext } from 'react';
import { Interview, InterviewStatus } from '../types';
import { useInterviewState } from './useInterviewState';

interface InterviewContextType {
  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  getInterviewsByStatus: (status: InterviewStatus) => Interview[];
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useInterviewState();

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviews = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};
