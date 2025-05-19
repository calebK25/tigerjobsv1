
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import SheetsAuthSection from "./SheetsAuthSection";
import SheetsPreviewSection from "./SheetsPreviewSection";
import SheetsImportSummary from "./SheetsImportSummary";
import { useGoogleSheetsImport } from "./useGoogleSheetsImport";

interface GoogleSheetsImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

const GoogleSheetsImport: React.FC<GoogleSheetsImportProps> = ({
  open,
  onOpenChange,
  onImportComplete,
}) => {
  const {
    loading,
    authenticating,
    accessToken,
    spreadsheetUrl,
    setSpreadsheetUrl,
    sheetName,
    setSheetName,
    previewData,
    allData,
    showAll,
    setShowAll,
    error,
    importSummary,
    initiateGoogleAuth,
    fetchSheetPreview,
    importData,
    reset,
  } = useGoogleSheetsImport(onImportComplete);

  const handleClose = () => {
    if (!loading) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Import Interviews from Google Sheets</DialogTitle>
          <DialogDescription>
            Connect to your Google Sheets and import interview data in bulk.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          {!accessToken ? (
            <SheetsAuthSection
              authenticating={authenticating}
              onAuthenticate={initiateGoogleAuth}
            />
          ) : importSummary ? (
            <SheetsImportSummary summary={importSummary} onClose={handleClose} />
          ) : (
            <SheetsPreviewSection
              loading={loading}
              spreadsheetUrl={spreadsheetUrl}
              onSpreadsheetUrlChange={setSpreadsheetUrl}
              sheetName={sheetName}
              onSheetNameChange={setSheetName}
              onFetchPreview={fetchSheetPreview}
              previewData={previewData}
              allData={allData}
              showAll={showAll}
              onShowAllToggle={() => setShowAll((s) => !s)}
            />
          )}
        </div>

        {accessToken && !importSummary && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={importData}
              disabled={loading || (showAll ? allData.length === 0 : previewData.length === 0)}
            >
              {loading ? "Importing..." : "Import Data"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSheetsImport;
