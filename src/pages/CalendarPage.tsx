
import React, { useState, useEffect } from 'react';
import { useInterviews } from '@/context/InterviewContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { format, isSameDay, isToday, isAfter } from 'date-fns';
import { Interview } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import InterviewForm from '@/components/interviews/InterviewForm';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarView from '@/components/calendar/CalendarView';
import DayDetailView from '@/components/calendar/DayDetailView';
import UpcomingInterviews from '@/components/calendar/UpcomingInterviews';

const CalendarPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { interviews } = useInterviews();
  const { userSettings } = useUserSettings();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  
  const { 
    syncing, 
    connectionStatus, 
    connectToGoogle, 
    handleCallback, 
    syncInterviews,
    checkConnectionStatus 
  } = useCalendarSync();
  
  // Get interviews for selected date
  const interviewsOnSelectedDate = selectedDate 
    ? interviews.filter(interview => 
        interview.nextInterviewDate && 
        isSameDay(new Date(interview.nextInterviewDate), selectedDate)
      )
    : [];
  
  // Get all applications that have interview dates set
  const applicationsWithInterviews = interviews.filter(interview => interview.nextInterviewDate);

  // All dates with interviews for highlighting on the calendar
  const interviewDates = applicationsWithInterviews
    .map(interview => new Date(interview.nextInterviewDate!));

  // Sort interviews by date
  const sortedInterviews = [...applicationsWithInterviews].sort((a, b) => {
    if (!a.nextInterviewDate || !b.nextInterviewDate) return 0;
    return new Date(a.nextInterviewDate).getTime() - new Date(b.nextInterviewDate).getTime();
  });

  // Group interviews by date
  const groupedInterviews = sortedInterviews.reduce((groups, interview) => {
    if (!interview.nextInterviewDate) return groups;
    const date = format(new Date(interview.nextInterviewDate), 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(interview);
    return groups;
  }, {} as Record<string, Interview[]>);

  // Get upcoming interviews (today and future)
  const upcomingInterviews = sortedInterviews.filter(interview => {
    if (!interview.nextInterviewDate) return false;
    const interviewDate = new Date(interview.nextInterviewDate);
    return isToday(interviewDate) || isAfter(interviewDate, new Date());
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    checkConnectionStatus();
    
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      console.log('Found authorization code in URL, processing...');
      handleCallback(code);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setFormOpen(true);
  };

  // Reset selected interview when form closes
  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setSelectedInterview(null);
    }
  };

  const handleAddInterview = () => {
    setSelectedInterview(null);
    setFormOpen(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <CalendarHeader
        connectionStatus={connectionStatus}
        syncing={syncing}
        onSync={syncInterviews}
        onConnect={connectToGoogle}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <CalendarView
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          interviewDates={interviewDates}
        />

        <DayDetailView
          selectedDate={selectedDate}
          interviews={interviewsOnSelectedDate}
          onInterviewClick={handleInterviewClick}
          onAddInterview={handleAddInterview}
        />
      </div>

      <UpcomingInterviews
        groupedInterviews={groupedInterviews}
        onInterviewClick={handleInterviewClick}
      />

      <InterviewForm 
        open={formOpen} 
        onOpenChange={handleFormOpenChange}
        interview={selectedInterview || undefined}
        defaultStatus={selectedInterview?.status || "Interviewing"}
      />
    </div>
  );
};

export default CalendarPage;
