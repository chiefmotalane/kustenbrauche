/* ====== NAV MOBILE ====== */
const nav = document.querySelector('.navbar');
document.querySelector('.nav-toggle').addEventListener('click', () => {
  nav.classList.toggle('open');
});

/* ====== COUNTDOWNS ====== */
// 1) Navbar F1 next race (center)
const raceNameEl = document.getElementById('raceName');
const raceCountdownEl = document.getElementById('raceCountdown');

// EDIT this when you know the real next race datetime:
const nextRace = {
  name: 'Italian GP',
  // YYYY-MM-DDTHH:MM:SS with timezone if you want: +02:00
  when: '2025-10-11T20:30:00'
};
raceNameEl.textContent = `Next: ${nextRace.name}`;
startCountdown(new Date(nextRace.when).getTime(), raceCountdownEl);

// 2) Banner drop countdown
const dropDate = '2025-09-03T18:00:00'; // change anytime
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

/* ====== EVENTS STRIP (auto-scroll + manual) ====== */
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
