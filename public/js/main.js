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
    track.addEventListener("scrollend", () => render(closestIndex()));
    let drag = null;
    let draggedRecently = false;
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      draggedRecently = false;
      drag = {
        startX: event.clientX,
        startScroll: track.scrollLeft,
        startIndex: currentIndex(),
        dx: 0,
        moved: false
      };
    });
    window.addEventListener("pointermove", (event) => {
      if (!drag) return;
      drag.dx = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(drag.dx) > 6) {
        drag.moved = true;
        track.classList.add("is-dragging");
      }
      if (drag.moved) track.scrollLeft = drag.startScroll - drag.dx;
    });
    const endDrag = () => {
      if (!drag) return;
      const { moved, startIndex, dx } = drag;
      drag = null;
      track.classList.remove("is-dragging");
      draggedRecently = moved;
      if (!moved) return;
      const threshold = track.clientWidth * 0.25;
      const step = Math.abs(dx) > threshold ? dx < 0 ? 1 : -1 : 0;
      goTo(startIndex + step);
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
    const favEmpty = document.querySelector("[data-fav-empty]");
    const favToggle = document.querySelector("[data-fav-toggle]");
    const favButtons = Array.from(grid.querySelectorAll("[data-fav-btn]"));
    const catItems = Array.from(document.querySelectorAll(".cat-item"));
    const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
    const normalise = (value) => (value || "").replace(/^—+$/, "").trim().toLocaleLowerCase();
    const STORAGE_KEY = "victors_blog_favorites";
    const loadFavorites = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
      } catch {
        return [];
      }
    };
    let favorites = loadFavorites();
    const saveFavorites = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch {
      }
    };
    const state = {
      query: "",
      category: "",
      // Режим «только избранное» — третий, независимый от категории и запроса
      // фильтр: включённая кнопка в строке поиска показывает лишь сохранённые.
      favorites: false
    };
    const matches = (card) => {
      if (state.category) {
        if (normalise(card.dataset.category) !== normalise(state.category)) return false;
      }
      if (card.dataset.featured === "1") return false;
      if (state.favorites && !favorites.includes(card.dataset.url)) return false;
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
      if (empty) empty.hidden = visible > 0 || state.favorites;
      if (favEmpty) favEmpty.hidden = visible > 0 || !state.favorites;
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
    const renderFavorites = () => {
      favButtons.forEach((button) => {
        const active = favorites.includes(button.dataset.url);
        button.classList.toggle("is-fav", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
        button.setAttribute(
          "aria-label",
          active ? button.dataset.labelRemove : button.dataset.labelAdd
        );
      });
    };
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-fav-btn]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const url = button.dataset.url;
      favorites = favorites.includes(url) ? favorites.filter((item) => item !== url) : [...favorites, url];
      saveFavorites();
      renderFavorites();
      if (state.favorites) apply();
    });
    favToggle?.addEventListener("click", () => {
      state.favorites = !state.favorites;
      favToggle.classList.toggle("is-active", state.favorites);
      favToggle.setAttribute("aria-pressed", state.favorites ? "true" : "false");
      apply();
    });
    renderFavorites();
    if (filters) {
      let limit = 0;
      const measure = () => {
        const offset = parseFloat(getComputedStyle(filters).top);
        limit = Number.isFinite(offset) ? offset + 1 : 0;
      };
      const onScroll = () => {
        filters.classList.toggle("is-sticky", filters.getBoundingClientRect().top <= limit);
      };
      measure();
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", () => {
        measure();
        onScroll();
      }, { passive: true });
    }
  })();
  (() => {
    if (typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("animation-timeline", "scroll()")) {
      return;
    }
    if (!document.querySelector(".featured-media")) return;
    const RANGE = 0.6;
    let frame = 0;
    const update = () => {
      frame = 0;
      const limit = window.innerHeight * RANGE;
      const progress = limit > 0 ? window.scrollY / limit : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);
      document.documentElement.style.setProperty("--featured-morph", String(clamped));
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
  })();
})();
