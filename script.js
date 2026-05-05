/* ════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ════════════════════════════════════════════════════════════ */

/* ─── CUSTOM CURSOR ─────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth follower animation
(function animateFollower() {
  followerX += (mouseX - followerX) * 0.14;
  followerY += (mouseY - followerY) * 0.14;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

// Scale up follower on hoverable elements
document.querySelectorAll('a, button, .project-card, .social-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.width = '56px';
    follower.style.height = '56px';
    follower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.width = '32px';
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
        const fill = item.querySelector('.skill-fill');
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

const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name')?.toString().trim() || 'Friend';
    const email = data.get('email')?.toString().trim() || '';
    const subject = `New portfolio message from ${name}`;
    data.set('_replyto', email);
    data.set('_subject', subject);

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactMessage.textContent = `✅ Thanks, ${name}! Your message was sent to bineththarana@gmail.com.`;
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${data.get('company') || 'N/A'}`,
        `Role: ${data.get('role') || 'N/A'}`,
        `Message: ${data.get('message') || ''}`
      ].join('\n');
      const mailto = `mailto:bineththarana@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      contactMessage.textContent = `✅ Opening your email app to send the message to bineththarana@gmail.com.`;
    }

    setTimeout(() => { contactMessage.textContent = ''; }, 6000);
  });
}

/* ─── FOOTER YEAR ────────────────────────────────────────── */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear();

/* ─── ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
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
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth * 0.55;
    const h = rect.height || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  resize();

  const COLOR_A = new THREE.Color(0x4f8eff);
  const COLOR_B = new THREE.Color(0xff69b4);
  const COLOR_C = new THREE.Color(0x5aff8e);
  const COLOR_D = new THREE.Color(0xffc24f);
  const COLOR_E = new THREE.Color(0x8f62ff);

  const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: COLOR_A, wireframe: true, transparent: true, opacity: 0.18 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  const icoSolid = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.36, 1),
    new THREE.MeshBasicMaterial({ color: 0x050a19, transparent: true, opacity: 0.72 })
  );
  scene.add(icoSolid);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.2, 0.01, 8, 120),
    new THREE.MeshBasicMaterial({ color: COLOR_B, transparent: true, opacity: 0.35 })
  );
  ring.rotation.x = Math.PI / 2.1;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.008, 8, 120),
    new THREE.MeshBasicMaterial({ color: COLOR_C, transparent: true, opacity: 0.14 })
  );
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.z = Math.PI / 5;
  scene.add(ring2);

  const particleCount = 160;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.4 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    partGeo,
    new THREE.PointsMaterial({ color: COLOR_D, size: 0.04, transparent: true, opacity: 0.6 })
  );
  scene.add(particles);

  const accentRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.02, 16, 160),
    new THREE.MeshBasicMaterial({ color: COLOR_E, transparent: true, opacity: 0.22 })
  );
  accentRing.rotation.x = Math.PI / 2.4;
  accentRing.rotation.z = Math.PI / 6;
  scene.add(accentRing);

  let targetX = 0;
  let targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.9;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const hue = (t * 20) % 360;
    const dynamicColor = new THREE.Color(`hsl(${hue}, 85%, 60%)`);
    const secondaryColor = new THREE.Color(`hsl(${(hue + 70) % 360}, 82%, 62%)`);
    const tertiaryColor = new THREE.Color(`hsl(${(hue + 140) % 360}, 78%, 68%)`);

    ico.rotation.x = t * 0.16 + targetY * 0.5;
    ico.rotation.y = t * 0.2 + targetX * 0.55;
    icoSolid.rotation.copy(ico.rotation);

    ring.rotation.z = t * 0.1;
    ring2.rotation.y = t * 0.07;
    accentRing.rotation.z = t * -0.14;

    particles.rotation.y = t * 0.03;
    particles.rotation.x = targetY * 0.25;

    icoMat.color.copy(dynamicColor);
    icoMat.opacity = 0.14 + 0.06 * Math.sin(t * 0.9);
    ring.material.color.copy(secondaryColor);
    ring2.material.color.copy(tertiaryColor);
    accentRing.material.color.copy(dynamicColor);
    particles.material.color.copy(new THREE.Color(`hsl(${(hue + 210) % 360}, 78%, 70%)`));
    icoSolid.material.color.setHSL((hue / 360 + 0.55) % 1, 0.15, 0.10);

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
    W = c.width = window.innerWidth;
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
    ctx.fillStyle = '#4f8eff';
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