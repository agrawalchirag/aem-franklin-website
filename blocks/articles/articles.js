import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Fetches articles data from the API endpoint
 * @param {string} apiUrl - URL of the articles JSON endpoint
 * @returns {Promise<Array>} Array of article objects
 */
async function fetchArticles(apiUrl) {
  const resp = await fetch(apiUrl);
  if (!resp.ok) throw new Error('Network response was not ok');
  const json = await resp.json();
  return Array.isArray(json) ? json : (json.data || []);
}

/**
 * Creates a single article card element
 * @param {Object} article - Article data object
 * @returns {HTMLLIElement} Article card list item
 */
function createArticleCard(article) {
  const li = document.createElement('li');
  li.className = 'article-card';

  const link = document.createElement('a');
  link.className = 'article-link';
  link.href = article.url || '#';

  if (article.image) {
    const pic = createOptimizedPicture(article.image, article.title || '', false, [{ width: '600' }]);
    link.appendChild(pic);
  }

  const body = document.createElement('div');
  body.className = 'article-body';

  const h3 = document.createElement('h3');
  h3.textContent = article.title || '';
  body.appendChild(h3);

  const p = document.createElement('p');
  p.className = 'article-desc';
  p.textContent = article.description || '';
  body.appendChild(p);

  link.appendChild(body);
  li.appendChild(link);

  return li;
}

/**
 * Builds a list of article cards from articles data
 * @param {Array} articles - Array of article objects
 * @returns {HTMLUListElement} Unordered list of article cards
 */
function buildArticlesList(articles) {
  const ul = document.createElement('ul');
  ul.className = 'articles-list';
  articles.forEach((article) => ul.appendChild(createArticleCard(article)));
  return ul;
}

/**
 * Decorates the articles block with fetched article data
 * @param {HTMLElement} block - The articles block element
 */
export default async function decorate(block) {
  const api = block.dataset.url || '/magazine/articles.json';

  try {
    const articles = await fetchArticles(api);
    const articlesList = buildArticlesList(articles);
    block.replaceChildren(articlesList);
  } catch (e) {
    // Graceful fallback
    block.innerHTML = '<p>Error loading articles.</p>';
  }
}
