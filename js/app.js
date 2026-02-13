/* ───────────────────────────────────────────────
   PowerTread SPA — Application Module
   ─────────────────────────────────────────────── */

import { init, setLocale, getLocale, getStrings, getLocales } from './i18n.js';

let showcaseObserver = null;

/* ════════════════════════════════════════════════
   Routing
   ════════════════════════════════════════════════ */

function getRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash === 'privacy') return 'privacy';
  if (hash === 'terms') return 'terms';
  return 'home';
}

function navigate(route) {
  location.hash = route === 'home' ? '/' : `/${route}`;
}

/* ════════════════════════════════════════════════
   Shared Components
   ════════════════════════════════════════════════ */

function renderHeader(s, route) {
  const locales = getLocales();
  const current = getLocale();

  const isHome = route === 'home';

  const navLinks = isHome
    ? `<button class="nav-link" data-scroll="features">${s.nav.features}</button>
       <button class="nav-link" data-scroll="showcase">${s.nav.gallery}</button>
       <button class="nav-link" data-scroll="compatibility">${s.nav.compatibility}</button>
       <button class="nav-link" data-scroll="faq">${s.nav.faq}</button>`
    : `<a class="nav-link" href="#/">${s.nav.home}</a>
       <a class="nav-link" href="#/privacy">${s.nav.privacy}</a>
       <a class="nav-link" href="#/terms">${s.nav.terms}</a>`;

  const statusText = isHome ? s.status : s.common.legal;

  const langOptions = Object.entries(locales)
    .map(([code, name]) =>
      `<button class="lang-option${code === current ? ' active' : ''}" data-lang="${code}">${name}</button>`
    ).join('');

  return `
    <header class="site-header shell${isHome ? '' : ' shell--narrow'}">
      <div class="topbar">
        <a class="brand" href="#/" aria-label="PowerTread Home">
          <img src="latest-appicon.png" alt="PowerTread app icon" width="40" height="40">
          <span>PowerTread</span>
        </a>
        <nav class="site-nav">${navLinks}</nav>
        <div class="lang-switcher">
          <button class="lang-btn" aria-label="Change language" aria-expanded="false">
            <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
            ${locales[current]}
          </button>
          <div class="lang-menu">${langOptions}</div>
        </div>
        <div class="status-badge">${statusText}</div>
      </div>
    </header>`;
}

function renderFooter(s, route) {
  const isHome = route === 'home';
  return `
    <footer class="site-footer shell${isHome ? '' : ' shell--narrow'}">
      <p>${s.footer.copyright}</p>
      <p>
        <a href="#/privacy">${s.nav.privacy}</a>
        <a href="#/terms">${s.nav.terms}</a>
      </p>
    </footer>`;
}

/* ════════════════════════════════════════════════
   Page Renderers
   ════════════════════════════════════════════════ */

function renderHome(s) {
  const features = s.features.items.map(f => `
    <article class="feature">
      <span class="tag ${f.tagColor}">${f.tag}</span>
      <h3>${f.title}</h3>
      <p>${f.description}</p>
    </article>`).join('');

  const showcaseImages = s.showcase.steps.map((step, i) => `
    <figure class="showcase-image${i === 0 ? ' active' : ''}" data-image="${i + 1}">
      <img src="${step.image}" alt="${step.imageAlt}">
      <figcaption>${step.caption}</figcaption>
    </figure>`).join('');

  const showcaseSteps = s.showcase.steps.map((step, i) => `
    <article class="showcase-step${i === 0 ? ' active' : ''}" data-step="${i + 1}">
      <p class="section-kicker">${step.kicker}</p>
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    </article>`).join('');

  const carouselSlides = s.showcase.steps.map(step => `
    <article class="carousel-slide">
      <img src="${step.image}" alt="${step.imageAlt}">
      <p class="section-kicker">${step.kicker}</p>
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    </article>`).join('');

  const compatTreadmills = s.compatibility.treadmills.items
    .map(t => `<li>${t}</li>`).join('');

  const compatPower = s.compatibility.powerMeters.items
    .map(p => `<li>${p}</li>`).join('');

  const faqItems = s.faq.items.map(q => `
    <details>
      <summary>${q.question}</summary>
      <p class="faq-answer">${q.answer}</p>
    </details>`).join('');

  const chips = s.hero.chips.map(c => `<span class="chip">${c}</span>`).join('');

  return `
    <main class="shell">
      <section class="hero">
        <article class="hero-card hero-copy">
          <p class="eyebrow">${s.hero.eyebrow}</p>
          <h1>${s.hero.title}</h1>
          <p>${s.hero.subtitle}</p>
          <div class="pill-row">${chips}</div>
          <div class="hero-actions">
            <button class="button primary" data-scroll="features">${s.hero.primaryCta}</button>
            <button class="button" data-scroll="showcase">${s.hero.secondaryCta}</button>
          </div>
        </article>
        <figure class="hero-card hero-shot">
          <img src="screenshots/course-simulation.png" alt="PowerTread course simulation in-progress run view">
        </figure>
      </section>

      <section id="features">
        <div class="section-head">
          <p class="section-kicker">${s.features.kicker}</p>
          <h2 class="section-title">${s.features.title}</h2>
          <p class="section-subtitle">${s.features.subtitle}</p>
        </div>
        <div class="feature-grid">${features}</div>
      </section>

      <section id="showcase" class="showcase-band">
        <div class="showcase-wrap">
          <div class="showcase-media" aria-live="polite">${showcaseImages}</div>
          <div class="showcase-steps">${showcaseSteps}</div>
        </div>
        <div class="showcase-carousel" aria-label="PowerTread feature gallery">
          <div class="carousel-track">${carouselSlides}</div>
        </div>
      </section>

      <section id="compatibility">
        <div class="section-head">
          <p class="section-kicker">${s.compatibility.kicker}</p>
          <h2 class="section-title">${s.compatibility.title}</h2>
          <p class="section-subtitle">${s.compatibility.subtitle}</p>
        </div>
        <div class="compat-grid">
          <article class="compat-card">
            <h3>${s.compatibility.treadmills.title}</h3>
            <ul>${compatTreadmills}</ul>
          </article>
          <article class="compat-card">
            <h3>${s.compatibility.powerMeters.title}</h3>
            <ul>${compatPower}</ul>
          </article>
        </div>
      </section>

      <section id="safety">
        <div class="section-head">
          <p class="section-kicker">${s.safety.kicker}</p>
          <h2 class="section-title">${s.safety.title}</h2>
        </div>
        <div class="safety-notice">
          <p>${s.safety.notice}</p>
        </div>
      </section>

      <section id="faq">
        <div class="section-head">
          <p class="section-kicker">${s.faq.kicker}</p>
          <h2 class="section-title">${s.faq.title}</h2>
          <p class="section-subtitle">${s.faq.subtitle}</p>
        </div>
        <div class="faq-list">${faqItems}</div>
      </section>
    </main>`;
}

function renderLegalPage(data) {
  const sections = data.sections.map(sec => {
    const paragraphs = (sec.content || [])
      .map(p => `<p>${p}</p>`).join('');

    const list = sec.list
      ? `<ul>${sec.list.map(li => `<li>${li}</li>`).join('')}</ul>`
      : '';

    const heading = sec.title ? `<h2>${sec.title}</h2>` : '';

    return `
      <section class="legal-section">
        ${heading}${paragraphs}${list}
      </section>`;
  }).join('');

  return `
    <main class="shell shell--narrow" style="padding: 1rem 0 3rem;">
      <section class="legal-hero">
        <p class="legal-kicker">${data.kicker || ''}</p>
        <h1>${data.title}</h1>
        <p class="legal-meta">${data.lastUpdated}</p>
      </section>
      <div class="legal-grid">
        <section class="legal-section"><p>${data.intro}</p></section>
        ${sections}
      </div>
      <div class="legal-footer">
        <a class="back-link" href="#/">${data.returnLabel}</a>
      </div>
    </main>`;
}

function renderPrivacy(s) {
  return renderLegalPage({
    ...s.privacy,
    kicker: s.common.legal,
    returnLabel: s.common.returnToSite
  });
}

function renderTerms(s) {
  return renderLegalPage({
    ...s.terms,
    kicker: s.common.legal,
    returnLabel: s.common.returnToSite
  });
}

/* ════════════════════════════════════════════════
   Render Pipeline
   ════════════════════════════════════════════════ */

function render(s) {
  const route = getRoute();
  let pageHTML;

  switch (route) {
    case 'privacy': pageHTML = renderPrivacy(s); break;
    case 'terms':   pageHTML = renderTerms(s);   break;
    default:        pageHTML = renderHome(s);     break;
  }

  const app = document.getElementById('app');
  app.innerHTML =
    renderHeader(s, route) +
    `<div id="page">${pageHTML}</div>` +
    renderFooter(s, route);

  document.title = route === 'home'
    ? s.meta.title
    : `PowerTread — ${route === 'privacy' ? s.privacy.title : s.terms.title}`;

  afterRender(route);
}

/* ════════════════════════════════════════════════
   Post-Render Setup
   ════════════════════════════════════════════════ */

function afterRender(route) {
  window.scrollTo(0, 0);
  bindScrollButtons();
  bindLangSwitcher();

  // Tear down previous observer
  if (showcaseObserver) {
    showcaseObserver.disconnect();
    showcaseObserver = null;
  }

  if (route === 'home') {
    initShowcaseObserver();
  }
}

function bindScrollButtons() {
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.getAttribute('data-scroll');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function bindLangSwitcher() {
  const btn = document.querySelector('.lang-btn');
  const menu = document.querySelector('.lang-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      setLocale(opt.dataset.lang);
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }, { once: true });
}

function initShowcaseObserver() {
  if (window.matchMedia('(max-width: 1220px)').matches) return;

  const steps = document.querySelectorAll('.showcase-step');
  const images = document.querySelectorAll('.showcase-image');
  if (!steps.length || !images.length) return;

  function setActive(id) {
    steps.forEach(step => {
      step.classList.toggle('active', step.dataset.step === id);
    });
    images.forEach(img => {
      img.classList.toggle('active', img.dataset.image === id);
    });
  }

  showcaseObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      setActive(entry.target.dataset.step);
    });
  }, {
    root: null,
    threshold: 0.55,
    rootMargin: '-8% 0px -20% 0px'
  });

  steps.forEach(step => showcaseObserver.observe(step));
}

/* ════════════════════════════════════════════════
   Bootstrap
   ════════════════════════════════════════════════ */

async function boot() {
  const s = await init(updatedStrings => {
    // Re-render when locale changes
    render(updatedStrings);
  });

  document.documentElement.lang = getLocale();
  render(s);

  window.addEventListener('hashchange', () => render(getStrings()));
}

boot();
