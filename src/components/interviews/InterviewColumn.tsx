
import React from 'react';
import { Interview, InterviewStatus } from '@/types';
import InterviewCard from './InterviewCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewColumnProps {
  title: string;
  status: InterviewStatus;
  interviews: Interview[];
  onAddClick: () => void;
  onInterviewClick: (interview: Interview) => void;
}

const statusHeaders = {
  Applied: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
  Interviewing: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
  Offer: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800",
  Rejected: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
};

const InterviewColumn: React.FC<InterviewColumnProps> = ({
  title,
  status,
  interviews,
  onAddClick,
  onInterviewClick,
}) => {
  return (
    <div className="kanban-column flex flex-col h-full">
      <div className={`p-3 mb-4 rounded-md ${statusHeaders[status]} flex justify-between items-center`}>
        <h3 className="font-medium">{title} ({interviews.length})</h3>
        <Button size="sm" variant="ghost" onClick={onAddClick} className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {interviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No interviews in this column</p>
            <Button variant="link" onClick={onAddClick} className="mt-2">
              Add Interview
            </Button>
          </div>
        ) : (
          interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onClick={() => onInterviewClick(interview)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewColumn;
