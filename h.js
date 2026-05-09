/* ============================================
   AHMED MAKREROUGRASS — PORTFOLIO
   h.js — Dynamic Enhancements
   ============================================ */

(() => {
  'use strict';

  /* ─── DOM INJECTION: Hero, Ambient, Marquee, Footer ─── */
  function buildLayout() {
    const body = document.body;

    // Ambient blobs
    const a1 = el('div', { class: 'ambient ambient-1' });
    const a2 = el('div', { class: 'ambient ambient-2' });
    body.prepend(a2, a1);

    // Custom cursor elements
    const cursor   = el('div', { class: 'cursor', id: 'cursor' });
    const follower = el('div', { class: 'cursor-follower', id: 'cursorFollower' });
    body.prepend(follower, cursor);

    // Build hero section around existing name/img/subtitle
    const nameH1     = body.querySelector('body > h1:first-of-type');
    const subtitleP  = body.querySelector('body > p:first-of-type');
    const profileImg = body.querySelector('body > img:first-of-type');
    const navUl      = body.querySelector('.me');

    const hero = el('div', { class: 'hero' });
    const tag  = el('div', { class: 'hero-tag', text: '// Available for freelance' });

    // Name split
    const nameParts = (nameH1?.textContent || 'Ahmed Makrerougrass').trim().split(' ');
    const heroName  = el('div', { class: 'hero-name' });
    heroName.innerHTML = `<span class="line-1">${nameParts[0] || ''}</span><span class="line-2">${nameParts.slice(1).join(' ')}</span>`;

    const heroSub = el('p', { class: 'hero-subtitle' });
    heroSub.innerHTML = subtitleP
      ? subtitleP.textContent.replace(/html|css|javascript/gi, s => `<span>${s}</span>`)
      : 'Computer Science Student &amp; <span>Front-End Developer</span>';

    hero.append(tag, heroName);
    if (profileImg) hero.append(profileImg);
    hero.append(heroSub);
    if (navUl) hero.append(navUl);

    // Insert hero before first section h1
    const firstH1 = body.querySelector('h1[id]');
    body.insertBefore(hero, firstH1);

    // Remove original h1 and subtitle p (now hidden via CSS, remove for cleanliness)
    if (nameH1) nameH1.remove();
    if (subtitleP) subtitleP.remove();

    // Wrap skills
    const skillNodes = [...body.querySelectorAll('.skill-tag')];
    if (skillNodes.length) {
      const wrap = el('div', { class: 'skill-tags-wrap' });
      skillNodes[0].parentNode.insertBefore(wrap, skillNodes[0]);
      skillNodes.forEach(s => wrap.appendChild(s));
    }

    // Marquee
    const marqueeItems = [
      ['HTML5', true], ['CSS3', false], ['JavaScript', true], ['Responsive Design', false],
      ['Web Dev', true], ['UI/UX', false], ['Freelance', true], ['Oran, Algeria', false],
    ];
    const mWrap  = el('div', { class: 'marquee-wrap' });
    const mInner = el('div', { class: 'marquee-inner' });
    // Double for infinite scroll
    for (let r = 0; r < 2; r++) {
      marqueeItems.forEach(([text, accent]) => {
        const s = el('span', { class: accent ? 'accent' : '', text: `✦ ${text}` });
        mInner.append(s);
      });
    }
    mWrap.append(mInner);

    // Insert marquee before #projects
    const projectsH1 = body.querySelector('#projects');
    if (projectsH1) body.insertBefore(mWrap, projectsH1);

    // Footer bar
    const footer = el('div', { class: 'footer-bar' });
    footer.innerHTML = `
      <span><span class="blink"></span>Ahmed Makrerougrass — ${new Date().getFullYear()}</span>
      <span>Oran, Algeria</span>
      <span>Built with HTML · CSS · JS</span>
    `;
    body.append(footer);
  }

  /* ─── CURSOR ─── */
  function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let fx = 0, fy = 0;
    let cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    function trackFollower() {
      fx += (cx - fx) * 0.1;
      fy += (cy - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(trackFollower);
    }
    trackFollower();

    // Hover state on interactive elements
    const hoverEls = document.querySelectorAll('a, button, .skill-tag, .services li');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    document.addEventListener('mouseleave', () => { follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { follower.style.opacity = '0.5'; });
  }

  /* ─── SMOOTH SCROLL ─── */
  function initSmoothScroll() {
    document.querySelectorAll('.me a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ─── SCROLL REVEAL ─── */
  function initReveal() {
    const targets = document.querySelectorAll(
      '.project-card, .services li, h1[id], #about + p, .skill-tag, #work-with-me + p, #contact + p, #contact + p + p, body > a[href*="facebook"], body > a[href*="instagram"]'
    );

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 0.06}s`;
      obs.observe(el);
    });
  }

  /* ─── ACTIVE NAV ─── */
  function initActiveNav() {
    const sections = document.querySelectorAll('h1[id]');
    const navLinks = document.querySelectorAll('.me a');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${id}`;
            link.style.color = active ? 'var(--lime)' : '';
            link.style.borderColor = active ? 'var(--lime)' : '';
            link.style.background = active ? 'rgba(200,240,74,0.06)' : '';
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => obs.observe(s));
  }

  /* ─── GLITCH EFFECT on section titles ─── */
  function initGlitch() {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    document.querySelectorAll('h1[id]').forEach(header => {
      const original = header.textContent.trim();
      let animating = false;
      header.addEventListener('mouseenter', () => {
        if (animating) return;
        animating = true;
        let iter = 0;
        const interval = setInterval(() => {
          header.textContent = original.split('').map((ch, idx) => {
            if (idx < iter) return original[idx];
            if (ch === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('');
          iter += 0.4;
          if (iter >= original.length) {
            clearInterval(interval);
            header.textContent = original;
            animating = false;
          }
        }, 28);
      });
    });
  }

  /* ─── BUTTON RIPPLE ─── */
  function initRipple() {
    document.querySelectorAll('.button').forEach(btn => {
      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top  - size / 2;
        const ripple = document.createElement('span');
        Object.assign(ripple.style, {
          position: 'absolute',
          width: size + 'px', height: size + 'px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          left: x + 'px', top: y + 'px',
          transform: 'scale(0)',
          animation: 'rippleAnim 0.55s ease-out forwards',
          pointerEvents: 'none',
        });
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.append(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    const rs = document.createElement('style');
    rs.textContent = `@keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }`;
    document.head.append(rs);
  }

  /* ─── TYPING cursor in hero tag ─── */
  function initTypingTag() {
    const tag = document.querySelector('.hero-tag');
    if (!tag) return;
    const text = tag.textContent;
    tag.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        tag.textContent += text[i++];
        setTimeout(type, 55);
      }
    };
    setTimeout(type, 400);
  }

  /* ─── AMBIENT PARALLAX ─── */
  function initParallax() {
    const a1 = document.querySelector('.ambient-1');
    const a2 = document.querySelector('.ambient-2');
    if (!a1 || !a2) return;
    document.addEventListener('mousemove', e => {
      const rx = (e.clientX / window.innerWidth  - 0.5) * 40;
      const ry = (e.clientY / window.innerHeight - 0.5) * 40;
      a1.style.transform = `translate(${rx}px, ${ry}px)`;
      a2.style.transform = `translate(${-rx}px, ${-ry}px)`;
    });
  }

  /* ─── PAGE LOAD FADE ─── */
  function initLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.7s ease';
    window.addEventListener('load', () => {
      setTimeout(() => { document.body.style.opacity = '1'; }, 80);
    });
  }

  /* ─── SKILL TAG stagger ─── */
  function initSkillStagger() {
    const tags = document.querySelectorAll('.skill-tag');
    tags.forEach((t, i) => {
      t.style.transitionDelay = `${i * 0.07}s`;
    });
  }

  /* ─── PROJECT CARD tilt ─── */
  function initCardTilt() {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
        const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.01)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─── UTILITY ─── */
  function el(tag, { class: cls = '', text = '', id = '' } = {}) {
    const node = document.createElement(tag);
    if (cls)  cls.split(' ').filter(Boolean).forEach(c => node.classList.add(c));
    if (text) node.textContent = text;
    if (id)   node.id = id;
    return node;
  }

  /* ─── INIT ─── */
  function init() {
    buildLayout();
    initCursor();
    initSmoothScroll();
    initReveal();
    initActiveNav();
    initGlitch();
    initRipple();
    initTypingTag();
    initParallax();
    initSkillStagger();
    initCardTilt();
    initLoad();

    console.log('%c⚡ Portfolio — Ahmed Makrerougrass', 'color:#c8f04a;font-family:monospace;font-size:14px;font-weight:bold;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();