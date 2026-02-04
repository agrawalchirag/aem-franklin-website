import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Separates text and image divs from a row
 * @param {Element} row - The row element to process
 * @returns {Object} Object containing textDiv and imageDiv
 */
function separateContentDivs(row) {
  let textDiv = null;
  let imageDiv = null;

  [...row.children].forEach((div) => {
    if (div.querySelector('picture')) {
      imageDiv = div;
    } else {
      textDiv = div;
    }
  });

  return { textDiv, imageDiv };
}

/**
 * Creates a members-only card with text and image sections
 * @param {Element} textDiv - The text content div
 * @param {Element} imageDiv - The image content div
 * @returns {Element} The card container element
 */
function createMembersCard(textDiv, imageDiv) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'members-only-card';

  // Add text content first
  if (textDiv) {
    textDiv.className = 'members-only-card-body';
    cardContainer.append(textDiv);
  }

  // Add image content
  if (imageDiv) {
    imageDiv.className = 'members-only-card-image';
    cardContainer.append(imageDiv);
  }

  return cardContainer;
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
 * Decorates the members-only block
 * @param {Element} block - The block element to decorate
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  // Process each row to create cards
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const { textDiv, imageDiv } = separateContentDivs(row);
    const cardContainer = createMembersCard(textDiv, imageDiv);
    li.append(cardContainer);
    ul.append(li);
  });

  // Optimize all images
  optimizeImages(ul);

  // Replace block content with the new structure
  block.replaceChildren(ul);
}
