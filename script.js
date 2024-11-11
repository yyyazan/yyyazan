const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Get all slides
const slides = Array.from(carouselTrack.children);
const totalSlides = slides.length;

// Determine the number of slides visible at a time based on screen size
let slidesToShow = 3;

function updateSlidesToShow() {
  if (window.innerWidth <= 600) {
    slidesToShow = 1;
  } else if (window.innerWidth <= 900) {
    slidesToShow = 2;
  } else {
    slidesToShow = 3;
  }
}

// Dynamically set carousel track width
function setTrackWidth() {
  let totalWidth = 0;
  slides.forEach(slide => {
    const width = slide.getBoundingClientRect().width;
    totalWidth += width;
  });
  carouselTrack.style.width = `${totalWidth}px`;
}

// Call this function initially and on window resize
setTrackWidth();
window.addEventListener('resize', () => {
  updateSlidesToShow();
  setTrackWidth();
  updateCarousel();
});

// Set the initial position
let counter = 0;

// Function to update the carousel position
function updateCarousel() {
  let translateX = 0;
  for (let i = 0; i < counter; i++) {
    const slide = slides[i];
    const width = slide.getBoundingClientRect().width;
    translateX += width;
  }
  carouselTrack.style.transform = `translateX(-${translateX}px)`;

  // Adjust container height based on tallest visible slide (images/videos)
  let maxHeight = 0;
  for (let i = counter; i < counter + slidesToShow && i < slides.length; i++) {
    const slide = slides[i];
    if (slide) {
      const mediaElement = slide.querySelector('img, video');
      const mediaHeight = mediaElement ? mediaElement.clientHeight : 0;
      if (mediaHeight > maxHeight) {
        maxHeight = mediaHeight;
      }

      // Pause all videos
      if (mediaElement.tagName.toLowerCase() === 'video') {
        mediaElement.pause();
        mediaElement.currentTime = 0;
      }
    }
  }

  // Play videos in the current view
  for (let i = counter; i < counter + slidesToShow && i < slides.length; i++) {
    const slide = slides[i];
    if (slide) {
      const mediaElement = slide.querySelector('video');
      if (mediaElement) {
        mediaElement.play();
      }
    }
  }

  carouselTrack.parentElement.style.height = `${maxHeight + 20}px`; // 20px for padding
}

// Event listener for the next button
nextBtn.addEventListener('click', () => {
  if (counter >= totalSlides - slidesToShow) {
    counter = 0; // Loop back to the first set of slides
  } else {
    counter++;
  }
  updateCarousel();
});

// Event listener for the prev button
prevBtn.addEventListener('click', () => {
  if (counter <= 0) {
    counter = totalSlides - slidesToShow;
    if (counter < 0) counter = 0; // Ensure counter doesn't go negative
  } else {
    counter--;
  }
  updateCarousel();
});

// Keyboard Navigation for Accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextBtn.click();
  } else if (e.key === 'ArrowLeft') {
    prevBtn.click();
  }
});

// Initialize carousel height on window load
window.onload = () => {
  updateSlidesToShow();
  updateCarousel();
};
