export default function decorate(block) {
  // Remove social links section if present
  const socialLinksDiv = block.querySelector('div:last-child');
  if (socialLinksDiv && socialLinksDiv.querySelector('a[title]')) {
    socialLinksDiv.remove();
  }
}
