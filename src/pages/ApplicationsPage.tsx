
import React, { useState } from 'react';
import { useInterviews } from '@/context/InterviewContext';
import { Interview, InterviewStatus } from '@/types';
import InterviewColumn from '@/components/interviews/InterviewColumn';
import InterviewForm from '@/components/interviews/InterviewForm';

const statuses: InterviewStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

const statusLabels: Record<InterviewStatus, string> = {
  Applied: 'Applied',
  Interviewing: 'Interviewing',
  Offer: 'Offers',
  Rejected: 'Rejected',
};

const ApplicationsPage = () => {
  const { getInterviewsByStatus } = useInterviews();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<InterviewStatus | undefined>(undefined);

  const handleAddClick = (status: InterviewStatus) => {
    setSelectedInterview(undefined);
    setSelectedStatus(status);
    setFormOpen(true);
  };

  const handleInterviewClick = (interview: Interview) => {
    setSelectedInterview(interview);
    setSelectedStatus(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">Manage and track your job applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <InterviewColumn
            key={status}
            title={statusLabels[status]}
            status={status}
            interviews={getInterviewsByStatus(status)}
            onAddClick={() => handleAddClick(status)}
            onInterviewClick={handleInterviewClick}
          />
        ))}
      </div>

      <InterviewForm
        open={formOpen}
        onOpenChange={setFormOpen}
        interview={selectedInterview}
        defaultStatus={selectedStatus}
      />
    </div>
  );
};

export default ApplicationsPage;
