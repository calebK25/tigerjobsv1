
import { useState, useEffect } from 'react';
import { Interview, InterviewStatus } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

interface UseInterviewState {
  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  getInterviewsByStatus: (status: InterviewStatus) => Interview[];
}

export function useInterviewState(): UseInterviewState {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchInterviews();
    } else {
      setInterviews([]);
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: Interview[] = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        company: item.company,
        role: item.role,
        dateApplied: item.date_applied || '',
        status: item.status as InterviewStatus,
        notes: item.notes || '',
        nextInterviewDate: item.next_interview_date || '',
        location: item.location || '',
        salary: item.salary || '',
        platform: item.platform || '',
        source: (item.source as Interview['source']) || 'manual',
      }));

      setInterviews(formattedData);
    } catch (error) {
      toast.error('Failed to fetch interviews');
      console.error('Error fetching interviews:', error);
    }
  };

  const addInterview = async (interview: Omit<Interview, 'id'>) => {
    try {
      const dbInterview = {
        user_id: user?.id,
        company: interview.company,
        role: interview.role,
        date_applied: interview.dateApplied,
        status: interview.status,
        notes: interview.notes,
        next_interview_date: interview.nextInterviewDate,
        location: interview.location,
        salary: interview.salary,
        platform: interview.platform,
        source: interview.source || 'manual',
      };

      console.log('Adding interview with data:', dbInterview);

      const { data, error } = await supabase
        .from('interviews')
        .insert(dbInterview)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      const newInterview: Interview = {
        id: data.id,
        userId: data.user_id,
        company: data.company,
        role: data.role,
        dateApplied: data.date_applied || '',
        status: data.status as InterviewStatus,
        notes: data.notes || '',
        nextInterviewDate: data.next_interview_date || '',
        location: data.location || '',
        salary: data.salary || '',
        platform: data.platform || '',
        source: (data.source as Interview['source']) || 'manual'
      };

      setInterviews(prev => [newInterview, ...prev]);
      toast.success('Interview added successfully');
    } catch (error) {
      console.error('Error adding interview:', error);
      toast.error('Failed to add interview');
    }
  };

  const updateInterview = async (id: string, updates: Partial<Interview>) => {
    try {
      const dbUpdates: any = {};
      if (updates.company !== undefined) dbUpdates.company = updates.company;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.dateApplied !== undefined) dbUpdates.date_applied = updates.dateApplied;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.nextInterviewDate !== undefined) dbUpdates.next_interview_date = updates.nextInterviewDate;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.salary !== undefined) dbUpdates.salary = updates.salary;
      if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
      if (updates.source !== undefined) dbUpdates.source = updates.source;

      console.log('Updating interview with ID:', id);
      console.log('Update data:', dbUpdates);

      const { error, data } = await supabase
        .from('interviews')
        .update(dbUpdates)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating interview in Supabase:', error);
        throw error;
      }

      console.log('Update response:', data);

      setInterviews(prev =>
        prev.map(interview =>
          interview.id === id ? { ...interview, ...updates } : interview
        )
      );
      toast.success('Interview updated successfully');
    } catch (error) {
      console.error('Error updating interview:', error);
      toast.error('Failed to update interview');
    }
  };

  const deleteInterview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInterviews(prev => prev.filter(interview => interview.id !== id));
      toast.success('Interview deleted successfully');
    } catch (error) {
      toast.error('Failed to delete interview');
      console.error('Error deleting interview:', error);
    }
  };

  const getInterviewsByStatus = (status: InterviewStatus) => {
    return interviews.filter(interview => interview.status === status);
  };

  return {
    interviews,
    addInterview,
    updateInterview,
    deleteInterview,
    getInterviewsByStatus
  };
}
