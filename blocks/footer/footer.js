import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Restructure first section to match header layout
  const firstSection = footer.querySelector('.section:first-child .default-content-wrapper');
  if (firstSection) {
    const children = Array.from(firstSection.children);

    // Find logo (first p with image)
    const logoPara = children.find((p) => p.querySelector('img'));

    // Find all nav links (p.button-container with a.button)
    const navParas = children.filter((p) => p.classList.contains('button-container'));

    // Find search icon (p with .icon-search)
    const searchPara = children.find((p) => p.querySelector('.icon-search'));

    // Create wrapper structure
    const navGroup = document.createElement('div');
    navGroup.className = 'footer-nav-group';

    // Move nav links into group
    navParas.forEach((p) => {
      const link = p.querySelector('a.button');
      if (link) {
        link.classList.remove('button');
        navGroup.append(link);
      }
    });

    // Clear and rebuild structure: logo | nav-group | search
    firstSection.textContent = '';
    if (logoPara) firstSection.append(logoPara);
    if (navGroup.hasChildNodes()) firstSection.append(navGroup);
    if (searchPara) firstSection.append(searchPara);
  }

  block.append(footer);
}
