import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const supabaseUrl = "https://theghmkzfbwpogubhcnx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWdobWt6ZmJ3cG9ndWJoY254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjI4NDgsImV4cCI6MjA3MjU5ODg0OH0.EuFc9K4kJp0BjjX5G1kLmLM1pHfg9g-bmjyd9qTTWl0"
const supabase = createClient(supabaseUrl, supabaseKey)

// Load standings from results table
async function loadStandings() {
  const { data, error } = await supabase
    .from('results')
    .select(`
      points,
      position,
      driver:drivers (
        name,
        image_url,
        team:teams (
          name,
          logo_url
        )
      )
    `)
    .order('points', { ascending: false })

  if (error) {
    console.error("Error loading standings:", error)
    return
  }

  const resultsList = document.getElementById("resultsList")
  resultsList.innerHTML = ""

  data.forEach((r, idx) => {
    const row = document.createElement("div")
    row.className = "result-row"
    row.innerHTML = `
      <div>${idx + 1}</div>
      <div class="result-driver">
        <img class="driver-pic" src="${r.driver?.image_url || 'images/placeholder-driver.png'}" alt="${r.driver?.name}">
        ${r.driver?.name || 'Unknown'}
      </div>
      <div class="result-team">
        ${r.driver?.team?.name || 'No Team'}
        ${r.driver?.team?.logo_url ? `<img class="team-logo" src="${r.driver.team.logo_url}" alt="${r.driver.team.name}">` : ""}
      </div>
      <div class="result-points">${r.points}</div>
    `
    resultsList.appendChild(row)
  })
}

// Run
loadStandings()

// Refresh button (optional, if you want it)
document.getElementById("refreshStandings")?.addEventListener("click", loadStandings)
