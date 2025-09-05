// netlify/functions/record_lap.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  try {
    const body = JSON.parse(event.body);
    const { event_id, driver_id, lap_ms, timestamp } = body;
    if (!driver_id || (typeof lap_ms === 'undefined')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'missing driver_id or lap_ms' }) };
    }

    const { data, error } = await supabase.from('laps').insert({
      event_id: event_id || null,
      driver_id,
      lap_ms,
      created_at: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
    }).select();

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, lap: data[0] }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
