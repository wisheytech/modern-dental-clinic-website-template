/**
 * Application entry point and page interactivity modules.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Setup Accordion WAI-ARIA Attributes dynamically
  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (trigger && panel) {
      const triggerId = `faq-trigger-${index}`;
      const panelId = `faq-panel-${index}`;
      
      trigger.setAttribute('id', triggerId);
      trigger.setAttribute('aria-controls', panelId);
      
      panel.setAttribute('id', panelId);
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', triggerId);
    }
  });
  // FAQ accordion logic
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const panel = item.querySelector('.faq-panel');
      const isActive = item.classList.contains('active');

      // Close all open items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherPanel = otherItem.querySelector('.faq-panel');
          otherPanel.style.maxHeight = null;
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Facilities Lightbox
  const facilitiesData = [
    {
      img: "assets/images/gallery/reception.jpg",
      title: "Reception Desk",
      desc: "Our spacious, light-filled patient lounge is designed to make you feel at ease. Enjoy complimentary refreshments while our team prepares for your appointment."
    },
    {
      img: "assets/images/gallery/treatment-room.jpg",
      title: "Dental Chair",
      desc: "Equipped with state-of-the-art dental technology, our treatment rooms prioritize ergonomic comfort and absolute clinical sterility."
    },
    {
      img: "assets/images/hero/hero.jpg",
      title: "Doctor Discussion",
      desc: "A private space to review treatment pathways, view digital diagnostics, and plan your dental care side-by-side with your clinician."
    },
    {
      img: "assets/images/gallery/digital-dentistry.jpg",
      title: "Digital Scanner",
      desc: "Featuring advanced 3D scanning and digital imaging, allowing us to build precise models of your teeth for more accurate treatment."
    }
  ];

  let currentFacilityIndex = 0;
  const lightbox = document.getElementById('facilityLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');

  const openLightbox = (index) => {
    currentFacilityIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    // Enable focus for buttons inside active lightbox
    lightbox.querySelectorAll('button').forEach(btn => btn.setAttribute('tabindex', '0'));
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    // Disable focus for buttons inside hidden lightbox
    lightbox.querySelectorAll('button').forEach(btn => btn.setAttribute('tabindex', '-1'));
    document.body.style.overflow = '';
    const triggerCard = document.querySelector(`.facility-card[data-index="${currentFacilityIndex}"]`);
    if (triggerCard) triggerCard.focus();
  };

  const updateLightboxContent = () => {
    const data = facilitiesData[currentFacilityIndex];
    lightboxImg.src = data.img;
    lightboxImg.alt = data.title;
    lightboxTitle.textContent = data.title;
    lightboxDesc.textContent = data.desc;
  };

  const navigateLightbox = (direction) => {
    currentFacilityIndex = (currentFacilityIndex + direction + facilitiesData.length) % facilitiesData.length;
    updateLightboxContent();
  };

  document.querySelectorAll('.facility-card').forEach((card) => {
    card.addEventListener('click', () => {
      const index = parseInt(card.getAttribute('data-index'));
      openLightbox(index);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const index = parseInt(card.getAttribute('data-index'));
        openLightbox(index);
      }
    });
  });

  const closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  const prevBtn = document.getElementById('lightboxPrev');
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  const nextBtn = document.getElementById('lightboxNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

    // Lightbox Focus Trap & Accessibility
  if (lightbox) {
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && lightbox.classList.contains('active')) {
        const focusableElements = [
          document.getElementById('lightboxClose'),
          document.getElementById('lightboxPrev'),
          document.getElementById('lightboxNext')
        ].filter(el => el && el.offsetParent !== null);
        
        if (focusableElements.length === 0) return;
        
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else { // Tab
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    });
  }
  window.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  // Map Loading Skeleton Handler
  const mapIframe = document.getElementById('mapIframe');
  if (mapIframe) {
    mapIframe.addEventListener('load', () => {
      const skeleton = document.getElementById('mapSkeleton');
      if (skeleton) {
        skeleton.style.opacity = '0';
        setTimeout(() => skeleton.remove(), 500);
      }
      mapIframe.style.opacity = '1';
    });
    try {
      if (mapIframe.contentDocument && mapIframe.contentDocument.readyState === 'complete') {
        const skeleton = document.getElementById('mapSkeleton');
        if (skeleton) {
          skeleton.style.opacity = '0';
          setTimeout(() => skeleton.remove(), 500);
        }
        mapIframe.style.opacity = '1';
      }
    } catch (e) {
      // Ignore cross-origin security errors for external Google Maps iframe
    }
  }
});
