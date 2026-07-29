// -----------------------------------------------------------------------------
// CUSTOM CURSOR
// -----------------------------------------------------------------------------
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  if (cursor) {
    cursor.style.left = (mx - 6) + 'px';
    cursor.style.top = (my - 6) + 'px';
  }
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (ring) {
    ring.style.left = (rx - 18) + 'px';
    ring.style.top = (ry - 18) + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-item').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    if (ring) {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = '#FF4655';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (ring) {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(255, 70, 85, 0.5)';
    }
  });
});

// -----------------------------------------------------------------------------
// NAVIGATION SCROLL STATE
// -----------------------------------------------------------------------------
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// -----------------------------------------------------------------------------
// HERO TYPEWRITER EFFECT
// -----------------------------------------------------------------------------
const termEl = document.getElementById('term-text');
if (termEl) {
  const phrases = [
    'cat portfolio.json',
    'git push origin main',
    'npm run design',
    'figma --open project.fig'
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function typewrite() {
    const cur = phrases[pIdx];
    if (!deleting) {
      termEl.textContent = cur.slice(0, ++cIdx);
      if (cIdx === cur.length) {
        deleting = true;
        setTimeout(typewrite, 1800);
        return;
      }
    } else {
      termEl.textContent = cur.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(typewrite, deleting ? 40 : 75);
  }
  typewrite();
}

// -----------------------------------------------------------------------------
// INTERSECTION OBSERVER - SCROLL REVEAL
// -----------------------------------------------------------------------------
const revEls = document.querySelectorAll('.reveal');
if (revEls.length > 0) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revEls.forEach((el) => obs.observe(el));
}

// -----------------------------------------------------------------------------
// INTERSECTION OBSERVER - STATS COUNTER
// -----------------------------------------------------------------------------
const counters = document.querySelectorAll('[data-count]');
if (counters.length > 0) {
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = target === 100 ? '%' : '+';
        let cur = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur + (cur === target ? suffix : '');
          if (cur >= target) clearInterval(timer);
        }, 35);
        cObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => cObs.observe(el));
}

// -----------------------------------------------------------------------------
// CONTACT FORM SUBMISSION HANDLER
// -----------------------------------------------------------------------------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    // If running from file:// protocol, allow standard form submission so browser navigates & submits
    if (window.location.protocol === 'file:') {
      const btn = document.getElementById('submit-btn');
      if (btn) {
        btn.textContent = 'Sending...';
      }
      return; // let HTML form submission proceed natively
    }

    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    if (btn) {
      btn.textContent = 'Sending...';
    }

    const formData = new FormData(contactForm);

    fetch('https://formsubmit.co/ajax/jeshoaldrichj@gmail.com', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (btn) {
          btn.textContent = 'Message Sent ✓';
          btn.style.background = '#28C840';
        }
        setTimeout(() => {
          if (btn) {
            btn.textContent = 'Send Message →';
            btn.style.background = '';
          }
          contactForm.reset();
        }, 3000);
      })
      .catch(error => {
        console.warn('AJAX submit failed, submitting standard form:', error);
        contactForm.submit();
      });
  });
}


