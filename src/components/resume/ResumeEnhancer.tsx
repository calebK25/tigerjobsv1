
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ResumeEnhancerProps {
  initialText: string;
  onUpdate: (text: string) => void;
}

export const ResumeEnhancer = ({ initialText, onUpdate }: ResumeEnhancerProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const enhanceResume = async () => {
    if (!initialText.trim()) {
      toast.error("Please add your resume text first");
      return;
    }

    setIsEnhancing(true);
    setError(null);
    
    try {
      console.log("Sending resume for enhancement, length:", initialText.length);
      
      const { data, error: invokeError } = await supabase.functions.invoke('enhance-resume', {
        body: { resumeText: initialText }
      });

      if (invokeError) {
        console.error("Supabase function error:", invokeError);
        throw new Error(invokeError.message || "Failed to enhance resume");
      }
      
      // Handle error responses from the edge function (which are still returned with status 200)
      if (data?.error) {
        console.error("Edge function returned error:", data.error);
        throw new Error(data.error);
      }
      
      if (!data || !data.enhancedResume) {
        console.error("Invalid response data:", data);
        throw new Error("Invalid response from AI service");
      }
      
      setEnhancedText(data.enhancedResume);
      toast.success("Resume enhanced successfully!");
    } catch (err) {
      console.error('Error enhancing resume:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to enhance resume";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsEnhancing(false);
    }
  };

  const applyEnhancements = () => {
    onUpdate(enhancedText);
    setEnhancedText("");
    toast.success("Enhanced resume applied!");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">AI Resume Enhancement</CardTitle>
          <CardDescription>
            Let our AI help improve your resume's clarity, impact, and professional language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={enhanceResume} 
            disabled={isEnhancing || !initialText.trim()}
            className="w-full"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Enhance Resume
              </>
            )}
          </Button>
          
          {error && (
            <div className="mt-2 p-3 border border-destructive bg-destructive/10 rounded-md text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {enhancedText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Enhanced Version</CardTitle>
            <CardDescription>
              Review the AI-enhanced version of your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={enhancedText}
              onChange={(e) => setEnhancedText(e.target.value)}
              className="min-h-[200px]"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={applyEnhancements} className="ml-auto" variant="default">
              <Check className="mr-2 h-4 w-4" />
              Apply Enhancements
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
