// db.js
// One place to get the Supabase client.
// We create it lazily so dotenv has already loaded by the time it's called.

const { createClient } = require('@supabase/supabase-js')

let _client = null

function getDB() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return _client
}

module.exports = { getDB }
