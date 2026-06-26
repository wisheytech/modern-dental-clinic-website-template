/**
 * Testimonial carousel module.
 */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.carousel-dot');
  
  let currentSlide = 0;
  let autoRotateInterval;

  // Carousel ARIA setup
  const container = document.querySelector('.testimonial-carousel-container');
  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-roledescription', 'carousel');
    container.setAttribute('aria-label', 'Patient Testimonials');
  }
  const trackContainer = document.querySelector('.testimonial-carousel');
  if (trackContainer) {
    trackContainer.setAttribute('aria-live', 'polite');
  }
  const dotsContainer = document.querySelector('.carousel-dots');
  if (dotsContainer) {
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Testimonial slides');
  }
  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
  });

  const track = document.querySelector('.testimonial-track');
  const updateCarousel = () => {
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    cards.forEach((card, index) => {
      const isActive = index === currentSlide;
      card.classList.toggle('active-slide', isActive);
      card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      card.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    dots.forEach((dot, index) => {
      const isActive = index === currentSlide;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % cards.length;
    updateCarousel();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + cards.length) % cards.length;
    updateCarousel();
  };

  const startAutoRotate = () => {
    clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(nextSlide, 6000);
  };

  const stopAutoRotate = () => {
    clearInterval(autoRotateInterval);
  };

  if (cards.length > 0) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoRotate();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
        startAutoRotate();
      });
    });

    // Pause on hover and focus
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('focusin', stopAutoRotate);
      carouselContainer.addEventListener('focusout', startAutoRotate);
      carouselContainer.addEventListener('mouseenter', stopAutoRotate);
      carouselContainer.addEventListener('mouseleave', startAutoRotate);

      // Keyboard accessibility for slide changing when container is focused
      carouselContainer.setAttribute('tabindex', '0');
      carouselContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
          startAutoRotate();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
          startAutoRotate();
        }
      });

      // Touch / Swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
      }, { passive: true });

      const handleGesture = () => {
        if (touchStartX - touchEndX > 50) {
          nextSlide();
          startAutoRotate();
        }
        if (touchEndX - touchStartX > 50) {
          prevSlide();
          startAutoRotate();
        }
      };
    }

    // Initialize cards attributes once
    cards.forEach((card, index) => {
      card.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
      card.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    startAutoRotate();
  }
});
