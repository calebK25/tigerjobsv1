import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInterviews } from '@/context/InterviewContext';
import { Interview, InterviewStatus } from '@/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, CalendarIcon, Clock } from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface InterviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview?: Interview;
  defaultStatus?: InterviewStatus;
}

const InterviewForm: React.FC<InterviewFormProps> = ({
  open,
  onOpenChange,
  interview,
  defaultStatus,
}) => {
  const { addInterview, updateInterview, deleteInterview } = useInterviews();
  const [formData, setFormData] = React.useState({
    company: '',
    role: '',
    dateApplied: '',
    status: defaultStatus || 'Applied' as InterviewStatus,
    notes: '',
    nextInterviewDate: '',
    nextInterviewTime: '',
    location: '',
    salary: '',
    platform: '',
  });
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        company: '',
        role: '',
        dateApplied: new Date().toISOString().split('T')[0],
        status: defaultStatus || 'Applied',
        notes: '',
        nextInterviewDate: '',
        nextInterviewTime: '',
        location: '',
        salary: '',
        platform: '',
      });
      return;
    }

    if (interview) {
      const interviewDate = interview.nextInterviewDate ? new Date(interview.nextInterviewDate) : null;
      setFormData({
        company: interview.company || '',
        role: interview.role || '',
        dateApplied: interview.dateApplied || '',
        status: interview.status || 'Applied',
        notes: interview.notes || '',
        nextInterviewDate: interview.nextInterviewDate?.split('T')[0] || '',
        nextInterviewTime: interviewDate ? format(interviewDate, 'HH:mm') : '',
        location: interview.location || '',
        salary: interview.salary || '',
        platform: interview.platform || '',
      });
    } else if (defaultStatus) {
      setFormData(prev => ({
        ...prev,
        status: defaultStatus,
        dateApplied: new Date().toISOString().split('T')[0],
      }));
    } else {
      setFormData({
        company: '',
        role: '',
        dateApplied: new Date().toISOString().split('T')[0],
        status: 'Applied',
        notes: '',
        nextInterviewDate: '',
        nextInterviewTime: '',
        location: '',
        salary: '',
        platform: '',
      });
    }
  }, [interview, defaultStatus, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const combinedDateTime = formData.nextInterviewDate && formData.nextInterviewTime
      ? `${formData.nextInterviewDate}T${formData.nextInterviewTime}`
      : formData.nextInterviewDate || null;

    const submissionData = {
      ...formData,
      nextInterviewDate: combinedDateTime,
    };

    if (interview) {
      updateInterview(interview.id, submissionData);
    } else {
      addInterview({
        ...submissionData,
        userId: 'current-user', // This will be replaced by the actual user ID in the context
      });
    }
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (interview) {
      deleteInterview(interview.id);
      onOpenChange(false);
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {interview ? 'Edit Application' : 'Add Application'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dateApplied" className="text-sm font-medium">
                  Date Applied
                </label>
                <Input
                  id="dateApplied"
                  type="date"
                  value={formData.dateApplied}
                  onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as InterviewStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Next Interview Date & Time
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !formData.nextInterviewDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.nextInterviewDate ? format(new Date(formData.nextInterviewDate), "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.nextInterviewDate ? new Date(formData.nextInterviewDate) : undefined}
                        onSelect={(date) => setFormData({ ...formData, nextInterviewDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Input
                    type="time"
                    value={formData.nextInterviewTime}
                    onChange={(e) => setFormData({ ...formData, nextInterviewTime: e.target.value })}
                    className="w-[150px]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Remote, Hybrid, On-site"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="salary" className="text-sm font-medium">
                  Salary
                </label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. $80,000 - $100,000"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="platform" className="text-sm font-medium">
                  Platform
                </label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="LinkedIn, Indeed, etc."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes about the application..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-between items-center space-x-2">
              <Button type="submit" className="flex-grow">
                {interview ? 'Update' : 'Add'} Application
              </Button>
              {interview && (
                <Button 
                  type="button"
                  variant="destructive" 
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application for {formData.role} at {formData.company}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InterviewForm;
