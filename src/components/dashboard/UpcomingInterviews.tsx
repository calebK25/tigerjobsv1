
import { Interview } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UpcomingInterviewsProps {
  interviews: Interview[];
}

const UpcomingInterviews = ({ interviews }: UpcomingInterviewsProps) => {
  const upcomingInterviews = interviews
    .filter(i => i.nextInterviewDate && new Date(i.nextInterviewDate) > new Date())
    .sort((a, b) => new Date(a.nextInterviewDate!).getTime() - new Date(b.nextInterviewDate!).getTime())
    .slice(0, 3);

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 h-[500px] hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Next scheduled interviews</CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {upcomingInterviews.length > 0 ? (
          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <div 
                key={interview.id} 
                className="flex items-center p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/5 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{interview.company}</p>
                  <p className="text-xs text-muted-foreground truncate">{interview.role}</p>
                </div>
                <div className="text-sm font-medium text-primary">
                  {interview.nextInterviewDate ? new Date(interview.nextInterviewDate).toLocaleDateString() : ''}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full hover:bg-accent/5 transition-colors" asChild>
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Link>
            </Button>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground mb-2">No upcoming interviews</p>
            <Button variant="outline" className="hover:bg-accent/5 transition-colors">
              Schedule your first interview
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;
