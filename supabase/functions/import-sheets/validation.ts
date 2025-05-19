
// Validation utilities for the Google Sheets import

export function validateParams(params: { 
  spreadsheetId: string | undefined; 
  accessToken: string | undefined;
  userId: string | undefined;
}) {
  if (!params.spreadsheetId) {
    throw new Error("Missing required parameter: spreadsheetId");
  }
  if (!params.accessToken) {
    throw new Error("Missing required parameter: accessToken");
  }
  if (!params.userId) {
    throw new Error("Missing required parameter: userId");
  }
}

export function findHeaderIndices(headers: string[]) {
  // Improved header detection with better matching for date columns
  const result: Record<string, number> = {
    companyIndex: -1,
    roleIndex: -1,
    dateAppliedIndex: -1,
    statusIndex: -1,
    notesIndex: -1,
    locationIndex: -1
  };
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    
    if (header.includes('company')) {
      result.companyIndex = i;
    } else if (
      header.includes('role') || 
      header.includes('position') || 
      header.includes('title') ||
      header.includes('job')
    ) {
      result.roleIndex = i;
    } else if (
      header.includes('date') || 
      header.includes('applied') ||
      header.includes('application') ||
      header === 'when' ||
      header.includes('submit')
    ) {
      result.dateAppliedIndex = i;
    } else if (header.includes('status') || header.includes('stage')) {
      result.statusIndex = i;
    } else if (
      header.includes('note') || 
      header.includes('comment') || 
      header.includes('description')
    ) {
      result.notesIndex = i;
    } else if (
      header.includes('location') || 
      header.includes('city') || 
      header.includes('remote') ||
      header.includes('place')
    ) {
      result.locationIndex = i;
    }
  }
  
  return result;
}
