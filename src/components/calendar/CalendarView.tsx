
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { Interview } from '@/types';

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  interviewDates: Date[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  interviewDates,
}) => {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
        <CardDescription>Select a date to view scheduled interviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border pointer-events-auto"
          modifiersClassNames={{
            selected: 'bg-primary text-primary-foreground',
          }}
          components={{
            DayContent: ({ date }) => {
              const hasInterview = interviewDates.some(interviewDate => 
                isSameDay(interviewDate, date)
              );
              
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  {date.getDate()}
                  {hasInterview && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
              );
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarView;
