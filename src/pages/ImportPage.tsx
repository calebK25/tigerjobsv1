
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInterviews } from '@/context/InterviewContext';
import { useAuth } from '@/context/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { Mail, Check, Loader2, Import, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import GoogleSheetsImport from '@/components/import/GoogleSheetsImport';

const ImportPage = () => {
  const { addInterview } = useInterviews();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [searchTerms, setSearchTerms] = useState("interview OR \"next steps\" OR schedule");
  const [sheetsImportOpen, setSheetsImportOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  const handleConnect = () => {
    setLoading(true);
    // Simulate OAuth connection process
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
      toast.success("Gmail connected!", {
        description: "Your Google account has been successfully connected.",
      });
    }, 2000);
  };

  const handleImport = () => {
    setLoading(true);
    // Simulate email import process
    setTimeout(() => {
      // Add a mock imported interview
      if (user) {
        addInterview({
          userId: user.id,
          company: "ACME Corporation",
          role: "Software Engineering Intern",
          dateApplied: new Date().toISOString().split('T')[0],
          status: "Interviewing",
          notes: "Automatically imported from email. Interview scheduled for next Tuesday at 2pm.",
          nextInterviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          location: "Remote",
          source: "email"
        });
      }
      
      setLoading(false);
      toast.success("Emails imported!", {
        description: "Successfully imported 1 interview from your emails."
      });
    }, 3000);
  };

  const handleSheetsImportComplete = () => {
    // Handle successful import, maybe refresh data
    setSheetsImportOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Interviews</h1>
        <p className="text-muted-foreground">Import interview data from various sources</p>
      </div>

      <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Import from Google Sheets</CardTitle>
          <CardDescription>
            Import interview data directly from a Google Spreadsheet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect to your Google Sheets to import interview data in bulk. Your spreadsheet should have
            columns for company, role, date applied, and status.
          </p>
          <div className="flex justify-start">
            <Button onClick={() => setSheetsImportOpen(true)} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Import from Google Sheets
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Connect Google Account</CardTitle>
          <CardDescription>
            Allow access to scan your inbox for interview-related emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected ? (
            <Button onClick={handleConnect} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Connect Gmail
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-2 text-green-500">
              <Check className="h-5 w-5" />
              <span>Connected to {user?.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {connected && (
        <>
          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Search Parameters</CardTitle>
              <CardDescription>
                Define keywords to filter interview-related emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Terms</label>
                <Input 
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                  placeholder="Enter keywords separated by OR"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll search for emails containing these terms to identify potential interviews.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Import Emails</CardTitle>
              <CardDescription>
                Start importing interview emails based on your search parameters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleImport} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Import Interviews
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <GoogleSheetsImport 
        open={sheetsImportOpen} 
        onOpenChange={setSheetsImportOpen}
        onImportComplete={handleSheetsImportComplete}
      />
    </div>
  );
};

export default ImportPage;
