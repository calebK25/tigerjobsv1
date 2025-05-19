
// Main handler for Google Sheets interview import

import { validateParams, findHeaderIndices } from "./validation.ts";
import { normalizeRow } from "./normalize.ts";
import { fetchSheetRows } from "./googleSheets.ts";
import { insertRowsToSupabase } from "./supabaseDb.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// --- Helper ---
async function parseRequestJson(req: Request) {
  try {
    return await req.json();
  } catch (error) {
    console.error('Error parsing request JSON:', error);
    throw new Error("Invalid JSON body");
  }
}

// Direct fetch to Google Sheets API without using googleapis library
async function fetchGoogleSheetsData(accessToken: string, spreadsheetId: string, range: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Failed to fetch spreadsheet data: ${response.status}`);
  }
  
  return response.json();
}

// Get spreadsheet metadata
async function fetchSpreadsheetMetadata(accessToken: string, spreadsheetId: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `Failed to fetch spreadsheet metadata: ${response.status}`);
  }
  
  return response.json();
}

// --- Main Handler ---
Deno.serve(async (req) => {
  console.log(`Function called with method: ${req.method}`);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    console.log("Import sheets function called");
    
    const { spreadsheetId, sheetName, accessToken, userId } = await parseRequestJson(req);
    console.log(`Request params: spreadsheetId=${spreadsheetId}, sheetName=${sheetName || 'default'}, userId=${userId}`);
    
    validateParams({ spreadsheetId, accessToken, userId });

    console.log(`Fetching spreadsheet: ${spreadsheetId}, sheet: ${sheetName || 'first sheet'}`);
    
    // Get spreadsheet metadata first
    const sheetsData = await fetchSpreadsheetMetadata(accessToken, spreadsheetId);
    
    // Determine sheet name
    let effectiveSheetName = sheetName;
    if (!effectiveSheetName && sheetsData.sheets && sheetsData.sheets.length > 0) {
      effectiveSheetName = sheetsData.sheets[0].properties.title;
    }
    
    const sheetExists = !effectiveSheetName || sheetsData.sheets.some(
      (sheet: any) => sheet.properties.title === effectiveSheetName
    );
    
    if (!sheetExists) {
      throw new Error(`Sheet "${effectiveSheetName}" not found in the spreadsheet. Available sheets: ${
        sheetsData.sheets.map((s: any) => s.properties.title).join(', ')
      }`);
    }
    
    // Fetch the actual data
    const rangeNotation = effectiveSheetName ? `'${effectiveSheetName}'!A1:F1000` : 'A1:F1000';
    const data = await fetchGoogleSheetsData(accessToken, spreadsheetId, rangeNotation);

    if (!data.values || data.values.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No data found in the spreadsheet' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Found ${data.values.length} rows in spreadsheet. Processing...`);
    const headers = data.values[0].map((header: string) => header.toLowerCase().trim());
    const indices = findHeaderIndices(headers);

    if (indices.companyIndex === -1 || indices.dateAppliedIndex === -1) {
      return new Response(
        JSON.stringify({
          error: `Missing required columns. Need at least 'Company' and 'Date' columns.
                 Found columns: ${headers.join(', ')}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const dataRows = data.values.slice(1);
    const validRows: any[] = [];
    const skippedRows: number[] = [];
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row[indices.companyIndex] || !row[indices.dateAppliedIndex]) {
        skippedRows.push(i + 2); // +2 to account for 0-indexing and header row
        continue;
      }
      try {
        const interview = normalizeRow(row, indices, userId);
        validRows.push(interview);
      } catch (error: any) {
        errors.push(`Row ${i + 2}: ${error.message}`);
        skippedRows.push(i + 2);
      }
    }

    let insertedCount = 0;
    if (validRows.length > 0) {
      console.log(`Inserting ${validRows.length} rows to Supabase`);
      const { data, error } = await insertRowsToSupabase(validRows);
      if (error) {
        console.error('Supabase insert error:', error);
        return new Response(
          JSON.stringify({
            error: `Failed to insert interviews: ${error.message}`,
            details: error
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      insertedCount = data?.length || 0;
      console.log(`Successfully inserted ${insertedCount} rows`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: dataRows.length,
          imported: insertedCount,
          skipped: skippedRows.length,
          skippedRows,
          errors,
        },
        previewData: validRows.slice(0, 5),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error(`Error in import-sheets function:`, error);
    return new Response(
      JSON.stringify({
        error: `Failed to import from Google Sheets: ${error.message}`,
        details: String(error)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
