/**
 * Scroll reveal, parallax, and scroll interaction observers.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Sticky header scroll state
  const header = document.querySelector('header');
  if (header) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', window.DentalUtils ? window.DentalUtils.throttle(handleHeaderScroll, 16) : handleHeaderScroll, { passive: true });
  }

  // Reveal Observer for scroll-reveal animations
  const revealOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal-item, .stats-bar, .journey-rail, .trust-grid, .why-wrap, .featured-grid, .standard-grid, .facility-grid, .team-grid, .testimonial-carousel-container, .faq-list, .contact-grid, footer .wrap').forEach(el => {
    if (!el.classList.contains('reveal-item')) {
      el.classList.add('reveal-item');
    }
    revealObserver.observe(el);
  });

  // Hero Image Parallax (restricted to 10-12px vertical movement)
  const heroImg = document.querySelector('.photo-panel img');
  if (heroImg) {
    if (heroImg.complete || heroImg.naturalWidth > 0) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => {
        heroImg.classList.add('loaded');
      });
    }

    const handleParallaxScroll = () => {
      const depth = 0.04;
      const scrolled = window.pageYOffset;
      const yPos = Math.min(Math.max(-scrolled * depth, -12), 12);
      heroImg.style.setProperty('--parallax-y', `${yPos}px`);
    };
    window.addEventListener('scroll', window.DentalUtils ? window.DentalUtils.throttle(handleParallaxScroll, 16) : handleParallaxScroll, { passive: true });
  }

  // Facilities image load indicator
  document.querySelectorAll('.facility-card img').forEach(img => {
    if (img.complete || img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });

  // Dental Team intersection observer for staggered entry
  const teamObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const teamObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.team-card');
        cards.forEach((card, idx) => {
          setTimeout(() => {
            card.classList.add('reveal-visible');
          }, idx * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, teamObserverOptions);

  const teamGrid = document.querySelector('.team-grid');
  if (teamGrid) {
    teamObserver.observe(teamGrid);
  }
});
