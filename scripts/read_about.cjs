const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function readAboutContent() {
    const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'about')
        .single();

    if (error) {
        console.error('Error fetching content:', error);
        process.exit(1);
    }

    console.log(JSON.stringify(data.content, null, 2));
}

readAboutContent();
