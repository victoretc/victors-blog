// Featured slider. The track scrolls natively with CSS scroll-snap, so this
// file only moves it: arrows and dots call scrollTo, the keyboard does the
// same, and scroll position drives the dots. Nothing resizes a slide, so
// paging can never make the layout jump.

(() => {
  const root = document.querySelector('[data-featured]');
  if (!root) return;

  const track = root.querySelector('[data-featured-track]');
  const slides = Array.from(root.querySelectorAll('[data-featured-slide]'));
  const prev = root.querySelector('[data-featured-prev]');
  const next = root.querySelector('[data-featured-next]');
  const dots = Array.from(root.querySelectorAll('[data-featured-dot]'));

  if (!track || slides.length === 0) return;

  const single = slides.length === 1;

  // Scroll-snap centres each slide, so the nearest slide boundary is a more
  // reliable "one slide back" target than the slide's own offsetLeft.
  const goTo = (index) => {
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    track.scrollTo({
      left: slides[clamped].offsetLeft,
      behavior: 'smooth',
    });
  };

  const closestIndex = () => {
    const trackLeft = track.scrollLeft;
    let best = 0;
    let bestDistance = Infinity;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - trackLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    return best;
  };

  const render = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));

    if (single) {
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      return;
    }

    // No wrap: the ends are hard stops, so the arrows must go dead there or
    // they would promise movement that cannot happen.
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
  };

  const currentIndex = () => {
    if (dots.some((dot) => dot.classList.contains('is-active'))) {
      return dots.findIndex((dot) => dot.classList.contains('is-active'));
    }
    return 0;
  };

  prev?.addEventListener('click', () => goTo(currentIndex() - 1));
  next?.addEventListener('click', () => goTo(currentIndex() + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goTo(index));
  });

  // Arrow keys page the slider, but only while focus is inside it. Without the
  // containment check these keys would swallow Left/Right for the whole page.
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    goTo(currentIndex() + (event.key === 'ArrowRight' ? 1 : -1));
  });

  let frame = 0;
  track.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      render(closestIndex());
    });
  }, { passive: true });

  render(0);
})();