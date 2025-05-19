
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SheetsImportSummaryProps {
  summary: any;
  onClose: () => void;
}

const SheetsImportSummary: React.FC<SheetsImportSummaryProps> = ({
  summary,
  onClose,
}) => (
  <div className="space-y-4">
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Check className="h-5 w-5 text-green-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Import completed</h3>
          <div className="mt-2 text-sm text-green-700">
            <ul className="list-disc pl-5 space-y-1">
              <li>Total rows: {summary.total}</li>
              <li>Successfully imported: {summary.imported}</li>
              <li>Skipped rows: {summary.skipped}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    {summary.errors && summary.errors.length > 0 && (
      <div className="mt-3">
        <h4 className="text-sm font-medium">Errors:</h4>
        <ul className="mt-1 text-sm text-red-600 list-disc pl-5">
          {summary.errors.slice(0, 5).map((err: string, i: number) => (
            <li key={i}>{err}</li>
          ))}
          {summary.errors.length > 5 && (
            <li>...and {summary.errors.length - 5} more errors</li>
          )}
        </ul>
      </div>
    )}
    <Button onClick={onClose} className="mt-4">
      Close
    </Button>
  </div>
);

export default SheetsImportSummary;
