/* ====== NAV MOBILE ====== */
const nav = document.querySelector('.navbar');
document.querySelector('.nav-toggle').addEventListener('click', () => {
  nav.classList.toggle('open');
});

/* ====== COUNTDOWNS ====== */
// 1) Navbar F1 next race (center)
const raceNameEl = document.getElementById('raceName');
const raceCountdownEl = document.getElementById('raceCountdown');

// Next race datetime:
const nextRace = {
  name: 'Italian GP',
// countdown
  when: '2025-09-14T20:30:00'
};
raceNameEl.textContent = `Next: ${nextRace.name}`;
startCountdown(new Date(nextRace.when).getTime(), raceCountdownEl);

//Drop countdown
const dropDate = '2025-09-12T18:00:00'; // droping time
startCountdown(new Date(dropDate).getTime(), document.getElementById('dropCountdown'));

function startCountdown(targetMs, el) {
  const tick = setInterval(() => {
    const now = Date.now();
    const diff = targetMs - now;
    if (diff <= 0) { clearInterval(tick); el.textContent = 'LAUNCHED'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${d}d ${h}h ${m}m ${s}s`;
  }, 1000);
}

// Events cards
const strip = document.getElementById('eventStrip');
let autoScroll;
function startAutoScroll() {
  stopAutoScroll();
  autoScroll = setInterval(() => {
    strip.scrollBy({ left: 300, behavior: 'smooth' });
    // loop back when near end
    if (strip.scrollLeft + strip.clientWidth + 10 >= strip.scrollWidth) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 2000); // 2 sec
}
function stopAutoScroll(){ if (autoScroll) clearInterval(autoScroll); }
startAutoScroll();

// pause when user interacts
['pointerdown','wheel','touchstart','mouseenter','focusin'].forEach(evt => {
  strip.addEventListener(evt, stopAutoScroll, { passive: true });
});
['mouseleave','touchend','focusout'].forEach(evt => {
  strip.addEventListener(evt, startAutoScroll, { passive: true });
});

/* ====== TICKET MODAL ====== */
const modal = document.getElementById('ticketModal');
const form = document.getElementById('ticketForm');
const closeBtn = document.getElementById('closeModal');
const thankYou = document.getElementById('thankYou');
const eventNameSpan = document.getElementById('eventName');
const modalTitle = document.getElementById('modalTitle');

// open
document.querySelectorAll('.ticket-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    eventNameSpan.textContent = btn.dataset.event || 'Selected Event';
    thankYou.hidden = true;
    form.reset();
    modal.showModal();
  });
});

// close
closeBtn.addEventListener('click', () => modal.close());

// submit (front-end only)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ig = document.getElementById('igHandle').value.trim();
  const ok1 = document.getElementById('chkSupport').checked;
  const ok2 = document.getElementById('chkFollow').checked;
  if (!ig || !ok1 || !ok2) return;

  // here is where you would POST to a backend / Netlify Forms / Google Sheet later
  thankYou.hidden = false;

  // quick UX: close after short delay
  setTimeout(() => modal.close(), 1600);
});
// Learn More popup placeholder
document.querySelectorAll('.learn-more').forEach(btn => {
  btn.addEventListener('click', () => {
    alert(`Details coming soon for ${btn.previousElementSibling.textContent}`);
  });
});
// Fade-in sections on scroll
const faders = document.querySelectorAll('.about-section');
const options = { threshold: 0.2 };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, options);

faders.forEach(section => {
  section.classList.add('fade');
  appearOnScroll.observe(section);
});
