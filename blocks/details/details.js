import { createOptimizedPicture } from '../../scripts/aem.js';
import decorateSocial from '../sociallinks/sociallinks.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'details-card-image';
      else div.className = 'details-card-body';
    });
    // collect social anchors inside the body and wrap them into a sociallinks container
    const body = li.querySelector('.details-card-body');
    if (body) {
      const anchors = [...body.querySelectorAll('a')];
      if (anchors.length) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sociallinks';
        const inner = document.createElement('div');
        inner.className = 'sociallinks-inner';
        anchors.forEach((a) => {
          // move anchor into inner wrapper; remove empty parent paragraphs
          inner.appendChild(a);
          const p = a.closest('p');
          if (p && p.textContent.trim() === '') p.remove();
        });
        wrapper.appendChild(inner);
        li.appendChild(wrapper);
        // decorate the social links (inject icons, classes)
        try { decorateSocial(wrapper); } catch (e) { /* graceful */ }
      }
    }
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
