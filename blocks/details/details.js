import { createOptimizedPicture } from '../../scripts/aem.js';
import decorateSocial from '../sociallinks/sociallinks.js';

/**
 * Converts block rows to list items
 * @param {HTMLElement} block - The details block element
 * @returns {HTMLUListElement} Unordered list of card items
 */
function convertToList(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    ul.append(li);
  });
  return ul;
}

/**
 * Classifies card divs as either image or body
 * @param {HTMLElement} li - List item element
 */
function classifyCardDivs(li) {
  [...li.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) {
      div.className = 'details-card-image';
    } else {
      div.className = 'details-card-body';
    }
  });
}

/**
 * Extracts social links from body and creates a social links section
 * @param {HTMLElement} li - List item element
 */
function extractSocialLinks(li) {
  const body = li.querySelector('.details-card-body');
  if (!body) return;

  const anchors = [...body.querySelectorAll('a')];
  if (!anchors.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'sociallinks';
  const inner = document.createElement('div');
  inner.className = 'sociallinks-inner';

  anchors.forEach((a) => {
    // Move anchor into inner wrapper; remove empty parent paragraphs
    inner.appendChild(a);
    const p = a.closest('p');
    if (p && p.textContent.trim() === '') p.remove();
  });

  wrapper.appendChild(inner);
  li.appendChild(wrapper);

  // Decorate the social links (inject icons, classes)
  try {
    decorateSocial(wrapper);
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * Optimizes all images in the list
 * @param {HTMLUListElement} ul - Unordered list element
 */
function optimizeImages(ul) {
  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    picture.replaceWith(optimized);
  });
}

/**
 * Decorates the details block
 * @param {HTMLElement} block - The details block element
 */
export default function decorate(block) {
  // Convert to list structure
  const ul = convertToList(block);

  // Process each list item
  [...ul.children].forEach((li) => {
    classifyCardDivs(li);
    extractSocialLinks(li);
  });

  // Optimize images
  optimizeImages(ul);

  block.replaceChildren(ul);
}
