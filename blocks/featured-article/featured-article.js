import {
  getMetadata,
} from '../../scripts/lib-franklin.js';

/**
 * Loads a fragment from a given path
 * @param {string} path - The path to the fragment
 * @returns {Document|null} The parsed document or null if failed
 */
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(path);
    if (resp.ok) {
      const parser = new DOMParser();
      return parser.parseFromString(await resp.text(), 'text/html');
    }
  }
  return null;
}

/**
 * Extracts metadata from the document
 * @param {Document} doc - The document to extract metadata from
 * @returns {Object} Object containing title and description
 */
function extractMetadata(doc) {
  const title = getMetadata('og:title', doc);
  const desc = getMetadata('og:description', doc);
  return { title, desc };
}

/**
 * Creates the text section with pretitle, heading, description, and link
 * @param {string} title - The article title
 * @param {string} desc - The article description
 * @param {Element} link - The read more link element
 * @returns {Element} The text section element
 */
function createTextSection(title, desc, link) {
  const $pre = document.createElement('p');
  $pre.classList.add('pretitle');
  $pre.textContent = 'Featured Article';

  const $h2 = document.createElement('h2');
  $h2.textContent = title;

  const $p = document.createElement('p');
  $p.textContent = desc;

  const $link = document.createElement('div');
  $link.append(link);
  link.textContent = 'Read More';

  const $text = document.createElement('div');
  $text.classList.add('text');
  $text.append($pre, $h2, $p, $link);

  return $text;
}

/**
 * Creates the image section with hero picture
 * @param {Document} doc - The document to extract hero image from
 * @returns {Element} The image section element
 */
function createImageSection(doc) {
  const $image = document.createElement('div');
  $image.classList.add('image');

  const $hero = doc.querySelector('body > main picture');
  if ($hero) {
    $image.append($hero);
  }

  return $image;
}

/**
 * Decorates the featured article block
 * @param {HTMLElement} $block - The featured article block element
 */
export default async function decorate($block) {
  const link = $block.querySelector('a');
  const path = link ? link.getAttribute('href') : $block.textContent.trim();

  // Load fragment document
  const doc = await loadFragment(path);
  if (!doc) {
    return;
  }

  // Extract metadata and create sections
  const { title, desc } = extractMetadata(doc);
  const $text = createTextSection(title, desc, link);
  const $image = createImageSection(doc);

  // Replace block content
  $block.replaceChildren($image, $text);
}
