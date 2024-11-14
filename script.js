document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.carousel-track-container');
  const track = document.querySelector('.carousel-track');
  const originalSlides = Array.from(track.children);
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  let currentIndex = originalSlides.length;
  let totalSlides;
  let isTransitioning = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  let isDragging = false;

  // Clone slides to the left and right to simulate infinite scrolling
  function cloneSlides() {
    // Clone last slides and prepend in reversed order
    const clonesBefore = originalSlides.slice().reverse().map(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('clone');
      return clone;
    });
    clonesBefore.forEach(clone => track.insertBefore(clone, track.firstChild));

    // Clone first slides and append
    const clonesAfter = originalSlides.slice().map(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('clone');
      return clone;
    });
    clonesAfter.forEach(clone => track.appendChild(clone));

    totalSlides = track.children.length;
  }

  // Initialize the carousel
  function initCarousel() {
    cloneSlides();
    updateSlidePositions();
    scrollToIndex(currentIndex, 'auto');
    attachEventListeners();
  }

  // Update slide positions (needed to calculate offsets correctly)
  function updateSlidePositions() {
    const slides = Array.from(track.children);
    slides.forEach((slide, index) => {
      slide.setAttribute('data-index', index);
    });
  }

  // Scroll to the given index
  function scrollToIndex(index, behavior = 'smooth') {
    const slides = Array.from(track.children);
    const slide = slides[index];
    const slideOffset = slide.offsetLeft;
    const slideWidth = slide.offsetWidth;
    const containerWidth = carouselContainer.offsetWidth;
    const scrollPosition = slideOffset - (containerWidth - slideWidth) / 2;

    carouselContainer.scrollTo({
      left: scrollPosition,
      behavior: behavior,
    });
  }

  // Handle infinite scrolling
  function handleInfiniteScroll() {
    const slides = Array.from(track.children);
    const totalOriginalSlides = originalSlides.length;
    const firstCloneIndex = totalOriginalSlides - 1;
    const lastCloneIndex = slides.length - totalOriginalSlides;

    if (currentIndex <= firstCloneIndex) {
      // Moved to clones before the original slides
      currentIndex += totalOriginalSlides;
      scrollToIndex(currentIndex, 'auto');
    } else if (currentIndex >= lastCloneIndex) {
      // Moved to clones after the original slides
      currentIndex -= totalOriginalSlides;
      scrollToIndex(currentIndex, 'auto');
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    nextButton.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      scrollToIndex(currentIndex);
      setTimeout(() => {
        handleInfiniteScroll();
        isTransitioning = false;
      }, 500);
    });

    prevButton.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      scrollToIndex(currentIndex);
      setTimeout(() => {
        handleInfiniteScroll();
        isTransitioning = false;
      }, 500);
    });

    // Touch events for mobile devices
    carouselContainer.addEventListener('touchstart', touchStart);
    carouselContainer.addEventListener('touchmove', touchMove);
    carouselContainer.addEventListener('touchend', touchEnd);

    carouselContainer.addEventListener('scroll', () => {
      // Update currentIndex based on scroll position
      const slides = Array.from(track.children);
      const containerCenter = carouselContainer.scrollLeft + (carouselContainer.offsetWidth / 2);
      let closestIndex = currentIndex;
      let minDistance = Infinity;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
        const distance = Math.abs(containerCenter - slideCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      currentIndex = closestIndex;
    });

    window.addEventListener('resize', () => {
      scrollToIndex(currentIndex, 'auto');
    });
  }

  // Touch event handlers
  function touchStart(event) {
    if (isTransitioning) return;
    isDragging = true;
    startX = event.touches[0].clientX;
    animationID = requestAnimationFrame(animation);
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentX = event.touches[0].clientX;
    const deltaX = currentX - startX;
    currentTranslate = prevTranslate + deltaX;
  }

  function touchEnd() {
    cancelAnimationFrame(animationID);
    isDragging = false;

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && !isTransitioning) {
      // Swiped left
      isTransitioning = true;
      currentIndex++;
      scrollToIndex(currentIndex);
      setTimeout(() => {
        handleInfiniteScroll();
        isTransitioning = false;
      }, 500);
    } else if (movedBy > 50 && !isTransitioning) {
      // Swiped right
      isTransitioning = true;
      currentIndex--;
      scrollToIndex(currentIndex);
      setTimeout(() => {
        handleInfiniteScroll();
        isTransitioning = false;
      }, 500);
    } else {
      // Return to original position
      scrollToIndex(currentIndex);
    }

    prevTranslate = 0;
    currentTranslate = 0;
  }

  function animation() {
    if (isDragging) {
      carouselContainer.scrollLeft -= currentTranslate - prevTranslate;
      prevTranslate = currentTranslate;
      requestAnimationFrame(animation);
    }
  }

  initCarousel();
});
