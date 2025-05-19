
import React, { useRef, useEffect } from 'react';
import { Interview } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, DollarSign, ExternalLink, Trash2 } from 'lucide-react';
import { formatDistance } from 'date-fns';
import gsap from 'gsap';
import { useInterviews } from '@/context/InterviewContext';
import { Button } from '@/components/ui/button';
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

interface InterviewCardProps {
  interview: Interview;
  onClick?: (interview: Interview) => void;
}

const statusColors = {
  Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  Interviewing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
  Offer: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
};

const sourceIcons = {
  manual: null,
  email: <Badge variant="outline" className="text-xs"><ExternalLink className="w-3 h-3 mr-1" /> Email</Badge>,
  recommendation: <Badge variant="outline" className="text-xs bg-primary/10">Recommended</Badge>,
  import: <Badge variant="outline" className="text-xs">Imported</Badge>,
};

const InterviewCard: React.FC<InterviewCardProps> = ({ interview, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { deleteInterview } = useInterviews();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      gsap.fromTo(
        card,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
    
    // Add hover animation
    if (card) {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', duration: 0.2 });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', duration: 0.2 });
      });
    }
    
    return () => {
      if (card) {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  const timeAgo = formatDistance(
    new Date(interview.dateApplied),
    new Date(),
    { addSuffix: true }
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteInterview(interview.id);
    setShowDeleteDialog(false);
    // Remove the toast call here as it's already being called in useInterviewState
  };

  const handleCardClick = () => {
    if (onClick) onClick(interview);
  };

  return (
    <>
      <Card 
        ref={cardRef}
        className="cursor-pointer transition-all dark:border-border/50"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{interview.company}</h3>
              <p className="text-sm text-muted-foreground">{interview.role}</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge className={statusColors[interview.status]}>
                {interview.status}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="w-4 h-4 mr-2" />
              Applied {timeAgo}
            </div>
            
            {interview.nextInterviewDate && (
              <div className="flex items-center text-muted-foreground">
                <CalendarDays className="w-4 h-4 mr-2" />
                Next interview: {new Date(interview.nextInterviewDate).toLocaleDateString()}
              </div>
            )}
            
            {interview.location && (
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {interview.location}
              </div>
            )}
            
            {interview.salary && (
              <div className="flex items-center text-muted-foreground">
                <DollarSign className="w-4 h-4 mr-2" />
                {interview.salary}
              </div>
            )}
          </div>
          
          {interview.notes && (
            <div className="mt-3 pt-3 border-t text-sm dark:border-border/50">
              <p className="line-clamp-2 text-muted-foreground">{interview.notes}</p>
            </div>
          )}
          
          {sourceIcons[interview.source || 'manual'] && (
            <div className="mt-3 flex justify-end">
              {sourceIcons[interview.source || 'manual']}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application for {interview.role} at {interview.company}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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

export default InterviewCard;
