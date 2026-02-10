const ICONS = {
  facebook: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
    </svg>
  `,
  twitter: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.68 4.68 0 0 0 2.048-2.578 9.37 9.37 0 0 1-2.965 1.133a4.66 4.66 0 0 0-7.93 4.248A13.23 13.23 0 0 1 1.671 3.149a4.66 4.66 0 0 0 1.443 6.213 4.64 4.64 0 0 1-2.112-.584v.06a4.66 4.66 0 0 0 3.737 4.566a4.67 4.67 0 0 1-2.104.08 4.66 4.66 0 0 0 4.35 3.234A9.34 9.34 0 0 1 .96 19.54a13.19 13.19 0 0 0 7.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21-.006-.423-.016-.634a10.01 10.01 0 0 0 2.46-2.548z"/>
    </svg>
  `,
  instagram: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  `,
};

/**
 * Injects social icons into anchor elements based on title attribute
 * @param {HTMLElement} li - List item containing social links
 */
function injectSocialIcons(li) {
  li.querySelectorAll('a[title]').forEach((a) => {
    const key = a.title.toLowerCase();
    if (ICONS[key]) {
      a.innerHTML = ICONS[key];
      a.classList.add('sociallinks-icon', `sociallinks-${key}`);
      a.setAttribute('aria-label', key);
    }
  });
}

/**
 * Converts block rows to list items with social icons
 * @param {HTMLElement} block - The sociallinks block element
 * @returns {HTMLUListElement} Unordered list of social links
 */
function convertToList(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    injectSocialIcons(li);
    ul.append(li);
  });

  return ul;
}

/**
 * Decorates the sociallinks block
 * @param {HTMLElement} block - The sociallinks block element
 */
export default function decorate(block) {
  const ul = convertToList(block);
  block.textContent = '';
  block.append(ul);
}
