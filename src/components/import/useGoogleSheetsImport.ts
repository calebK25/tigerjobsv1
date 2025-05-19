import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

// Types and Google OAuth2 config
const GOOGLE_CLIENT_ID = "412756180625-vqb0hrepenp5koe2vojvtcerte1huql4.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = `${window.location.origin}/import`;
const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

export interface PreviewData {
  company: string;
  role: string;
  date_applied: string;
  status: string;
  notes?: string;
  location?: string;
}

export function useGoogleSheetsImport(onImportComplete?: () => void) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [allData, setAllData] = useState<PreviewData[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<any>(null);

  // Extract spreadsheet id from Google Sheet URL
  const extractSpreadsheetId = (url: string): string | null => {
    try {
      const regex = /\/d\/([a-zA-Z0-9-_]+)/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  };

  const reset = () => {
    setSpreadsheetUrl('');
    setSheetName('');
    setPreviewData([]);
    setAllData([]);
    setShowAll(false);
    setError(null);
    setImportSummary(null);
    setAccessToken(null);
    setAuthenticating(false);
    setLoading(false);
  };

  const initiateGoogleAuth = () => {
    setAuthenticating(true);
    setError(null);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(GOOGLE_SCOPE)}&prompt=consent`;

    const popup = window.open(authUrl, 'googleAuthPopup', 'width=500,height=600');
    
    if (!popup) {
      setAuthenticating(false);
      setError('Popup was blocked. Please allow popups for this site and try again.');
      toast.error('Authentication failed: Popup blocked');
      return;
    }
    
    let popupClosedByUser = false;
    let authTimeout: number | null = null;
    
    // Set a timeout to detect if authentication is taking too long
    authTimeout = window.setTimeout(() => {
      if (popup && !popup.closed) {
        popup.close();
      }
      if (authenticating) {
        setAuthenticating(false);
        setError('Authentication timed out. Please try again.');
        toast.error('Authentication timed out');
      }
    }, 120000); // 2 minute timeout
    
    const pollTimer = window.setInterval(() => {
      try {
        // Check if popup was closed by user
        if (popup && popup.closed && !popupClosedByUser) {
          popupClosedByUser = true;
          window.clearInterval(pollTimer);
          if (authTimeout) window.clearTimeout(authTimeout);
          setAuthenticating(false);
          setError('Authentication was cancelled. Please try again when you are ready.');
          toast.error('Authentication was cancelled');
          return;
        }
        
        // Check if authentication was successful
        if (popup && !popup.closed && popup.location.href.includes('access_token')) {
          window.clearInterval(pollTimer);
          if (authTimeout) window.clearTimeout(authTimeout);
          
          const url = new URL(popup.location.href);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const token = hashParams.get('access_token');

          if (token) {
            setAccessToken(token);
            setError(null);
            toast.success('Successfully connected to Google Sheets');
          } else {
            setError('Failed to get access token from Google');
            toast.error('Authentication failed');
          }
          popup.close();
          setAuthenticating(false);
        }
      } catch (e) {
        // Ignore CORS errors until redirect
      }
    }, 500);
  };

  // Improved date handling in this function
  const normalizeDate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    try {
      // Try parsing as standard date string
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }
      
      // Try different date formats
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // Handle MM/DD/YYYY format (US format)
          if (parseInt(parts[0]) <= 12) {
            const date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
          }
          // Handle DD/MM/YYYY format
          const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      } else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        // Handle DD-MM-YYYY format
        if (parts.length === 3 && parts[0].length <= 2) {
          const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
        // YYYY-MM-DD is already handled by the standard date parsing above
      }
      
      return dateStr; // Return original if parsing fails
    } catch (e) {
      console.error("Error parsing date:", e);
      return dateStr;
    }
  };

  // Map sheet rows to PreviewData with improved date handling
  const mapRowsToPreviewData = (headers: string[], rows: string[][]): PreviewData[] => {
    const companyIndex = headers.findIndex((h: string) => h.includes('company'));
    const roleIndex = headers.findIndex((h: string) => 
      h.includes('role') || h.includes('position') || h.includes('title'));
    const dateAppliedIndex = headers.findIndex((h: string) => 
      h.includes('date') || h.includes('applied') || h.includes('application') || h === 'when');
    const statusIndex = headers.findIndex((h: string) => h.includes('status'));
    const notesIndex = headers.findIndex((h: string) => 
      h.includes('notes') || h.includes('comments') || h.includes('description'));
    const locationIndex = headers.findIndex((h: string) => 
      h.includes('location') || h.includes('city') || h.includes('remote'));

    if (companyIndex === -1 || dateAppliedIndex === -1) {
      throw new Error(
        `Missing required columns. Need at least 'Company' and 'Date Applied' columns.\nFound columns: ${headers.join(', ')}`
      );
    }

    return rows.map((row: string[]) => {
      // Handle date normalization here as well
      const rawDate = row[dateAppliedIndex] || '';
      const normalizedDate = normalizeDate(rawDate);
      
      return {
        company: row[companyIndex] || '',
        role: roleIndex !== -1 ? row[roleIndex] || '' : '',
        date_applied: normalizedDate,
        status: statusIndex !== -1 ? row[statusIndex] || 'Applied' : 'Applied',
        notes: notesIndex !== -1 ? row[notesIndex] || '' : '',
        location: locationIndex !== -1 ? row[locationIndex] || '' : '',
      };
    });
  };

  // Fetch preview data from Google Sheets, setAllData & setPreviewData
  const fetchSheetPreview = async () => {
    if (!accessToken) {
      setError('Please authenticate with Google Sheets first');
      return;
    }
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      setError('Invalid Google Sheets URL. Please provide a valid URL.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const sheetsResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!sheetsResponse.ok) {
        const errorData = await sheetsResponse.json();
        throw new Error(errorData.error?.message || 'Failed to fetch spreadsheet metadata');
      }

      const sheetsData = await sheetsResponse.json();
      let targetSheetName = sheetName;
      if (!targetSheetName && sheetsData.sheets && sheetsData.sheets.length > 0) {
        targetSheetName = sheetsData.sheets[0].properties.title;
      }
      const sheetExists = !targetSheetName || sheetsData.sheets.some(
        (sheet: any) => sheet.properties.title === targetSheetName
      );
      if (!sheetExists) {
        throw new Error(`Sheet "${targetSheetName}" not found in the spreadsheet. Available sheets: ${
          sheetsData.sheets.map((s: any) => s.properties.title).join(', ')
        }`);
      }
      const rangeNotation = targetSheetName ? `'${targetSheetName}'!A1:F1000` : 'A1:F1000';
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(rangeNotation)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch spreadsheet data');
      }

      const data = await response.json();
      if (!data.values || data.values.length === 0) {
        throw new Error('No data found in the selected sheet');
      }
      const headers = data.values[0].map((header: string) => header.toLowerCase().trim());
      const rows = data.values.slice(1);

      const mappedAll = mapRowsToPreviewData(headers, rows);
      setAllData(mappedAll);
      setPreviewData(mappedAll.slice(0, 5));
    } catch (error: any) {
      setAllData([]);
      setPreviewData([]);
      setError(error.message || 'Failed to fetch sheet preview');
      toast.error('Error loading sheet preview');
    } finally {
      setLoading(false);
    }
  };

  // Import data by calling the Edge Function
  const importData = async () => {
    if (!accessToken || !user) {
      setError('Please authenticate with Google Sheets first');
      return;
    }
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) {
      setError('Invalid Google Sheets URL. Please provide a valid URL.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const sheetsResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!sheetsResponse.ok) {
        const errorData = await sheetsResponse.json();
        throw new Error(errorData.error?.message || 'Failed to fetch spreadsheet metadata');
      }

      const sheetsData = await sheetsResponse.json();
      let effectiveSheetName = sheetName;
      if (!effectiveSheetName && sheetsData.sheets && sheetsData.sheets.length > 0) {
        effectiveSheetName = sheetsData.sheets[0].properties.title;
      }

      // Call Supabase Edge Function
      const { data, error: supaError } = await supabase.functions.invoke('import-sheets', {
        body: {
          spreadsheetId: spreadsheetId,
          sheetName: effectiveSheetName || undefined,
          accessToken: accessToken,
          userId: user.id,
        },
      });

      if (supaError) {
        console.error('Supabase function error:', supaError);
        throw new Error(`API Error: ${supaError.message}`);
      }
      if (!data) {
        throw new Error('No response from API');
      }
      if (data.error) {
        throw new Error(data.error);
      }

      setImportSummary(data.summary);

      if (data.summary && data.summary.imported > 0) {
        toast.success(`Successfully imported ${data.summary.imported} interviews`);
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        toast.warning('No interviews were imported');
      }
    } catch (error: any) {
      console.error('Import error:', error);
      setError(error.message || 'Failed to import data');
      toast.error('Error importing data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
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
    setError,
    importSummary,
    setImportSummary,
    initiateGoogleAuth,
    fetchSheetPreview,
    importData,
    reset,
  };
}
