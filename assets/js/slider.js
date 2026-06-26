/**
 * Before/After comparison slider module.
 */
document.addEventListener('DOMContentLoaded', () => {
  const hideHints = () => {
    document.querySelectorAll('.slider-hint').forEach(hint => {
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 300);
    });
    document.querySelectorAll('.slider-divider, .slider-overlay').forEach(el => {
      el.classList.remove('animate-hint');
    });
  };

  document.querySelectorAll('.comparison-slider').forEach(slider => {
    const overlay = slider.querySelector('.slider-overlay');
    const divider = slider.querySelector('.slider-divider');
    const beforeImg = slider.querySelector('.slider-image-before');
    // Setup slider accessibility attributes
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuetext', 'Before/After 50% split view');

    // Keep beforeImg width matching the slider container dynamically on resize/init
    const updateImageWidth = () => {
      beforeImg.style.width = slider.offsetWidth + 'px';
    };
    
    // Initialize image width
    updateImageWidth();
    
    // Update on load and resize
    window.addEventListener('load', updateImageWidth);
    window.addEventListener('resize', window.DentalUtils ? window.DentalUtils.debounce(updateImageWidth, 100) : updateImageWidth);

    let isDragging = false;

    const move = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let position = (clientX - rect.left) / rect.width;
      position = Math.max(0, Math.min(position, 1));
      
      const percentage = position * 100;
      overlay.style.width = percentage + '%';
      divider.style.left = percentage + '%';
      
      slider.setAttribute('aria-valuenow', Math.round(percentage));
      slider.setAttribute('aria-valuetext', `Before/After ${Math.round(percentage)}% split view`);
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      hideHints();
      move(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      move(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events (swipe support)
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      hideHints();
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Keyboard Accessibility
    slider.addEventListener('keydown', (e) => {
      let currentPct = parseFloat(divider.style.left) || 50;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        hideHints();
        currentPct = Math.max(0, currentPct - 5);
        overlay.style.width = currentPct + '%';
        divider.style.left = currentPct + '%';
        slider.setAttribute('aria-valuenow', Math.round(currentPct));
        slider.setAttribute('aria-valuetext', `Before/After ${Math.round(currentPct)}% split view`);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        hideHints();
        currentPct = Math.min(100, currentPct + 5);
        overlay.style.width = currentPct + '%';
        divider.style.left = currentPct + '%';
        slider.setAttribute('aria-valuenow', Math.round(currentPct));
        slider.setAttribute('aria-valuetext', `Before/After ${Math.round(currentPct)}% split view`);
      }
    });
  });

  // Automatically remove hint classes after animation finishes if not interacted with
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.slider-divider, .slider-overlay').forEach(el => {
        el.classList.remove('animate-hint');
      });
    }, 2000);
  });
});
