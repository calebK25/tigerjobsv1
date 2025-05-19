
import React from 'react';
import { Interview } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface UpcomingInterviewsProps {
  groupedInterviews: Record<string, Interview[]>;
  onInterviewClick: (interview: Interview) => void;
}

const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
  groupedInterviews,
  onInterviewClick,
}) => {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>All Scheduled Interviews</CardTitle>
        <CardDescription>
          Showing all your upcoming interviews in chronological order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedInterviews).map(([date, dayInterviews]) => (
            <div key={date} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="grid gap-3">
                {dayInterviews.map((interview) => (
                  <div 
                    key={interview.id}
                    className="p-4 border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                    onClick={() => onInterviewClick(interview)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{interview.company}</h4>
                      <Badge 
                        className={
                          interview.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 
                          interview.status === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' : 
                          interview.status === 'Offer' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }
                      >
                        {interview.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{interview.role}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      {interview.nextInterviewDate && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(interview.nextInterviewDate), 'h:mm a')}
                        </div>
                      )}
                      {interview.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {interview.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedInterviews).length === 0 && (
            <div className="py-10 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">No interviews scheduled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;
