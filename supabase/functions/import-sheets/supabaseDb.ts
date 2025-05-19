
// Inserts rows into the "interviews" table in Supabase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

export async function insertRowsToSupabase(rows: any[]) {
  if (rows.length === 0) return { data: [], error: null };
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Transform column names if needed
    const transformedRows = rows.map(row => ({
      user_id: row.user_id,
      company: row.company,
      role: row.role,
      date_applied: row.date_applied,
      status: row.status,
      notes: row.notes,
      location: row.location,
      source: row.source
    }));
    
    console.log('Inserting rows into interviews table:', transformedRows.length);
    return await supabaseClient
      .from('interviews')
      .insert(transformedRows)
      .select();
  } catch (error) {
    console.error('Error inserting rows to Supabase:', error);
    throw error;
  }
}
