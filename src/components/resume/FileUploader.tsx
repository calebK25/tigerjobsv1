
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileUpload: (text: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string || '';
        console.log('File text extracted, length:', text.length);
        resolve(text);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    try {
      const fileText = await extractTextFromFile(file);
      console.log('Sending extracted text to parent component, length:', fileText.length);
      onFileUpload(fileText);
      toast.success(`File "${file.name}" uploaded successfully`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-muted/50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-muted/50');
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-muted/50');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['.txt', '.pdf', '.docx'];
      const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileType)) {
        toast.error('Please upload a .txt, .pdf, or .docx file');
        return;
      }
      
      try {
        const fileText = await extractTextFromFile(file);
        console.log('Sending dropped file text to parent component, length:', fileText.length);
        onFileUpload(fileText);
        toast.success(`File "${file.name}" uploaded successfully`);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Failed to process file');
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground/60" />
          <h3 className="font-medium text-lg">Upload Resume</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your file here or click to browse
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <File className="h-3 w-3" />
              .txt
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <File className="h-3 w-3" />
              .pdf
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <File className="h-3 w-3" />
              .docx
            </Badge>
          </div>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.pdf,.docx"
        className="hidden"
      />
    </div>
  );
};
