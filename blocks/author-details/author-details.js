/**
 * Checks if a div contains social links
 * @param {Element} div - The div element to check
 * @returns {boolean} True if div contains links with title attributes
 */
function hasSocialLinks(div) {
  return div && div.querySelector('a[title]');
}

/**
 * Removes the social links section from author details
 * @param {Element} block - The author details block element
 */
function removeSocialLinksSection(block) {
  const socialLinksDiv = block.querySelector('div:last-child');
  if (hasSocialLinks(socialLinksDiv)) {
    socialLinksDiv.remove();
  }
}

/**
 * Decorates the author details block
 * @param {Element} block - The block element to decorate
 */
export default function decorate(block) {
  removeSocialLinksSection(block);
}
