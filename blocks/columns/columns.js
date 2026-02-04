/**
 * Adds a CSS class indicating the number of columns
 * @param {HTMLElement} block - The columns block element
 */
function addColumnClassNames(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
}

/**
 * Sets up image columns by adding appropriate CSS classes
 * @param {HTMLElement} block - The columns block element
 */
function setupImageColumns(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // Picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}

/**
 * Decorates the columns block
 * @param {HTMLElement} block - The columns block element
 */
export default function decorate(block) {
  addColumnClassNames(block);
  setupImageColumns(block);
}
