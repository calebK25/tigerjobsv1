
// Google Sheets API helpers for importing interviews

// Direct fetch functions for Google Sheets API
export async function fetchSheetRows(accessToken: string, spreadsheetId: string, sheetName: string | undefined) {
  try {
    const rangeStr = sheetName ? `${sheetName}!A1:F1000` : 'A1:F1000';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(rangeStr)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Failed to fetch sheet data: ${response.status}`);
    }
    
    const data = await response.json();
    return data.values;
  } catch (error) {
    console.error('Error fetching sheet rows:', error);
    throw error;
  }
}
