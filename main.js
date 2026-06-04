/* ============================================================
   main.js  —  GSAP-powered resume animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── UTILS ── */
const q  = (s, ctx) => (ctx || document).querySelector(s);
const qq = (s, ctx) => [...(ctx || document).querySelectorAll(s)];

/* ── 1. LOADER ── */
function initLoader() {
  const loader = q('#loader');
  if (!loader) return;

  gsap.to(loader, {
    opacity: 0,
    duration: 0.6,
    delay: 1.8,
    ease: 'power2.inOut',
    onComplete: () => {
      loader.style.display = 'none';
      initHeroAnim();
    }
  });
}

/* ── 2. CUSTOM CURSOR ── */
function initCursor() {
  const dot  = q('#cursor-dot');
  const ring = q('#cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });

  // ring follows with lag
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  // hover states
  const interactives = 'a, button, .skill-card, .exp-card, .contact-card, .edu-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      dot.classList.add('hover');
      ring.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    }
  });

  // dark section cursor
  const darkSections = qq('.section-dark, .about-strip, footer');
  darkSections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => { dot.classList.add('dark-section'); ring.classList.add('dark-section'); },
      onLeave: () => { dot.classList.remove('dark-section'); ring.classList.remove('dark-section'); },
      onEnterBack: () => { dot.classList.add('dark-section'); ring.classList.add('dark-section'); },
      onLeaveBack: () => { dot.classList.remove('dark-section'); ring.classList.remove('dark-section'); }
    });
  });
}

/* ── 3. NAV ── */
function initNav() {
  const nav = q('#nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -68px',
    onUpdate: self => nav.classList.toggle('scrolled', self.progress > 0)
  });

  // mobile menu
  const btn  = q('#menuBtn');
  const menu = q('#mobileMenu');
  const links = qq('.mobile-link');

  if (!btn || !menu) return;

  let open = false;

  btn.addEventListener('click', () => {
    open = !open;
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      gsap.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.07,
        delay: 0.35,
        ease: 'power3.out'
      });
    } else {
      gsap.to(links, { opacity: 0, y: '100%', duration: 0.2, stagger: 0.03 });
    }
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      open = false;
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── 4. HERO ANIMATIONS ── */
function initHeroAnim() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // tag
  tl.to(q('.hero-tag'), { opacity: 1, y: 0, duration: 0.7 }, 0);

  // name lines stagger
  tl.to(qq('.name-line'), {
    y: 0,
    opacity: 1,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power4.out'
  }, 0.15);

  // sub items
  tl.to(q('.hero-sub'),     { opacity: 1, y: 0, duration: 0.7 }, 0.55);
  tl.to(q('.hero-desc'),    { opacity: 1, y: 0, duration: 0.7 }, 0.7);
  tl.to(q('.hero-actions'), { opacity: 1, y: 0, duration: 0.7 }, 0.85);

  // photo
  tl.to(q('.hero-right'), {
    opacity: 1,
    duration: 1.0,
    ease: 'power3.out'
  }, 0.3);

  // float tag
  tl.to(q('.hero-float-tag'), { opacity: 1, y: 0, duration: 0.6 }, 0.9);
}

/* ── 5. PHOTO 3D TILT ── */
function initPhotoTilt() {
  const wrap = q('#photoWrap');
  if (!wrap) return;

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    gsap.to(wrap, {
      rotateY: x * 14,
      rotateX: -y * 10,
      transformPerspective: 700,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  wrap.addEventListener('mouseleave', () => {
    gsap.to(wrap, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}

/* ── 6. MAGNETIC BUTTONS ── */
function initMagnetic() {
  qq('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.25;
      const y = (e.clientY - r.top  - r.height / 2) * 0.25;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ── 7. SCROLL ANIMATIONS ── */
function initScrollAnims() {

  // ── About strip numbers count-up
  qq('.strip-stat').forEach((el, i) => {
    const num = el.querySelector('.strip-num');
    const end = parseFloat(num.textContent);
    const hasPlus = num.textContent.includes('+');
    const isDecimal = num.textContent.includes('.');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out' }
        );
        if (!isNaN(end)) {
          gsap.fromTo({ val: 0 }, { val: end }, {
            val: end,
            duration: 1.4,
            delay: i * 0.1 + 0.2,
            ease: 'power2.out',
            onUpdate() {
              const v = isDecimal
                ? this.targets()[0].val.toFixed(2)
                : Math.floor(this.targets()[0].val);
              num.textContent = v + (hasPlus ? '+' : '');
            }
          });
        }
      }
    });
  });

  // ── Section heads
  qq('.section-head').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    });
  });

  // ── Experience items
  qq('.exp-item').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
        el.classList.add('in-view');
      }
    });
  });

  // ── Skill cards
  qq('.skill-card').forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, delay, ease: 'back.out(1.5)' }
        );
        // animate bar
        const fill = el.querySelector('.skill-fill');
        if (fill) {
          gsap.to(fill, {
            width: fill.dataset.w + '%',
            duration: 1.2,
            delay: delay + 0.3,
            ease: 'power2.out'
          });
        }
      }
    });
  });

  // ── Language bars
  ScrollTrigger.create({
    trigger: '.lang-wrap',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.lang-wrap',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
      );
      qq('.lang-fill').forEach((bar, i) => {
        gsap.to(bar, {
          width: bar.dataset.w + '%',
          duration: 1.4,
          delay: i * 0.2 + 0.4,
          ease: 'power2.out'
        });
      });
    }
  });

  // ── Education cards
  qq('.edu-card').forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, delay, ease: 'power3.out' }
        );
      }
    });
  });

  // ── Achievements
  ScrollTrigger.create({
    trigger: '.achieve-wrap',
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.achieve-wrap',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      );
    }
  });

  // ── Contact cards
  qq('.contact-card').forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || 0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.6, delay, ease: 'power3.out' }
        );
      }
    });
  });

  // ── Contact quote
  ScrollTrigger.create({
    trigger: '.contact-quote',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.contact-quote',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
      );
    }
  });

  // ── Hero background parallax
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: self => {
      gsap.set('.hero-bg-text', { y: self.progress * 120 });
      gsap.set('.hero-grid',    { y: self.progress * 60 });
    }
  });
}

/* ── 8. HORIZONTAL MARQUEE (experience section background) ── */
function initHeroBgAnim() {
  // subtle floating words in hero bg - already handled by CSS
}

/* ── 9. PAGE TRANSITION LINKS ── */
function initSmoothLinks() {
  qq('.nav-links a, .mobile-link').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const target = q(href);
      if (!target) return;
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 68 },
        duration: 1.0,
        ease: 'power3.inOut'
      });
    });
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initPhotoTilt();
  initMagnetic();
  initScrollAnims();
});
