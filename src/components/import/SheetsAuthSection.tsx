
import React from "react";
import { Button } from "@/components/ui/button";
import { Import, Loader2 } from "lucide-react";

interface SheetsAuthSectionProps {
  authenticating: boolean;
  onAuthenticate: () => void;
}

const SheetsAuthSection: React.FC<SheetsAuthSectionProps> = ({
  authenticating,
  onAuthenticate,
}) => (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <p className="text-center text-muted-foreground mb-4">
      First, authenticate with Google to access your spreadsheets
    </p>
    <Button onClick={onAuthenticate} disabled={authenticating}>
      {authenticating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Import className="mr-2 h-4 w-4" />
          Connect to Google Sheets
        </>
      )}
    </Button>
  </div>
);

export default SheetsAuthSection;
