const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY; // match Netlify var name

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('drivers')
    .select(`id, name, image_url, team:teams(name, logo_url)`);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
