(() => {
  // <stdin>
  (() => {
    const root = document.querySelector("[data-featured]");
    if (!root) return;
    const track = root.querySelector("[data-featured-track]");
    const slides = Array.from(root.querySelectorAll("[data-featured-slide]"));
    const prev = root.querySelector("[data-featured-prev]");
    const next = root.querySelector("[data-featured-next]");
    const dots = Array.from(root.querySelectorAll("[data-featured-dot]"));
    if (!track || slides.length === 0) return;
    const single = slides.length === 1;
    const goTo = (index) => {
      const clamped = Math.min(Math.max(index, 0), slides.length - 1);
      track.scrollTo({
        left: slides[clamped].offsetLeft,
        behavior: "smooth"
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
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      slides.forEach((slide, i) => slide.classList.toggle("is-current", i === index));
      if (single) {
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        return;
      }
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    };
    const currentIndex = () => {
      if (dots.some((dot) => dot.classList.contains("is-active"))) {
        return dots.findIndex((dot) => dot.classList.contains("is-active"));
      }
      return 0;
    };
    prev?.addEventListener("click", () => goTo(currentIndex() - 1));
    next?.addEventListener("click", () => goTo(currentIndex() + 1));
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goTo(index));
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goTo(currentIndex() + (event.key === "ArrowRight" ? 1 : -1));
    });
    let frame = 0;
    track.addEventListener("scroll", () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        render(closestIndex());
      });
    }, { passive: true });
    let drag = null;
    let draggedRecently = false;
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      draggedRecently = false;
      drag = { startX: event.clientX, startScroll: track.scrollLeft, moved: false };
    });
    window.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        track.classList.add("is-dragging");
      }
      if (drag.moved) track.scrollLeft = drag.startScroll - dx;
    });
    const endDrag = () => {
      if (!drag) return;
      draggedRecently = drag.moved;
      drag = null;
      track.classList.remove("is-dragging");
      if (draggedRecently) goTo(closestIndex());
    };
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", (event) => {
      if (!draggedRecently) return;
      event.preventDefault();
      event.stopPropagation();
      draggedRecently = false;
    }, true);
    render(0);
  })();
  (() => {
    const layout = document.querySelector(".home-layout");
    const grid = document.querySelector("[data-post-grid]");
    if (!layout || !grid) return;
    const cards = Array.from(grid.querySelectorAll("[data-post]"));
    if (cards.length === 0) return;
    const filters = document.querySelector("[data-filters]");
    const input = document.querySelector("[data-search-input]");
    const submit = document.querySelector("[data-search-submit]");
    const empty = document.querySelector("[data-no-results]");
    const catItems = Array.from(document.querySelectorAll(".cat-item"));
    const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
    const normalise = (value) => (value || "").replace(/^—+$/, "").trim().toLocaleLowerCase();
    const state = {
      query: "",
      category: ""
    };
    const matches = (card) => {
      if (state.category) {
        if (normalise(card.dataset.category) !== normalise(state.category)) return false;
      }
      if (card.dataset.featured === "1") return false;
      if (state.query) {
        const haystack = normalise(card.dataset.title);
        const words = normalise(state.query).split(/\s+/).filter(Boolean);
        if (!words.every((word) => haystack.includes(word))) return false;
      }
      return true;
    };
    const apply = () => {
      let visible = 0;
      cards.forEach((card) => {
        const show = matches(card);
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) empty.hidden = visible > 0;
    };
    let debounce = 0;
    const onQueryChange = () => {
      state.query = input ? input.value : "";
      clearTimeout(debounce);
      debounce = setTimeout(apply, 200);
    };
    const runNow = () => {
      clearTimeout(debounce);
      apply();
    };
    input?.addEventListener("input", onQueryChange);
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        runNow();
      }
    });
    submit?.addEventListener("click", runNow);
    catItems.forEach((item) => {
      item.addEventListener("click", () => {
        state.category = item.dataset.category || "";
        catItems.forEach((other) => {
          const active = other === item;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", active ? "true" : "false");
        });
        apply();
      });
    });
    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const list = button.dataset.view === "list";
        layout.classList.toggle("is-list", list);
        viewButtons.forEach((other) => {
          const active = other === button;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", active ? "true" : "false");
        });
      });
    });
    if (filters) {
      const onScroll = () => {
        filters.classList.toggle("is-sticky", filters.getBoundingClientRect().top <= 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  })();
})();
