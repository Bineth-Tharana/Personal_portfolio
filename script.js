/* ════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ════════════════════════════════════════════════════════════ */

/* ─── CUSTOM CURSOR ─────────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower animation
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.14;
  followerY += (mouseY - followerY) * 0.14;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// Scale up follower on hoverable elements
document.querySelectorAll('a, button, .project-card, .social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.width  = '56px';
    follower.style.height = '56px';
    follower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.width  = '32px';
    follower.style.height = '32px';
    follower.style.opacity = '1';
  });
});

/* ─── STICKY NAV ─────────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
// Add .reveal to sections automatically
document.querySelectorAll(
  '.about-grid, .skills-grid, .projects-grid, .contact-inner, .section-title, .section-label, .about-facts, .fact'
).forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered reveal
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── SKILL BAR ANIMATION ────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item').forEach(item => {
        const level = item.getAttribute('data-level') || '50';
        const fill  = item.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => {
            fill.style.width = level + '%';
          }, 200);
        }
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ─── SMOOTH NAV SCROLL ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── FOOTER YEAR ────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear();

/* ─── ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ─── HERO PARALLAX ──────────────────────────────────────── */
const heroGrid = document.querySelector('.hero-grid-overlay');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroGrid.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
}

/* ─── THREE.JS 3D SCENE ──────────────────────────────────── */
(function initThree() {
  window.addEventListener('load', function initThree() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;
  });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  /* — Resize handler — */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.offsetWidth || window.innerWidth * 0.55;
    const h = rect.height || canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  // Defer so browser has painted and canvas has real dimensions
  requestAnimationFrame(resize);

  /* — Accent color — */
  const ACCENT = 0x7c9eff;
  const WHITE  = 0xa0c0ff;

  /* — Central glowing wireframe icosahedron — */
  const icoGeo  = new THREE.IcosahedronGeometry(1.4, 1);
  const icoMat  = new THREE.MeshBasicMaterial({
    color: ACCENT, wireframe: true, transparent: true, opacity: 0.18
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  /* — Inner solid icosahedron (subtle fill) — */
  const icoSolidMat = new THREE.MeshBasicMaterial({
    color: 0x0c0c0c, transparent: true, opacity: 0.7
  });
  const icoSolid = new THREE.Mesh(new THREE.IcosahedronGeometry(1.38, 1), icoSolidMat);
  scene.add(icoSolid);

  /* — Orbiting ring — */
  const ringGeo = new THREE.TorusGeometry(2.1, 0.012, 8, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.2;
  scene.add(ring);

  /* — Second tilted ring — */
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.007, 8, 120),
    new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.08 })
  );
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.z = Math.PI / 5;
  scene.add(ring2);

  /* — Floating particle dots — */
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r     = 2.2 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const partMat = new THREE.PointsMaterial({
    color: ACCENT, size: 0.03, transparent: true, opacity: 0.6
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  /* — Mouse parallax — */
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  /* — Animation loop — */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    ico.rotation.x      = t * 0.18 + targetY * 0.6;
    ico.rotation.y      = t * 0.24 + targetX * 0.6;
    icoSolid.rotation.x = ico.rotation.x;
    icoSolid.rotation.y = ico.rotation.y;

    ring.rotation.z  = t * 0.12;
    ring2.rotation.y = t * 0.08;

    particles.rotation.y = t * 0.04;
    particles.rotation.x = targetY * 0.3;

    /* subtle breathe on opacity */
    icoMat.opacity = 0.13 + 0.07 * Math.sin(t * 0.9);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ─── SUBTLE BACKGROUND PARTICLE FIELD ───────────────────── */
(function bgField() {
  const c = document.getElementById('bgCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, dots = [];

  function setup() {
    W = c.width  = window.innerWidth;
    H = c.height = window.innerHeight;
    dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#7c9eff';
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', setup);
  setup(); draw();
})();