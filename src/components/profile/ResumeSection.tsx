import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileUploader } from '@/components/resume/FileUploader';
import { ResumeEnhancer } from '@/components/resume/ResumeEnhancer';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import Latex from 'react-latex';

interface ResumeSectionProps {
  resumeText: string;
  parsedResume: any | null;
  onResumeTextChange: (text: string) => void;
  onResumeUpload: (text: string) => void;
}

export const ResumeSection = ({
  resumeText,
  parsedResume,
  onResumeTextChange,
  onResumeUpload,
}: ResumeSectionProps) => {
  const handleSaveResume = () => {
    if (resumeText && resumeText.trim() !== '') {
      console.log('Saving resume, text length:', resumeText.length);
      onResumeUpload(resumeText);
    }
  };

  const handleFileUpload = (text: string) => {
    console.log('File upload handler received text, length:', text.length);
    onResumeTextChange(text);
    // Automatically save the resume when uploaded via file
    if (text && text.trim() !== '') {
      onResumeUpload(text);
    }
  };

  const renderLatexText = (text: string) => {
    return <Latex>{text}</Latex>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Upload</CardTitle>
        <CardDescription>
          Upload your resume to get tailored job recommendations. LaTeX equations are supported (e.g., $E = mc^2$).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploader onFileUpload={handleFileUpload} />
      
        <div className="space-y-2">
          <Label htmlFor="resume-text">Resume Text</Label>
          <Textarea 
            id="resume-text" 
            value={resumeText} 
            onChange={(e) => onResumeTextChange(e.target.value)}
            placeholder="Paste your resume text here. LaTeX equations are supported (e.g., $E = mc^2$)"
            className="min-h-[200px] font-mono"
          />
          
          {resumeText && resumeText.trim() !== '' && (
            <div className="mt-2 p-4 bg-muted rounded-md">
              <Label>Preview with LaTeX rendering:</Label>
              <div className="mt-2 prose max-w-none">
                {renderLatexText(resumeText)}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handleSaveResume}
              disabled={!resumeText || resumeText.trim() === ''}
              variant="default"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Resume
            </Button>
          </div>
        </div>
      
        {resumeText && resumeText.trim() !== '' && (
          <ResumeEnhancer 
            initialText={resumeText}
            onUpdate={onResumeUpload}
          />
        )}
      
        {parsedResume && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="font-medium mb-2">Detected Skills</h4>
              <div className="flex flex-wrap gap-2">
                {parsedResume.skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{parsedResume.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
