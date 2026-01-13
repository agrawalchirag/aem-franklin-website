import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const api = block.dataset.url || '/magazine/articles.json';

  try {
    const resp = await fetch(api);
    if (!resp.ok) throw new Error('Network response was not ok');
    const json = await resp.json();
    const items = Array.isArray(json) ? json : (json.data || []);

    const ul = document.createElement('ul');
    ul.className = 'articles-list';

    items.forEach((it) => {
      const li = document.createElement('li');
      li.className = 'article-card';

      const link = document.createElement('a');
      link.className = 'article-link';
      link.href = it.url || '#';

      if (it.image) {
        const pic = createOptimizedPicture(it.image, it.title || '', false, [{ width: '600' }]);
        link.appendChild(pic);
      }

      const body = document.createElement('div');
      body.className = 'article-body';

      const h3 = document.createElement('h3');
      h3.textContent = it.title || '';
      body.appendChild(h3);

      const p = document.createElement('p');
      p.className = 'article-desc';
      p.textContent = it.description || '';
      body.appendChild(p);

      link.appendChild(body);
      li.appendChild(link);
      ul.appendChild(li);
    });

    block.replaceChildren(ul);
  } catch (e) {
    // graceful fallback
    block.innerHTML = '<p>Error loading articles.</p>';
  }
}
