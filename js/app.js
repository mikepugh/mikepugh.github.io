/* ───────────────────────────────────────────────
   PowerTread SPA — Application Module
   Uses window.PTi18n (loaded before this script)
   ─────────────────────────────────────────────── */

(function () {
  'use strict';

  var i18n = window.PTi18n;
  var showcaseScrollHandler = null;

  /* ════════════════════════════════════════════════
     Routing
     ════════════════════════════════════════════════ */

  function getRoute() {
    var hash = location.hash.replace(/^#\/?/, '');
    if (hash === 'privacy') return 'privacy';
    if (hash === 'terms') return 'terms';
    return 'home';
  }

  /* ════════════════════════════════════════════════
     Shared Components
     ════════════════════════════════════════════════ */

  function renderHeader(s, route) {
    var locales = i18n.getLocales();
    var current = i18n.getLocale();
    var isHome = route === 'home';

    var navLinks = isHome
      ? '<button class="nav-link" data-scroll="features">' + s.nav.features + '</button>' +
        '<button class="nav-link" data-scroll="showcase">' + s.nav.gallery + '</button>' +
        '<button class="nav-link" data-scroll="compatibility">' + s.nav.compatibility + '</button>' +
        '<button class="nav-link" data-scroll="faq">' + s.nav.faq + '</button>'
      : '<a class="nav-link" href="#/">' + s.nav.home + '</a>' +
        '<a class="nav-link" href="#/privacy">' + s.nav.privacy + '</a>' +
        '<a class="nav-link" href="#/terms">' + s.nav.terms + '</a>';

    var statusText = isHome ? s.status : s.common.legal;

    var langOptions = '';
    for (var code in locales) {
      if (locales.hasOwnProperty(code)) {
        langOptions += '<button class="lang-option' + (code === current ? ' active' : '') + '" data-lang="' + code + '">' + locales[code] + '</button>';
      }
    }

    return '' +
      '<header class="site-header shell' + (isHome ? '' : ' shell--narrow') + '">' +
        '<div class="topbar">' +
          '<a class="brand" href="#/" aria-label="PowerTread Home">' +
            '<img src="latest-appicon.png" alt="PowerTread app icon" width="40" height="40">' +
            '<span>PowerTread</span>' +
          '</a>' +
          '<nav class="site-nav">' + navLinks + '</nav>' +
          '<div class="lang-switcher">' +
            '<button class="lang-btn" aria-label="Change language" aria-expanded="false">' +
              '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>' +
              locales[current] +
            '</button>' +
            '<div class="lang-menu">' + langOptions + '</div>' +
          '</div>' +
          '<div class="status-badge">' + statusText + '</div>' +
        '</div>' +
      '</header>';
  }

  function renderFooter(s, route) {
    var isHome = route === 'home';
    return '' +
      '<footer class="site-footer shell' + (isHome ? '' : ' shell--narrow') + '">' +
        '<p>' + s.footer.copyright + '</p>' +
        '<p>' +
          '<a href="#/privacy">' + s.nav.privacy + '</a>' +
          '<a href="#/terms">' + s.nav.terms + '</a>' +
        '</p>' +
      '</footer>';
  }

  /* ════════════════════════════════════════════════
     Page Renderers
     ════════════════════════════════════════════════ */

  function renderHome(s) {
    var features = '';
    for (var i = 0; i < s.features.items.length; i++) {
      var f = s.features.items[i];
      features +=
        '<article class="feature">' +
          '<span class="tag ' + f.tagColor + '">' + f.tag + '</span>' +
          '<h3>' + f.title + '</h3>' +
          '<p>' + f.description + '</p>' +
        '</article>';
    }

    /* Showcase — horizontal panels */
    var numPanels = s.showcase.steps.length;
    var panels = '';
    var dots = '';
    for (var j = 0; j < numPanels; j++) {
      var step = s.showcase.steps[j];
      panels +=
        '<div class="showcase-panel">' +
          '<div class="showcase-panel-inner">' +
            '<div class="showcase-panel-media">' +
              '<img src="' + step.image + '" alt="' + step.imageAlt + '">' +
            '</div>' +
            '<div class="showcase-panel-content">' +
              '<p class="section-kicker">' + step.kicker + '</p>' +
              '<h3>' + step.title + '</h3>' +
              '<p>' + step.description + '</p>' +
              '<figcaption>' + step.caption + '</figcaption>' +
            '</div>' +
          '</div>' +
        '</div>';
      dots += '<button class="showcase-dot' + (j === 0 ? ' active' : '') + '" data-panel="' + j + '" aria-label="Panel ' + (j + 1) + '"></button>';
    }

    var compatTreadmills = '', compatPower = '';
    for (var t = 0; t < s.compatibility.treadmills.items.length; t++) {
      compatTreadmills += '<li>' + s.compatibility.treadmills.items[t] + '</li>';
    }
    for (var p = 0; p < s.compatibility.powerMeters.items.length; p++) {
      compatPower += '<li>' + s.compatibility.powerMeters.items[p] + '</li>';
    }

    var faqItems = '';
    for (var q = 0; q < s.faq.items.length; q++) {
      faqItems +=
        '<details>' +
          '<summary>' + s.faq.items[q].question + '</summary>' +
          '<p class="faq-answer">' + s.faq.items[q].answer + '</p>' +
        '</details>';
    }

    var chips = '';
    for (var c = 0; c < s.hero.chips.length; c++) {
      chips += '<span class="chip">' + s.hero.chips[c] + '</span>';
    }

    return '' +
      '<main class="shell">' +
        '<section class="hero">' +
          '<article class="hero-card hero-copy">' +
            '<p class="eyebrow">' + s.hero.eyebrow + '</p>' +
            '<h1>' + s.hero.title + '</h1>' +
            '<p>' + s.hero.subtitle + '</p>' +
            '<div class="pill-row">' + chips + '</div>' +
            '<div class="hero-actions">' +
              '<button class="button primary" data-scroll="features">' + s.hero.primaryCta + '</button>' +
              '<button class="button" data-scroll="showcase">' + s.hero.secondaryCta + '</button>' +
            '</div>' +
          '</article>' +
          '<figure class="hero-card hero-shot">' +
            '<img src="screenshots/course-simulation.png" alt="PowerTread course simulation in-progress run view">' +
          '</figure>' +
        '</section>' +

        '<section id="features">' +
          '<div class="section-head">' +
            '<p class="section-kicker">' + s.features.kicker + '</p>' +
            '<h2 class="section-title">' + s.features.title + '</h2>' +
            '<p class="section-subtitle">' + s.features.subtitle + '</p>' +
          '</div>' +
          '<div class="feature-grid">' + features + '</div>' +
        '</section>' +
      '</main>' +

      '<section id="showcase" class="showcase-band" style="--showcase-panels:' + numPanels + '">' +
        '<div class="showcase-sticky">' +
          '<div class="showcase-track">' + panels + '</div>' +
          '<div class="showcase-dots">' + dots + '</div>' +
        '</div>' +
      '</section>' +

      '<main class="shell">' +
        '<section id="compatibility">' +
          '<div class="section-head">' +
            '<p class="section-kicker">' + s.compatibility.kicker + '</p>' +
            '<h2 class="section-title">' + s.compatibility.title + '</h2>' +
            '<p class="section-subtitle">' + s.compatibility.subtitle + '</p>' +
          '</div>' +
          '<div class="compat-grid">' +
            '<article class="compat-card">' +
              '<h3>' + s.compatibility.treadmills.title + '</h3>' +
              '<ul>' + compatTreadmills + '</ul>' +
            '</article>' +
            '<article class="compat-card">' +
              '<h3>' + s.compatibility.powerMeters.title + '</h3>' +
              '<ul>' + compatPower + '</ul>' +
            '</article>' +
          '</div>' +
        '</section>' +

        '<section id="safety">' +
          '<div class="section-head">' +
            '<p class="section-kicker">' + s.safety.kicker + '</p>' +
            '<h2 class="section-title">' + s.safety.title + '</h2>' +
          '</div>' +
          '<div class="safety-notice">' +
            '<p>' + s.safety.notice + '</p>' +
          '</div>' +
        '</section>' +

        '<section id="faq">' +
          '<div class="section-head">' +
            '<p class="section-kicker">' + s.faq.kicker + '</p>' +
            '<h2 class="section-title">' + s.faq.title + '</h2>' +
            '<p class="section-subtitle">' + s.faq.subtitle + '</p>' +
          '</div>' +
          '<div class="faq-list">' + faqItems + '</div>' +
        '</section>' +
      '</main>';
  }

  function renderLegalPage(data) {
    var sections = '';
    for (var i = 0; i < data.sections.length; i++) {
      var sec = data.sections[i];
      var paragraphs = '';
      if (sec.content) {
        for (var p = 0; p < sec.content.length; p++) {
          paragraphs += '<p>' + sec.content[p] + '</p>';
        }
      }
      var list = '';
      if (sec.list) {
        list = '<ul>';
        for (var li = 0; li < sec.list.length; li++) {
          list += '<li>' + sec.list[li] + '</li>';
        }
        list += '</ul>';
      }
      var heading = sec.title ? '<h2>' + sec.title + '</h2>' : '';
      sections += '<section class="legal-section">' + heading + paragraphs + list + '</section>';
    }

    return '' +
      '<main class="shell shell--narrow" style="padding: 1rem 0 3rem;">' +
        '<section class="legal-hero">' +
          '<p class="legal-kicker">' + (data.kicker || '') + '</p>' +
          '<h1>' + data.title + '</h1>' +
          '<p class="legal-meta">' + data.lastUpdated + '</p>' +
        '</section>' +
        '<div class="legal-grid">' +
          '<section class="legal-section"><p>' + data.intro + '</p></section>' +
          sections +
        '</div>' +
        '<div class="legal-footer">' +
          '<a class="back-link" href="#/">' + data.returnLabel + '</a>' +
        '</div>' +
      '</main>';
  }

  function renderPrivacy(s) {
    var data = {};
    for (var k in s.privacy) { if (s.privacy.hasOwnProperty(k)) data[k] = s.privacy[k]; }
    data.kicker = s.common.legal;
    data.returnLabel = s.common.returnToSite;
    return renderLegalPage(data);
  }

  function renderTerms(s) {
    var data = {};
    for (var k in s.terms) { if (s.terms.hasOwnProperty(k)) data[k] = s.terms[k]; }
    data.kicker = s.common.legal;
    data.returnLabel = s.common.returnToSite;
    return renderLegalPage(data);
  }

  /* ════════════════════════════════════════════════
     Render Pipeline
     ════════════════════════════════════════════════ */

  function render(s) {
    var route = getRoute();
    var pageHTML;

    switch (route) {
      case 'privacy': pageHTML = renderPrivacy(s); break;
      case 'terms':   pageHTML = renderTerms(s);   break;
      default:        pageHTML = renderHome(s);     break;
    }

    var app = document.getElementById('app');
    app.innerHTML =
      renderHeader(s, route) +
      '<div id="page">' + pageHTML + '</div>' +
      renderFooter(s, route);

    document.title = route === 'home'
      ? s.meta.title
      : 'PowerTread \u2014 ' + (route === 'privacy' ? s.privacy.title : s.terms.title);

    afterRender(route);
  }

  /* ════════════════════════════════════════════════
     Post-Render Setup
     ════════════════════════════════════════════════ */

  function afterRender(route) {
    window.scrollTo(0, 0);
    bindScrollButtons();
    bindLangSwitcher();
    teardownShowcase();

    if (route === 'home') {
      initShowcaseScroll();
    }
  }

  function bindScrollButtons() {
    var buttons = document.querySelectorAll('[data-scroll]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (e) {
        e.preventDefault();
        var id = this.getAttribute('data-scroll');
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function bindLangSwitcher() {
    var btn = document.querySelector('.lang-btn');
    var menu = document.querySelector('.lang-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    var options = menu.querySelectorAll('.lang-option');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', function () {
        var newStrings = i18n.setLocale(this.dataset.lang);
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        if (newStrings) render(newStrings);
      });
    }

    document.addEventListener('click', function closeMenu() {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', closeMenu);
    });
  }

  /* ════════════════════════════════════════════════
     Showcase — Horizontal scroll on vertical scroll
     ════════════════════════════════════════════════ */

  function teardownShowcase() {
    if (showcaseScrollHandler) {
      window.removeEventListener('scroll', showcaseScrollHandler);
      showcaseScrollHandler = null;
    }
  }

  function initShowcaseScroll() {
    var band = document.querySelector('.showcase-band');
    var track = document.querySelector('.showcase-track');
    var dots = document.querySelectorAll('.showcase-dot');
    if (!band || !track) return;

    var numPanels = track.children.length;
    if (numPanels < 2) return;

    var lastActivePanel = 0;

    function onScroll() {
      var rect = band.getBoundingClientRect();
      var scrollRange = band.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;

      // progress: 0 (just entered) → 1 (about to leave)
      var progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      // Map progress to horizontal translation
      var maxShift = (numPanels - 1) * window.innerWidth;
      var shift = progress * maxShift;
      track.style.transform = 'translateX(' + (-shift) + 'px)';

      // Update dots
      var activePanel = Math.round(progress * (numPanels - 1));
      if (activePanel !== lastActivePanel) {
        for (var d = 0; d < dots.length; d++) {
          dots[d].classList.toggle('active', d === activePanel);
        }
        lastActivePanel = activePanel;
      }
    }

    showcaseScrollHandler = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once immediately in case already scrolled
    onScroll();
  }

  /* ════════════════════════════════════════════════
     Bootstrap
     ════════════════════════════════════════════════ */

  var s = i18n.init();
  document.documentElement.lang = i18n.getLocale();
  render(s);

  window.addEventListener('hashchange', function () {
    render(i18n.getStrings());
  });
})();
