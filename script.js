/* ═══════════════════════════════════════════════════════
   ARIHANT POKHARNA PORTFOLIO - MAIN SCRIPT
═══════════════════════════════════════════════════════ */
'use strict';

// ─── Custom cursor ────────────────────────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

(function animateTrail() {
  trailX += (mouseX - trailX) * 0.15;
  trailY += (mouseY - trailY) * 0.15;
  cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
  requestAnimationFrame(animateTrail);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--large'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--large'));
});

// ─── Navigation ───────────────────────────────────────────────────────────────
const nav     = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
const navLinks= document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  highlightNav();
}, { passive: true });

menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

function highlightNav() {
  const sections = ['home','about','skills','projects','contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav__link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ─── Typewriter effect ────────────────────────────────────────────────────────
const phrases = [
  'Computer Engineering Student',
  'C++ Programmer',
  'DSA Enthusiast',
  'Python Developer',
  'Web Developer',
  'Problem Solver'
];
let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeLoop() {
  const phrase = phrases[pi];
  if (deleting) {
    tw.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 500); return; }
    setTimeout(typeLoop, 50);
  } else {
    tw.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 90);
  }
}
setTimeout(typeLoop, 1000);

// ─── Hero canvas - particle/mesh background ───────────────────────────────────
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  // Use CSS particles fallback for wider support
  const pContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 50;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const hue  = [220, 180, 0, 280][Math.floor(Math.random() * 4)];
    p.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `left:${Math.random() * 100}%`,
      `background:hsl(${hue} 80% 65%)`,
      `animation-duration:${6 + Math.random() * 14}s`,
      `animation-delay:${-(Math.random() * 15)}s`
    ].join(';');
    pContainer.appendChild(p);
  }

  // Subtle canvas mesh overlay
  const ctx2d = document.createElement('canvas').getContext('2d');
  canvas.getContext && (canvas._ctx2d = ctx2d);
  canvas.style.opacity = '0.4';
  resize();

  const nodes = Array.from({length: 70}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
  }));

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });

  let raf2d;
  const c2 = canvas.getContext('2d');
  if (!c2) return;

  function drawMesh() {
    c2.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 180) {
          const alpha = (1 - dist/180) * 0.25;
          c2.strokeStyle = `rgba(108,99,255,${alpha})`;
          c2.lineWidth = 1;
          c2.beginPath(); c2.moveTo(a.x, a.y); c2.lineTo(b.x, b.y); c2.stroke();
        }
      });
      c2.beginPath();
      c2.arc(a.x, a.y, 1.5, 0, Math.PI * 2);
      c2.fillStyle = 'rgba(108,99,255,0.6)';
      c2.fill();
    });
    raf2d = requestAnimationFrame(drawMesh);
  }
  drawMesh();

  // Parallax on mouse
  window.addEventListener('mousemove', e => {
    const rx = (e.clientX / window.innerWidth  - .5) * 10;
    const ry = (e.clientY / window.innerHeight - .5) * 10;
    canvas.style.transform = `translate(${rx}px, ${ry}px)`;
  }, { passive: true });
})();

// ─── Code card parallax ──────────────────────────────────────────────────────
const codeCard = document.getElementById('code-card');
window.addEventListener('mousemove', e => {
  if (!codeCard) return;
  const rx = (e.clientX / window.innerWidth  - .5) * -15;
  const ry = (e.clientY / window.innerHeight - .5) *  10;
  codeCard.style.transform = `translateY(-50%) perspective(600px) rotateY(${-8+rx*.3}deg) rotateX(${3+ry*.3}deg)`;
}, { passive: true });

// ─── Intersection Observer - scroll reveal ───────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      if (entry.target.classList.contains('skill-card')) {
        // Progress bar animation triggered by in-view class
      }
      // Counter animation for stats
      entry.target.querySelectorAll('[data-target]').forEach(counter => {
        animateCounter(counter);
      });
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-animate], .skill-card, .project-card').forEach(el => {
  observer.observe(el);
});

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1500;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(t * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ─── Terminal git-log animation ──────────────────────────────────────────────
const GIT_LOG = [
  { hash: 'a3f9c12', date: '2026-08-07', msg: 'feat: add LOCKRANK password generator', lang: '[HTML]' },
  { hash: 'b1e7d45', date: '2026-07-27', msg: 'feat: add Fintrack finance tracker',    lang: '[PHP]'  },
  { hash: 'c8a2e91', date: '2026-07-17', msg: 'feat: add Motor-Hub car deals site',    lang: '[HTML]' },
  { hash: 'f4d6b03', date: '2026-03-01', msg: 'feat: add ATM system with OOP',         lang: '[C++]'  },
  { hash: 'e9c1a77', date: '2026-10-01', msg: 'feat: add Cartify e-commerce app',      lang: '[HTML]' },
];
const CMD_TEXT   = 'git log --oneline --graph';
const termCmd    = document.getElementById('term-cmd');
const termLog    = document.getElementById('term-log');
let termAnimated = false;

function runTerminalAnimation() {
  if (termAnimated) return;
  termAnimated = true;

  // Type the command
  let ci = 0;
  const typeInterval = setInterval(() => {
    if (termCmd) termCmd.textContent = CMD_TEXT.slice(0, ++ci);
    if (ci >= CMD_TEXT.length) {
      clearInterval(typeInterval);
      // After command typed, show log lines one by one
      GIT_LOG.forEach((entry, i) => {
        setTimeout(() => {
          if (!termLog) return;
          const line = document.createElement('div');
          line.className = 'term-log-line';
          line.style.animationDelay = '0s';
          line.innerHTML =
            `<span class="term-hash">${entry.hash}</span> ` +
            `<span class="term-date">(${entry.date})</span> ` +
            `<span class="term-msg">${entry.msg}</span> ` +
            `<span class="term-lang">${entry.lang}</span>`;
          termLog.appendChild(line);
        }, 200 + i * 220);
      });
    }
  }, 55);
}

// Trigger terminal animation when projects section enters view
const projSection = document.getElementById('projects');
if (projSection) {
  const termObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      runTerminalAnimation();
      termObs.disconnect();
    }
  }, { threshold: 0.2 });
  termObs.observe(projSection);
}

// ─── Project filter tabs ──────────────────────────────────────────────────────
document.querySelectorAll('.proj-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active tab
    document.querySelectorAll('.proj-filter').forEach(b => b.classList.remove('proj-filter--active'));
    btn.classList.add('proj-filter--active');

    // Show / hide cards
    document.querySelectorAll('.project-card').forEach(card => {
      const lang = card.dataset.lang || 'all';
      const show = filter === 'all' || lang === filter;
      card.classList.toggle('project-card--hidden', !show);
    });
  });
});


const PROJECT_URLS = {
  'project-lockrank':  'https://arihant-pokharna06.github.io/LOCKRANK/',
  'project-motorhub':  'https://arihant-pokharna06.github.io/Motor-Hub/',
  'project-atm':       'https://github.com/arihant-pokharna06/ATM',
  'project-fintrack':  'https://github.com/arihant-pokharna06/Fintrack',
  'project-cartify':   'https://github.com/arihant-pokharna06/Cartify',
};

document.querySelectorAll('.project-card').forEach(card => {
  const url = PROJECT_URLS[card.id];
  if (!url) return;

  // Make the card feel clickable
  card.style.cursor = 'pointer';

  card.addEventListener('click', e => {
    // Don't intercept clicks on the action buttons / links inside the card
    if (e.target.closest('.project-card__actions')) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  // Keyboard: Enter / Space also opens the card
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });

  // Show a subtle "click anywhere" tooltip via title
  card.setAttribute('title', 'Click to open project');
});

// ─── Contact form ────────────────────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';
  setTimeout(() => {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    success.removeAttribute('hidden');
    e.target.reset();
    setTimeout(() => success.setAttribute('hidden',''), 5000);
  }, 1200);
});

// ─── Smooth active nav on scroll ─────────────────────────────────────────────
window.addEventListener('scroll', () => highlightNav(), { passive: true });
highlightNav();
