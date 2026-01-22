const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkColumns() {
  console.log('Checking columns for "Api" table...');
  const { data, error } = await supabase.from('Api').select('*').limit(1);

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns found:', Object.keys(data[0]));
    if (Object.keys(data[0]).includes('logo')) {
      console.log('✅ "logo" column EXISTS.');
    } else {
      console.log('❌ "logo" column MISSING.');
    }
  } else {
    console.log(
      'No data found in Api table to infer columns. Try adding a dummy row or checking Supabase dashboard.'
    );
    // Try inserting a dummy row to see if it fails on 'logo' column? No, that's risky.
  }
}

checkColumns();
