import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase credentials
const supabaseUrl = "your-url-here"
const supabaseKey = "your-anon-key-here"
const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch drivers with team info
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
    console.error("Error loading drivers:", error)
    return
  }

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

// Run
loadDrivers()
