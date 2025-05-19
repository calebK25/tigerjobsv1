
import { Interview } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface StatusChartProps {
  interviews: Interview[];
}

const StatusChart = ({ interviews }: StatusChartProps) => {
  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 h-[500px] hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Current status breakdown</CardDescription>
          </div>
          <BarChart className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full flex items-end justify-around gap-2">
          {['Applied', 'Interviewing', 'Offer', 'Rejected'].map((status) => {
            const count = interviews.filter(i => i.status === status).length;
            const percentage = interviews.length > 0 
              ? Math.floor((count / interviews.length) * 100) 
              : 0;
            
            const getColor = () => {
              switch(status) {
                case 'Applied': return 'bg-blue-500';
                case 'Interviewing': return 'bg-yellow-500';
                case 'Offer': return 'bg-green-500';
                case 'Rejected': return 'bg-red-500';
                default: return 'bg-primary';
              }
            };
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground">{percentage}%</div>
                <div 
                  className={`w-16 rounded-t-md transition-all duration-1000 flex items-end justify-center pb-2 text-white font-medium ${getColor()}`}
                  style={{ height: `${Math.max(percentage, 5)}%` }}
                >
                  {count}
                </div>
                <div className="text-xs mt-2 text-muted-foreground">{status}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="link" asChild className="gap-1 p-0">
            <Link to="/analytics">
              View detailed analytics
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
