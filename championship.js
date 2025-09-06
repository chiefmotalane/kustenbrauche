// championship.js

// 1. Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 2. Connect to your project
const supabaseUrl = "https://theghmkzfbwpogubhcnx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWdobWt6ZmJ3cG9ndWJoY254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjI4NDgsImV4cCI6MjA3MjU5ODg0OH0.EuFc9K4kJp0BjjX5G1kLmLM1pHfg9g-bmjyd9qTTWl0"
const supabase = createClient(supabaseUrl, supabaseKey)

// 3. Example: fetch drivers with team info
async function loadDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select(`
      id,
      name,
      image_url,
      team:teams(name, logo_url)
    `)

  if (error) {
    console.error("Error loading drivers:", error)
    return
  }

  // Find the container in your HTML
  const container = document.getElementById("drivers-list")
  container.innerHTML = ""

  // Loop through and display
  data.forEach(driver => {
    const card = document.createElement("div")
    card.className = "driver-card"
    card.innerHTML = `
      <img src="${driver.image_url}" alt="${driver.name}">
      <h3>${driver.name}</h3>
      <p>Team: ${driver.team.name}</p>
      <img class="team-logo" src="${driver.team.logo_url}" alt="${driver.team.name}">
    `
    container.appendChild(card)
  })
}

// 4. Run on page load
loadDrivers()

  async function loadCars() {
    let response = await fetch('/.netlify/functions/supabase');
    let data = await response.json();
    console.log(data); // shows in browser console
  }

  loadCars();

