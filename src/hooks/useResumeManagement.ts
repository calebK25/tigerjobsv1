
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useResumeManagement = (user: User | null) => {
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing resume on component mount
  useEffect(() => {
    if (user) {
      fetchResume();
    }
  }, [user]);

  const fetchResume = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('content')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching resume:', error);
        throw error;
      }

      if (data?.content) {
        setResumeData(data.content);
        console.log('Resume data loaded from database, length:', data.content.length);
      } else {
        console.log('No resume found for user');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load your resume');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadResume = async (resumeText: string) => {
    if (!user) {
      console.error('Cannot upload resume: missing user');
      toast.error('Please log in to upload your resume');
      return;
    }
    
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim() === '') {
      console.error('Cannot upload resume: empty or invalid resume text');
      toast.error('Resume content appears to be empty or invalid');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Uploading resume text, length:', resumeText.length, 'user_id:', user.id);
      
      // First check if resume already exists
      const { data: existingResume, error: fetchError } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking existing resume:', fetchError);
        throw fetchError;
      }
      
      let result;
      
      if (existingResume) {
        // Update existing resume
        console.log('Updating existing resume with ID:', existingResume.id);
        result = await supabase
          .from('resumes')
          .update({
            content: resumeText,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingResume.id);
      } else {
        // Insert new resume
        console.log('Creating new resume for user:', user.id);
        result = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            content: resumeText,
            filename: 'uploaded_resume.txt'
          });
      }

      if (result.error) {
        console.error('Error saving resume:', result.error);
        throw result.error;
      }
      
      setResumeData(resumeText);
      toast.success("Resume uploaded successfully");
      console.log('Resume uploaded successfully, content length:', resumeText.length);
    } catch (error) {
      console.error('Failed to upload resume:', error);
      toast.error('Failed to upload resume');
    } finally {
      setIsLoading(false);
    }
  };

  return { resumeData, isLoading, uploadResume, fetchResume };
};
