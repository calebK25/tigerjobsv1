
// Row normalization for imported Google Sheet data

const VALID_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export function normalizeRow(row: any[], indices: Record<string, number>, userId: string) {
  let dateApplied = row[indices.dateAppliedIndex];
  
  // Enhanced date normalization
  // Try multiple date formats and normalize to YYYY-MM-DD
  if (dateApplied) {
    try {
      // Convert empty strings to null
      if (dateApplied.trim() === '') {
        dateApplied = null;
      } else {
        // Try parsing as date string
        let parsedDate = new Date(dateApplied);
        
        // Check if it's a valid date
        if (!isNaN(parsedDate.getTime())) {
          dateApplied = parsedDate.toISOString().split('T')[0];
        } else {
          // Try to handle common date formats like MM/DD/YYYY or DD-MM-YYYY
          if (dateApplied.includes('/')) {
            const parts = dateApplied.split('/');
            // Handle American format MM/DD/YYYY
            if (parts.length === 3) {
              // Assume MM/DD/YYYY format if first part is 12 or less
              if (parseInt(parts[0]) <= 12) {
                parsedDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
              } else {
                // Else assume DD/MM/YYYY
                parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              }
              if (!isNaN(parsedDate.getTime())) {
                dateApplied = parsedDate.toISOString().split('T')[0];
              }
            }
          } else if (dateApplied.includes('-')) {
            const parts = dateApplied.split('-');
            // If it's already in YYYY-MM-DD format, it would have been parsed correctly above
            // This is for DD-MM-YYYY format
            if (parts.length === 3 && parts[0].length <= 2) {
              parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              if (!isNaN(parsedDate.getTime())) {
                dateApplied = parsedDate.toISOString().split('T')[0];
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(`Error parsing date: ${dateApplied}`, e);
      // Keep the original value if parsing fails
    }
  }
  
  let status = indices.statusIndex !== -1 ? (row[indices.statusIndex] || "Applied") : "Applied";
  status = status.trim();
  const normalizedStatus = VALID_STATUSES.find(validStatus =>
    status.toLowerCase().includes(validStatus.toLowerCase())
  ) || 'Applied';

  return {
    user_id: userId,
    company: row[indices.companyIndex],
    role: indices.roleIndex !== -1 ? row[indices.roleIndex] : "",
    date_applied: dateApplied,
    status: normalizedStatus,
    notes: indices.notesIndex !== -1 ? row[indices.notesIndex] : "",
    location: indices.locationIndex !== -1 ? row[indices.locationIndex] : "",
    source: "import",
  };
}
