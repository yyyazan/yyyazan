document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.carousel-track-container');
  const track = document.querySelector('.carousel-track');
  const originalSlides = Array.from(track.children);
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  let currentIndex = originalSlides.length;
  let totalSlides;
  let isTransitioning = false;

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
    waitForImagesToLoad().then(() => {
      // Force reflow
      carouselContainer.offsetHeight;
      // Add a small delay
      setTimeout(() => {
        scrollToIndex(currentIndex, 'auto');
        attachEventListeners();
      }, 200); // Delay in milliseconds
    });
  }
  
  
  
  // Function to wait for all images within the carousel to load
  function waitForImagesToLoad() {
    const images = track.querySelectorAll('img');
    const promises = Array.from(images).map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = img.onerror = resolve;
        }
      });
    });
    return Promise.all(promises);
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
      currentIndex++;
      scrollToIndex(currentIndex);
      setTimeout(() => {
        handleInfiniteScroll();
      }, 500);
    });

    prevButton.addEventListener('click', () => {
      currentIndex--;
      scrollToIndex(currentIndex);
      setTimeout(() => {
        handleInfiniteScroll();
      }, 500);
    });

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

  initCarousel();
});
