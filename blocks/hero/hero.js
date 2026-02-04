/**
 * Extracts the background picture and appends it to the block
 * @param {HTMLElement} block - The hero block element
 * @param {HTMLElement} row - The first row element containing the picture
 * @returns {HTMLElement|null} The background picture element
 */
function extractAndAppendBackground(block, row) {
  const bg = row.querySelector('picture');
  if (!bg) return null;

  const bgP = bg.closest('p');
  block.append(bg);
  if (bgP) bgP.remove();

  return bg;
}

/**
 * Adds styling class to the hero body row
 * @param {HTMLElement} row - The first row element
 */
function styleHeroBody(row) {
  row.classList.add('hero-body');
}

/**
 * Decorates the hero block
 * @param {HTMLElement} block - The hero block element
 */
export default async function decorate(block) {
  const row = block.firstElementChild;
  extractAndAppendBackground(block, row);
  styleHeroBody(row);
}
