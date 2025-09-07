import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const supabaseUrl = "https://theghmkzfbwpogubhcnx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWdobWt6ZmJ3cG9ndWJoY254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjI4NDgsImV4cCI6MjA3MjU5ODg0OH0.EuFc9K4kJp0BjjX5G1kLmLM1pHfg9g-bmjyd9qTTWl0"
const supabase = createClient(supabaseUrl, supabaseKey)

console.log("✅ championship.js loaded")

// Load drivers
async function loadDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select(`
      id,
      name,
      image_url,
      team:teams (
        name,
        logo_url
      )
    `)

  if (error) {
    console.error("❌ Error loading drivers:", error)
    return
  }

  console.log("🎯 Drivers:", data)

  const container = document.getElementById("drivers-list")
  container.innerHTML = ""

  data.forEach(driver => {
    const card = document.createElement("div")
    card.className = "driver-card"
    card.innerHTML = `
      <img src="${driver.image_url}" alt="${driver.name}">
      <h3>${driver.name}</h3>
      <p>Team: ${driver.team?.name || "No Team"}</p>
      ${driver.team?.logo_url ? `<img class="team-logo" src="${driver.team.logo_url}" alt="${driver.team.name}">` : ""}
    `
    container.appendChild(card)
  })
}

// Load standings
async function loadStandings() {
  const { data: results, error: resultsError } = await supabase
    .from("results")  // ✅ correct table name
    .select("driver_id, points")

  if (resultsError) {
    console.error("❌ Error loading results:", resultsError)
    return
  }

  console.log("🎯 Results:", results)

  // Fetch drivers with teams
  const { data: drivers, error: driversError } = await supabase
    .from("drivers")
    .select("id, name, team_id")

  if (driversError) {
    console.error("❌ Error loading drivers:", driversError)
    return
  }

  console.log("🎯 Drivers:", drivers)

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, name")

  if (teamsError) {
    console.error("❌ Error loading teams:", teamsError)
    return
  }

  console.log("🎯 Teams:", teams)

  // Merge points
  const standingsMap = {}
  results.forEach(r => {
    if (!standingsMap[r.driver_id]) standingsMap[r.driver_id] = 0
    standingsMap[r.driver_id] += r.points
  })

  const standings = drivers.map(d => {
    return {
      id: d.id,
      name: d.name,
      team: teams.find(t => t.id === d.team_id)?.name || "No Team",
      points: standingsMap[d.id] || 0
    }
  })

  // Sort by points
  standings.sort((a, b) => b.points - a.points)

  console.log("📊 Final standings:", standings)

  // Render table
  const tbody = document.querySelector("#standingsTable tbody")
  tbody.innerHTML = ""

  standings.forEach((s, idx) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td>${s.name}</td>
      <td>${s.team}</td>
      <td>${s.points}</td>
    `
    tbody.appendChild(row)
  })
}

// Run
loadDrivers()
loadStandings()

document.getElementById("refreshStandings").addEventListener("click", loadStandings)
