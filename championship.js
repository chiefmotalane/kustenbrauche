
  async function loadCars() {
    let response = await fetch('/.netlify/functions/supabase');
    let data = await response.json();
    console.log(data); // shows in browser console
  }

  loadCars();

