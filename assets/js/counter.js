/**
 * Statistics counters count-up logic.
 */
document.addEventListener('DOMContentLoaded', () => {
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1200;
    const step = Math.max(Math.floor(duration / target), 12);
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / step));
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString();
      }
    }, step);
  };

  const counterObserverOptions = {
    threshold: 0.1
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.count-up');
        counters.forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, counterObserverOptions);

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    counterObserver.observe(statsBar);
  }
});
