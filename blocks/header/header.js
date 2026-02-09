import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Collapses all nav sections
 * @param {Element} sections The container element
 */
function collapseAllNavSections(sections) {
  sections.querySelectorAll(':scope > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';

  // Toggle body class for mobile sidebar
  if (!isDesktop.matches) {
    if (expanded) {
      document.body.classList.remove('navPanel-visible');
    } else {
      document.body.classList.add('navPanel-visible');
    }
  }

  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections.querySelector(':scope .default-content-wrapper > ul'));
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = '<button type="button" aria-controls="nav" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Create mobile sidebar navigation
  const mobileNav = document.createElement('div');
  mobileNav.id = 'mobileNav';
  mobileNav.className = 'cmp-navigation--mobile';

  const mobileNavContent = document.createElement('nav');
  mobileNavContent.className = 'cmp-navigation';

  // Create mobile sidebar navigation
  if (navSections) {
    const navGroup = document.createElement('ul');
    navGroup.className = 'cmp-navigation__group';

    // Create navigation items - all at the same level
    const navItems = [
      { text: 'HOME', href: '/', active: true },
      { text: 'MAGAZINE', href: '/magazine', active: false },
      { text: 'ADVENTURES', href: '/adventures', active: false },
      { text: 'FAQS', href: '/faqs', active: false },
      { text: 'ABOUT US', href: '/about', active: false },
    ];
    navItems.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cmp-navigation__item cmp-navigation__item--level-0';
      if (item.active) {
        li.className += ' cmp-navigation__item--active';
      }

      const link = document.createElement('a');
      link.className = 'cmp-navigation__item-link';
      link.href = item.href;
      link.textContent = item.text;
      if (item.active) {
        link.setAttribute('aria-current', 'page');
      }

      li.appendChild(link);
      navGroup.appendChild(li);
    });

    mobileNavContent.appendChild(navGroup);
  }

  mobileNav.appendChild(mobileNavContent);
  document.body.appendChild(mobileNav);

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  // Create header-top div
  const headerTop = document.createElement('div');
  headerTop.className = 'header-top';

  // Create sign in button
  const signInButton = document.createElement('a');
  signInButton.href = '/modals/sign-in';
  signInButton.textContent = 'Sign In';
  signInButton.className = 'header-top-signin';

  // Create markets dropdown toggle button
  const marketsToggle = document.createElement('a');
  marketsToggle.id = 'langNavToggleHeader';
  marketsToggle.className = 'header-markets';
  marketsToggle.href = '#langNavToggle';
  marketsToggle.setAttribute('aria-label', 'Toggle Language en-US');
  marketsToggle.innerHTML = '<span class="icon icon-flags"></span>EN-US<span class="header-chevron-down"></span>';

  // Create language navigation dropdown
  const langNav = document.createElement('nav');
  langNav.id = 'languagenavigation-header';
  langNav.className = 'cmp-languagenavigation cmp-languagenavigation--header';
  langNav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.className = 'cmp-languagenavigation__group';

  // United States
  const usItem = document.createElement('li');
  usItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-US cmp-languagenavigation__item--level-0 cmp-languagenavigation__item--active';
  usItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="en-US">UNITED STATES</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1 cmp-languagenavigation__item--active">
        <a class="cmp-languagenavigation__item-link" href="/us/en.html" hreflang="en-US">EN-US</a>
      </li>
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/us/es.html" hreflang="es-US">ES-US</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(usItem);

  // Canada
  const caItem = document.createElement('li');
  caItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-CA cmp-languagenavigation__item--level-0';
  caItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="en-CA">CANADA</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/ca/en.html" hreflang="en-CA">EN-CA</a>
      </li>
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/ca/fr.html" hreflang="fr-CA">FR-CA</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(caItem);

  // Switzerland
  const chItem = document.createElement('li');
  chItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-CH cmp-languagenavigation__item--level-0';
  chItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="de-CH">SWITZERLAND</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/ch/de.html" hreflang="de-CH">DE-CH</a>
      </li>
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/ch/fr.html" hreflang="fr-CH">FR-CH</a>
      </li>
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/ch/it.html" hreflang="it-CH">IT-CH</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(chItem);

  // Germany
  const deItem = document.createElement('li');
  deItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-DE cmp-languagenavigation__item--level-0';
  deItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="de-DE">GERMANY</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/de/de.html" hreflang="de-DE">DE-DE</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(deItem);

  // France
  const frItem = document.createElement('li');
  frItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-FR cmp-languagenavigation__item--level-0';
  frItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="fr-FR">FRANCE</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/fr/fr.html" hreflang="fr-FR">FR-FR</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(frItem);

  // Spain
  const esItem = document.createElement('li');
  esItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-ES cmp-languagenavigation__item--level-0';
  esItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="es-ES">SPAIN</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/es/es.html" hreflang="es-ES">ES-ES</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(esItem);

  // Italy
  const itItem = document.createElement('li');
  itItem.className = 'cmp-languagenavigation__item cmp-languagenavigation__item--countrycode-IT cmp-languagenavigation__item--level-0';
  itItem.innerHTML = `
    <span class="cmp-languagenavigation__item-title" lang="it-IT">ITALY</span>
    <ul class="cmp-languagenavigation__group">
      <li class="cmp-languagenavigation__item cmp-languagenavigation__item--level-1">
        <a class="cmp-languagenavigation__item-link" href="/it/it.html" hreflang="it-IT">IT-IT</a>
      </li>
    </ul>
  `;
  navGroup.appendChild(itItem);

  langNav.appendChild(navGroup);

  // Toggle dropdown on click
  marketsToggle.addEventListener('click', (e) => {
    e.preventDefault();
    langNav.classList.toggle('showMenu');
    marketsToggle.classList.toggle('open');
    marketsToggle.setAttribute('aria-expanded', langNav.classList.contains('showMenu'));
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!marketsToggle.contains(e.target) && !langNav.contains(e.target)) {
      langNav.classList.remove('showMenu');
      marketsToggle.classList.remove('open');
      marketsToggle.setAttribute('aria-expanded', 'false');
    }
  });

  headerTop.append(signInButton);
  headerTop.append(marketsToggle);
  headerTop.append(langNav);
  decorateIcons(headerTop);

  block.append(headerTop);
  block.append(navWrapper);

  // Add scroll effect
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > 50) {
      document.body.classList.add('scrolly');
    } else {
      document.body.classList.remove('scrolly');
    }
  });

  // Add search functionality
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const searchLink = navTools.querySelector('a[href*="search"]');
    if (searchLink) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'search';

      const searchIcon = document.createElement('span');
      searchIcon.className = 'icon icon-search';

      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.placeholder = 'Search';
      searchInput.setAttribute('aria-label', 'Search');

      searchContainer.append(searchIcon);
      searchContainer.append(searchInput);

      searchLink.replaceWith(searchContainer);
      decorateIcons(searchContainer);

      // Handle search input
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          window.location.href = `/search?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
  }

  // Mark active navigation link based on current page path
  const currentPath = window.location.pathname;
  navSections.querySelectorAll('a.button').forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}
