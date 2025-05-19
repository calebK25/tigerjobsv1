
import React from 'react';
import { Interview } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DayDetailViewProps {
  selectedDate: Date | undefined;
  interviews: Interview[];
  onInterviewClick: (interview: Interview) => void;
  onAddInterview: () => void;
}

const DayDetailView: React.FC<DayDetailViewProps> = ({
  selectedDate,
  interviews,
  onInterviewClick,
  onAddInterview,
}) => {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>
          {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'No date selected'}
        </CardTitle>
        <CardDescription>
          {interviews.length 
            ? `${interviews.length} interview${interviews.length > 1 ? 's' : ''} scheduled` 
            : 'No interviews scheduled for this date'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div 
                key={interview.id} 
                className="p-4 border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                onClick={() => onInterviewClick(interview)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{interview.company}</h3>
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
        ) : (
          <div className="py-10 text-center">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground mb-3">No interviews scheduled for this date</p>
            <Button variant="outline" onClick={onAddInterview}>
              Schedule Interview
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayDetailView;
