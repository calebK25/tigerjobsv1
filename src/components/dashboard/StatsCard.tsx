
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  progress: number;
}

const StatsCard = ({ title, value, icon: Icon, progress }: StatsCardProps) => {
  return (
    <Card className="stats-card hover:bg-accent/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <Progress value={progress} className="h-1.5 mt-4" />
    </Card>
  );
};

export default StatsCard;
