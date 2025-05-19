
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Import, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

interface PreviewData {
  company: string;
  role: string;
  date_applied: string;
  status: string;
  notes?: string;
  location?: string;
}

interface SheetsPreviewSectionProps {
  loading: boolean;
  spreadsheetUrl: string;
  onSpreadsheetUrlChange: (v: string) => void;
  sheetName: string;
  onSheetNameChange: (v: string) => void;
  onFetchPreview: () => void;
  previewData: PreviewData[];
  allData: PreviewData[];
  showAll: boolean;
  onShowAllToggle: () => void;
}

const SheetsPreviewSection: React.FC<SheetsPreviewSectionProps> = ({
  loading,
  spreadsheetUrl,
  onSpreadsheetUrlChange,
  sheetName,
  onSheetNameChange,
  onFetchPreview,
  previewData,
  allData,
  showAll,
  onShowAllToggle,
}) => {
  const visibleData = showAll ? allData : previewData;
  
  // Format date string for display
  const formatDateString = (dateStr: string): string => {
    if (!dateStr) return '';
    
    try {
      // Check if it's already in a valid format
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMM d, yyyy');
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="spreadsheet-url">Google Sheet URL</Label>
        <Input
          id="spreadsheet-url"
          value={spreadsheetUrl}
          onChange={(e) => onSpreadsheetUrlChange(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          Paste the full URL of your Google Sheet
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sheet-name">Sheet Name (Optional)</Label>
        <Input
          id="sheet-name"
          value={sheetName}
          onChange={(e) => onSheetNameChange(e.target.value)}
          placeholder="Sheet1"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          Leave blank to use the first sheet
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {allData.length > 5 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onShowAllToggle}
              aria-pressed={showAll}
            >
              {showAll ? (
                <>
                  <EyeOff className="mr-1 h-4 w-4" />
                  Show Preview
                </>
              ) : (
                <>
                  <Eye className="mr-1 h-4 w-4" />
                  Show All ({allData.length})
                </>
              )}
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={onFetchPreview}
          disabled={!spreadsheetUrl || loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Import className="mr-2 h-4 w-4" />
          )}
          Preview Data
        </Button>
      </div>
      {visibleData.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Preview:{" "}
            <span className="text-xs text-muted-foreground">
              {showAll ? "All companies" : "First 5 rows"}
            </span>
          </h3>
          <div className="border rounded-md overflow-x-auto max-h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{formatDateString(row.date_applied)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          row.status.toLowerCase().includes("applied")
                            ? "bg-blue-100 text-blue-800"
                            : row.status.toLowerCase().includes("interview")
                            ? "bg-yellow-100 text-yellow-800"
                            : row.status.toLowerCase().includes("offer")
                            ? "bg-green-100 text-green-800"
                            : row.status.toLowerCase().includes("reject")
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {showAll
              ? `Showing all ${allData.length} companies.`
              : `Showing first ${previewData.length} rows. Status values will be normalized during import.`}
          </p>
        </div>
      )}
    </>
  );
};

export default SheetsPreviewSection;
