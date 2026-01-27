import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Find text content and image divs
    let textDiv = null;
    let imageDiv = null;

    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        imageDiv = div;
      } else {
        textDiv = div;
      }
    });

    // Create card container
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

    li.append(cardContainer);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
