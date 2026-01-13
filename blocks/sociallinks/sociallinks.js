// Decorator for sociallinks block: replace text with SVG icons and improve accessibility
export default function decorate(block) {
  const svg = {
    facebook: '<svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.09 5.87 21.18 10.66 21.98v-6.99H8.26v-2.92h2.4V9.41c0-2.38 1.42-3.69 3.6-3.69 1.04 0 2.13.18 2.13.18v2.34h-1.2c-1.18 0-1.55.74-1.55 1.5v1.8h2.64l-.42 2.92h-2.22V22C18.13 21.18 22 17.09 22 12.07z"/></svg>',
    twitter: '<svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.27-1.1 1.53-1.9-.68.4-1.44.68-2.25.84A3.53 3.53 0 0016.1 4c-1.95 0-3.53 1.6-3.53 3.57 0 .28.03.55.09.81-2.94-.14-5.55-1.6-7.3-3.8-.3.5-.47 1.08-.47 1.7 0 1.17.6 2.2 1.52 2.8-.56-.02-1.08-.17-1.55-.42v.04c0 1.73 1.24 3.17 2.88 3.5-.3.08-.6.12-.92.12-.22 0-.44-.02-.65-.06.44 1.36 1.74 2.35 3.28 2.38A7.11 7.11 0 012 19.54 10.07 10.07 0 007.29 21c6.07 0 9.39-5.1 9.39-9.53v-.43c.65-.46 1.2-1.03 1.63-1.68-.6.26-1.24.44-1.9.52z"/></svg>',
    instagram: '<svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.1A4.9 4.9 0 1016.9 13 4.9 4.9 0 0012 8.1zM18.5 6.5a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z"/></svg>',
  };

  // find all anchor links inside the block (ensure `.button` class exists)
  block.querySelectorAll('a').forEach((a) => {
    if (!a.classList.contains('button')) a.classList.add('button');
    const title = (a.getAttribute('title') || a.textContent || '').trim().toLowerCase();
    let key = 'facebook';
    if (title.includes('insta')) key = 'instagram';
    else if (title.includes('twitter')) key = 'twitter';
    else if (title.includes('facebook')) key = 'facebook';

    // create icon wrapper and visually-hidden label for screen readers
    const labelText = a.textContent.trim() || a.getAttribute('title') || key;
    a.innerHTML = '';
    const iconSpan = document.createElement('span');
    iconSpan.className = `icon-wrapper ${key}`;
    iconSpan.innerHTML = svg[key] || svg.facebook;
    a.appendChild(iconSpan);

    const sr = document.createElement('span');
    sr.className = 'sr-only';
    // prefer visible button text for screen readers, fallback to capitalized key
    sr.textContent = labelText || key.charAt(0).toUpperCase() + key.slice(1);
    a.appendChild(sr);

    // accessibility and behaviour tweaks
    const href = a.getAttribute('href');
    if (!href || href === '#') {
      // use safe hash fallback and prevent navigation for placeholder links
      a.setAttribute('href', '#');
      a.setAttribute('role', 'button');
      a.addEventListener('click', (e) => e.preventDefault());
    } else {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
    a.setAttribute('aria-label', labelText);
  });
}
