/**
 * Adds CSS classes to carousel slide children (image and text)
 * @param {Element} slide - The carousel slide element
 */
function styleCarouselSlide(slide) {
  const classes = ['image', 'text'];
  classes.forEach((className, index) => {
    if (slide.children[index]) {
      slide.children[index].classList.add(`carousel-${className}`);
    }
  });
}

/**
 * Scrolls the carousel to a specific slide
 * @param {Element} carousel - The carousel container
 * @param {Element} slide - The target slide element
 */
function scrollToSlide(carousel, slide) {
  const scrollLeft = slide.offsetLeft - slide.parentNode.offsetLeft;
  carousel.scrollTo({
    top: 0,
    left: scrollLeft,
    behavior: 'smooth',
  });
}

/**
 * Updates the selected state of navigation buttons
 * @param {Element} buttonsContainer - The buttons container
 * @param {Element} activeButton - The button to set as active
 */
function updateSelectedButton(buttonsContainer, activeButton) {
  // Remove selected class from all buttons
  [...buttonsContainer.children].forEach((btn) => {
    btn.classList.remove('selected');
  });

  // Add selected class to active button
  activeButton.classList.add('selected');
}

/**
 * Creates a navigation button for a carousel slide
 * @param {number} index - The slide index
 * @param {Element} slide - The slide element
 * @param {Element} carousel - The carousel container
 * @param {Element} buttonsContainer - The buttons container
 * @returns {Element} The created button element
 */
function createNavigationButton(index, slide, carousel, buttonsContainer) {
  const button = document.createElement('button');
  button.title = 'Carousel Nav';
  button.setAttribute('aria-label', `Go to slide ${index + 1}`);

  // First button is selected by default
  if (index === 0) {
    button.classList.add('selected');
  }

  // Add click handler
  button.addEventListener('click', () => {
    scrollToSlide(carousel, slide);
    updateSelectedButton(buttonsContainer, button);
  });

  return button;
}

/**
 * Creates the navigation buttons container with all buttons
 * @param {Element} carousel - The carousel container
 * @returns {Element} The buttons container element
 */
function createNavigationButtons(carousel) {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'carousel-buttons';

  // Create a button for each slide
  [...carousel.children].forEach((slide, index) => {
    const button = createNavigationButton(index, slide, carousel, buttonsContainer);
    buttonsContainer.append(button);
  });

  return buttonsContainer;
}

/**
 * Main decorator function - orchestrates the carousel setup
 * @param {Element} block - The carousel block element
 */
export default function decorate(block) {
  // Style all carousel slides
  [...block.children].forEach((slide) => {
    styleCarouselSlide(slide);
  });

  // Create and append navigation buttons
  const navigationButtons = createNavigationButtons(block);
  block.parentElement.append(navigationButtons);
}
