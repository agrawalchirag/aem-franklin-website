import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Classifies card div as image or body based on content
 * @param {Element} div - The div element to classify
 */
function classifyCardDiv(div) {
  if (div.children.length === 1 && div.querySelector('picture')) {
    div.className = 'cards-card-image';
  } else {
    div.className = 'cards-card-body';
  }
}

/**
 * Optimizes all images in the list
 * @param {Element} ul - The unordered list containing pictures
 */
function optimizeImages(ul) {
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPicture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPicture);
  });
}

/**
 * Decorates the cards block
 * @param {Element} block - The block element to decorate
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  // Convert rows to list items
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Move all children from row to list item
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    // Classify each div as image or body
    [...li.children].forEach((div) => {
      classifyCardDiv(div);
    });

    ul.append(li);
  });

  // Optimize all images
  optimizeImages(ul);

  // Replace block content with the new structure
  block.replaceChildren(ul);
}
