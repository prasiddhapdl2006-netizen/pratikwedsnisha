/* ============================================================
   Bishal & Riya — interactions
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* always start at the top on refresh */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.addEventListener('load', () => window.scrollTo(0, 0));

  initLanguageToggle();

  const intro    = $('#intro');
  const prompt   = $('#curtainPrompt');
  const openBtn  = $('#openBtn');
  const bgm      = $('#bgm');
  const musicBtn = $('#musicToggle');
  let opened = false, finished = false;

  /* ---------- open invitation (zoom reveal) ---------- */
  function openCurtain() {
    if (opened) return;
    opened = true;
    bgm.volume = 0.65;
    const playPromise = bgm.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("Audio play error:", err);
      });
    }
    musicBtn.hidden = false; musicBtn.classList.remove('muted');
    prompt.classList.add('fade');
    startFalling();
    window.scrollTo(0, 0);
    setTimeout(() => intro.classList.add('open'), 180);
    setTimeout(finishCurtain, 1200);
  }
  function finishCurtain() {
    if (finished) return;
    finished = true;
    intro.classList.add('open');
    setTimeout(() => { intro.style.display = 'none'; }, 200);
    document.body.style.overflow = '';
    document.body.classList.add('unlocked');
    petalBloom();
    window.scrollTo(0, 0);
    revealOnScroll();
  }
  openBtn.addEventListener('click', openCurtain);
  document.body.style.overflow = 'hidden';

  /* ---------- music ---------- */
  function fadeAudio(target, ms) {
    const start = bgm.volume, t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / ms);
      bgm.volume = Math.max(0, Math.min(1, start + (target - start) * k));
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  musicBtn.addEventListener('click', () => {
    if (bgm.paused) { bgm.play().then(() => fadeAudio(0.55, 600)).catch(() => {}); musicBtn.classList.remove('muted'); }
    else { bgm.pause(); musicBtn.classList.add('muted'); }
  });  /* ---------- falling petals + glitter (red · yellow · green) ---------- */
  const PETAL_COLORS = [
    'linear-gradient(135deg,#ef5350,#9e1b22)',
    'linear-gradient(135deg,#f25c5c,#7a141a)',
    'linear-gradient(135deg,#f8d24e,#d99a2a)',
    'linear-gradient(135deg,#f6c63f,#c98a2a)',
    'linear-gradient(135deg,#6fbb4f,#39521f)'
  ];
  let falling = false;
  function startFalling() {
    if (falling) return; falling = true;
    const layer = $('#sparks'); if (!layer) return;
    for (let i = 0; i < 24; i++) spawnFaller(layer, 'petal', true);
    for (let i = 0; i < 16; i++) spawnFaller(layer, 'glitter', true);
  }
  function spawnFaller(layer, kind, initial) {
    const el = document.createElement('span');
    const glitter = kind === 'glitter';
    el.className = glitter ? 'glitter' : 'fall-petal';
    const size = glitter ? (4 + Math.random() * 6) : (10 + Math.random() * 12);
    el.style.width = size + 'px'; el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + '%';
    if (!glitter) { el.style.background = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]; el.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2); }
    layer.appendChild(el);
    const dur = (glitter ? 5000 : 7000) + Math.random() * 5000;
    const drift = Math.random() * 120 - 60, spin = Math.random() * 720 - 360;
    const startY = initial ? -(Math.random() * 110) : -10;
    const frames = glitter
      ? [{ transform: `translate(0,${startY}vh) scale(.6)`, opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: .2, offset: .5 }, { opacity: 1, offset: .8 }, { transform: `translate(${drift}px,112vh) scale(1)`, opacity: 0 }]
      : [{ transform: `translate(0,${startY}vh) rotate(0deg)` }, { transform: `translate(${drift}px,112vh) rotate(${spin}deg)` }];
    const anim = el.animate(frames, { duration: dur, easing: glitter ? 'ease-in-out' : 'cubic-bezier(.35,.1,.6,1)', delay: initial ? Math.random() * dur : 0 });
    anim.onfinish = () => { el.remove(); spawnFaller(layer, kind, false); };
  }

  /* ---------- petal bloom burst ---------- */
  function petalBloom() {
    const layer = $('#bloom'); if (!layer) return;
    const N = 90;
    for (let i = 0; i < N; i++) {
      const el = document.createElement('span');
      el.className = 'bloom-petal';
      const size = 10 + Math.random() * 16;
      el.style.width = size + 'px'; el.style.height = size + 'px';
      el.style.left = Math.random() * 100 + '%';
      el.style.background = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
      el.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
      layer.appendChild(el);
      const dur = 3200 + Math.random() * 2600, drift = Math.random() * 160 - 80, spin = Math.random() * 720 - 360;
      const anim = el.animate([{ transform: 'translate(0,-10vh) rotate(0deg)' }, { transform: `translate(${drift}px,110vh) rotate(${spin}deg)` }],
        { duration: dur, delay: Math.random() * 600, easing: 'cubic-bezier(.3,.1,.5,1)' });
      anim.onfinish = () => el.remove();
    }
  }

  /* ---------- corner ornaments (red rose · green leaves · gold filigree) ---------- */
  (function corners() {
    const SVG =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46">' +
      '<g fill="none" stroke="#c9a24a" stroke-width="1.3" stroke-linecap="round">' +
      '<path d="M7 17 C7 11 11 7 17 7"/><path d="M17 7 C27 7 36 7 44 5"/>' +
      '<path d="M7 17 C7 27 7 36 5 44"/><path d="M40 7 c-1 5 2 8 6 6"/><path d="M7 40 c5 1 8-2 6-6"/></g>' +
      '<path d="M21 12 C29 10 38 12 45 8 C40 17 30 18 22 16 Z" fill="#3f7d36"/>' +
      '<path d="M12 21 C10 29 12 38 8 45 C17 40 18 30 16 22 Z" fill="#3f7d36"/>' +
      '<circle cx="14" cy="14" r="8.4" fill="#9e1b22"/>' +
      '<path d="M14 7 a7 7 0 1 1 -0.1 0" fill="none" stroke="#5f0d12" stroke-width="1.3"/>' +
      '<path d="M14 10 a4 4 0 1 1 -0.1 0" fill="none" stroke="#e0454c" stroke-width="1.4"/>' +
      '<circle cx="14" cy="14" r="2.2" fill="#5f0d12"/></svg>';
    $$('.curvy').forEach((card) => ['tl', 'tr', 'bl', 'br'].forEach((p) => {
      const c = document.createElement('span'); c.className = 'card-corner ' + p; c.innerHTML = SVG; card.appendChild(c);
    }));
  })();

  /* ---------- scratch3 section removed ---------- */

  /* ---------- nepali numbers helper ---------- */
  function toNepaliNums(numStr) {
    const nepaliDigits = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
    return String(numStr).replace(/[0-9]/g, (w) => nepaliDigits[w]);
  }

  /* ---------- countdowns (any number, via data-target) ---------- */
  (function countdowns() {
    const blocks = $$('.countdown[data-target]'); if (!blocks.length) return;
    function tick() {
      const now = new Date();
      const isNe = document.body.classList.contains('lang-ne');
      const formatVal = (v) => isNe ? toNepaliNums(v) : v;
      blocks.forEach((b) => {
        let diff = Math.max(0, new Date(b.dataset.target) - now);
        const d = Math.floor(diff / 864e5); diff -= d * 864e5;
        const h = Math.floor(diff / 36e5); diff -= h * 36e5;
        const m = Math.floor(diff / 6e4); diff -= m * 6e4;
        const s = Math.floor(diff / 1e3);
        const set = (k, v) => { const el = b.querySelector('[data-cd="' + k + '"]'); if (el) el.textContent = v; };
        set('days', formatVal(d)); set('hours', formatVal(String(h).padStart(2, '0'))); set('mins', formatVal(String(m).padStart(2, '0'))); set('secs', formatVal(String(s).padStart(2, '0')));
      });
    }
    tick(); setInterval(tick, 1000);
    window.tickCountdowns = tick;
  })();

  /* ---------- stacked photo gallery ---------- */
  (function stackCarousel() {
    const track = $('#stackTrack'), dotsBox = $('#cdots');
    if (!track || !dotsBox) return;

    const cards = $$('.stack-card', track);
    const total = cards.length;
    let current = 0, busy = false;

    cards.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'cdot' + (i === 0 ? ' on' : '');
      dotsBox.appendChild(d);
    });
    const dots = $$('.cdot', dotsBox);

    function layout() {
      cards.forEach((card, i) => {
        card.classList.remove('stack-0', 'stack-1', 'stack-2', 'stack-3', 'stack-4', 'stack-hidden', 'is-top', 'swipe-left', 'swipe-right');
        const pos = (i - current + total) % total;
        if (pos < 5) card.classList.add('stack-' + pos);
        else card.classList.add('stack-hidden');
        if (pos === 0) card.classList.add('is-top');
      });
      dots.forEach((d, i) => d.classList.toggle('on', i === current));
    }

    function advance(direction) {
      if (busy || total < 2) return;
      busy = true;
      const top = cards[current];
      top.style.transform = '';
      top.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');
      setTimeout(() => {
        current = (current + 1) % total;
        top.classList.remove('swipe-left', 'swipe-right');
        layout();
        busy = false;
      }, 380);
    }

    layout();

    let startX = 0, startY = 0, dragging = false;
    track.addEventListener('pointerdown', (e) => {
      if (!cards[current].classList.contains('is-top')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!dragging || busy) return;
      const top = cards[current];
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        top.style.transform = 'translateX(calc(-50% + ' + dx + 'px)) rotate(' + (dx * 0.06) + 'deg)';
      }
    });
    track.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const top = cards[current];
      top.style.transform = '';
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        advance(dx < 0 ? 'left' : 'right');
      } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        advance('left');
      }
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    });
    track.addEventListener('pointercancel', () => {
      dragging = false;
      if (cards[current]) cards[current].style.transform = '';
    });
  })();

  /* ---------- guestbook (leave a message · saved on this device) ---------- */
  (function guestbook() {
    const form = $('#gbForm'), thanks = $('#gbThanks'), toggle = $('#gbToggle'), list = $('#gbList');
    if (!form) return;
    const KEY = 'pratik_nisha_wishes';
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
    const write = (a) => { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} };
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    function render() {
      const items = read();
      if (!items.length) {
        list.innerHTML = `
          <p class="gb-empty l-en">No messages yet — be the first to bless the couple.</p>
          <p class="gb-empty l-ne">अहिलेसम्म कुनै सन्देश छैन — दम्पतीलाई शुभकामना दिने पहिलो बन्नुहोस्।</p>
        `;
        return;
      }
      list.innerHTML = items.slice().reverse().map((m) =>
        '<div class="gb-item"><div class="gb-name">' + esc(m.name) + '</div><div class="gb-text">&ldquo;' + esc(m.msg) + '&rdquo;</div></div>').join('');
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const msg = (fd.get('msg') || '').toString().trim();
      if (!name || !msg) return;
      const items = read(); items.push({ name: name, msg: msg, t: Date.now() }); write(items);
      form.reset(); form.hidden = true; thanks.hidden = false;
      if (!list.hidden) render();
    });
    toggle.addEventListener('click', () => {
      const show = list.hidden;
      list.hidden = !show;
      const isNe = document.body.classList.contains('lang-ne');
      if (show) {
        toggle.textContent = isNe ? 'सन्देशहरू लुकाउनुहोस्' : 'Hide Messages';
      } else {
        toggle.textContent = isNe ? 'सन्देशहरू हेर्नुहोस्' : 'See Messages';
      }
      if (show) render();
    });
  })();

  /* ---------- scroll reveal ---------- */
  let io;
  function revealOnScroll() {
    const items = $$('.reveal:not(.in)');
    if ('IntersectionObserver' in window) {
      if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      items.forEach((el) => io.observe(el));
    } else items.forEach((el) => el.classList.add('in'));
  }
  window.addEventListener('load', () => { if (opened) revealOnScroll(); });

  /* ---------- language switcher ---------- */
  function initLanguageToggle() {
    const switchContainer = $('.lang-switch-container');
    if (!switchContainer) return;
    const buttons = $$('.lang-btn', switchContainer);
    
    function setLanguage(lang) {
      const isNe = lang === 'ne';
      document.body.classList.toggle('lang-ne', isNe);
      
      // Update active button state
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
      
      // Update document title
      document.title = isNe ? "प्रतिक र निशा · १९.०८.२०८३" : "Pratik & Nisha · 19.08.2083";
      
      // Update guestbook input placeholders
      const nameInput = $('#gbNameInput');
      const msgInput = $('#gbMsgInput');
      if (nameInput) nameInput.placeholder = isNe ? "पूरा नाम" : "Full name";
      if (msgInput) msgInput.placeholder = isNe ? "दम्पतीका लागि शुभकामना लेख्नुहोस्..." : "Write a blessing for the couple…";
      
      // Update guestbook toggle button text
      const list = $('#gbList');
      const toggleBtn = $('#gbToggle');
      if (list && toggleBtn) {
        const isHidden = list.hidden;
        if (isHidden) {
          toggleBtn.textContent = isNe ? "सन्देशहरू हेर्नुहोस्" : "See Messages";
        } else {
          toggleBtn.textContent = isNe ? "सन्देशहरू लुकाउनुहोस्" : "Hide Messages";
        }
      }
      
      // Update countdown immediately
      if (typeof window.tickCountdowns === 'function') {
        window.tickCountdowns();
      }
    }
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }
})();
