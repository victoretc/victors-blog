// Featured slider. The track scrolls natively with CSS scroll-snap, so this
// file only moves it: arrows and dots call scrollTo, the keyboard does the
// same, and scroll position drives the dots. On touch the track is swiped
// natively; on desktop the same gesture is emulated with mouse dragging.
// Nothing resizes a slide, so paging can never make the layout jump.

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

  // Snap alignment is `start`, so a slide's snap position is exactly its
  // offsetLeft — that is the scrollTo target.
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

    // Текущий слайд остаётся непритушенным и в масштабе 1:1, соседние
    // уехавшие — притушены и уменьшены. Класс ставится здесь, потому что
    // render() уже вызывается из scroll через requestAnimationFrame, то
    // есть состояние совпадает с реальным положением трека.
    slides.forEach((slide, i) => slide.classList.toggle('is-current', i === index));

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

  // На iOS финальный снап иногда досаживается в UI-процессе уже после
  // последнего scroll-события: scrollend добивает render(), чтобы точки
  // и is-current гарантированно совпали с видимым слайдом.
  track.addEventListener('scrollend', () => render(closestIndex()));

  // Листание прямо по фотографии: на тач-экранах трек уже скроллится нативно
  // (overflow-x + scroll-snap), а на десктопе тот же жест эмулируем мышью.
  // Слушатели висят на window, а не на pointer capture: capture перенаправил бы
  // события и клик по ссылке перестал бы открывать пост.
  let drag = null;
  let draggedRecently = false;

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    draggedRecently = false;
    drag = {
      startX: event.clientX,
      startScroll: track.scrollLeft,
      startIndex: currentIndex(),
      dx: 0,
      moved: false,
    };
  });

  window.addEventListener('pointermove', (event) => {
    if (!drag) return;
    drag.dx = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(drag.dx) > 6) {
      drag.moved = true;
      track.classList.add('is-dragging');
    }
    if (drag.moved) track.scrollLeft = drag.startScroll - drag.dx;
  });

  const endDrag = () => {
    if (!drag) return;
    const { moved, startIndex, dx } = drag;
    drag = null;
    track.classList.remove('is-dragging');
    draggedRecently = moved;
    if (!moved) return;

    // Порог — четверть ширины слайда: короткий сдвиг возвращает слайд на
    // место, длинный листает на один в сторону жеста. Целимся от слайда,
    // активного на старте, а не от scrollLeft: к моменту отпускания
    // scroll-snap уже возвращает трек к границе и сбил бы расчёт.
    const threshold = track.clientWidth * 0.25;
    const step = Math.abs(dx) > threshold ? (dx < 0 ? 1 : -1) : 0;
    goTo(startIndex + step);
  };

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // После перетаскивания клик не должен открывать пост.
  track.addEventListener('click', (event) => {
    if (!draggedRecently) return;
    event.preventDefault();
    event.stopPropagation();
    draggedRecently = false;
  }, true);

  render(0);
})();

// Search, filters and categories.
//
// The posts are already in the page: this only shows and hides them. That keeps
// the index usable with JavaScript off — you still get every post, just without
// the narrowing. Titles and categories ride along on data- attributes so the
// matching stays a pure DOM operation with no extra index to keep in sync.

(() => {
  const layout = document.querySelector('.home-layout');
  const grid = document.querySelector('[data-post-grid]');
  if (!layout || !grid) return;

  const cards = Array.from(grid.querySelectorAll('[data-post]'));
  if (cards.length === 0) return;

  const filters = document.querySelector('[data-filters]');
  const input = document.querySelector('[data-search-input]');
  const submit = document.querySelector('[data-search-submit]');
  const empty = document.querySelector('[data-no-results]');
  const favEmpty = document.querySelector('[data-fav-empty]');
  const favToggle = document.querySelector('[data-fav-toggle]');
  const favButtons = Array.from(grid.querySelectorAll('[data-fav-btn]'));
  const catItems = Array.from(document.querySelectorAll('.cat-item'));
  const viewButtons = Array.from(document.querySelectorAll('[data-view]'));

  // An em dash is what Hugo writes for a missing value, so a post without a
  // category reports that rather than an empty string.
  const normalise = (value) =>
    (value || '')
      .replace(/^—+$/, '')
      .trim()
      .toLocaleLowerCase();

  // --- favorites storage ----------------------------------------------------
  // localStorage, не сервер: избранное принадлежит браузеру читателя. В
  // хранилище лежит список RelPermalink — по ним же кнопки находят свой пост.
  // Обёртки try/catch: в приватном режиме запись запрещена, и фильтр должен
  // продолжать работать в рамках сессии, просто не переживая перезагрузку.

  const STORAGE_KEY = 'victors_blog_favorites';

  const loadFavorites = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  };

  let favorites = loadFavorites();

  const saveFavorites = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ничего: сессионное избранное всё равно работает.
    }
  };

  const state = {
    query: '',
    category: '',
    // Режим «только избранное» — третий, независимый от категории и запроса
    // фильтр: включённая кнопка в строке поиска показывает лишь сохранённые.
    favorites: false,
  };

  const matches = (card) => {
    if (state.category) {
      if (normalise(card.dataset.category) !== normalise(state.category)) return false;
    }

    // Featured posts stay in the slider, never in the grid, so they are out of
    // scope for the filters entirely — no tab brings them back here.
    if (card.dataset.featured === '1') return false;

    if (state.favorites && !favorites.includes(card.dataset.url)) return false;

    if (state.query) {
      const haystack = normalise(card.dataset.title);
      // Every whitespace-separated word has to appear somewhere in the title,
      // so "play log" still finds "Logging in Playwright".
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

    // В режиме избранного пустая лента — это «ещё ничего не сохранили», а не
    // «ничего не найдено»: 404 здесь врал бы, поэтому показывается свой блок.
    if (empty) empty.hidden = visible > 0 || state.favorites;
    if (favEmpty) favEmpty.hidden = visible > 0 || !state.favorites;
  };

  // --- typing ---------------------------------------------------------------
  // 200ms is what the frontend debounces with; shorter and the list flickers
  // on every keystroke.
  let debounce = 0;

  const onQueryChange = () => {
    state.query = input ? input.value : '';
    clearTimeout(debounce);
    debounce = setTimeout(apply, 200);
  };

  const runNow = () => {
    clearTimeout(debounce);
    apply();
  };

  input?.addEventListener('input', onQueryChange);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runNow();
    }
  });
  submit?.addEventListener('click', runNow);

  // --- categories -----------------------------------------------------------

  catItems.forEach((item) => {
    item.addEventListener('click', () => {
      state.category = item.dataset.category || '';

      catItems.forEach((other) => {
        const active = other === item;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      apply();
    });
  });

  // --- view toggle ----------------------------------------------------------

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const list = button.dataset.view === 'list';
      layout.classList.toggle('is-list', list);

      viewButtons.forEach((other) => {
        const active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  });

  // --- favorites ------------------------------------------------------------
  // Кнопки избранного — соседи ссылок внутри карточек, поэтому клик вешается
  // делегированием на сетку: разметку обходить не нужно. Ссылка при этом не
  // открывается только потому, что кнопка лежит рядом с ней, а не внутри —
  // preventDefault/stopPropagation оставлены как страховка на случай
  // переезда кнопки обратно внутрь <a>.
  //
  // Постоянной отметки на карточке нет: после добавления сердечко возвращается
  // в нейтральный вид и показывается, как обычно, только при наведении. О том,
  // что пост сохранён или убран, говорит одна всплывающая надпись с
  // иконкой-информацией; состояние само живёт в localStorage и в aria-pressed
  // для скринридеров.

  const toast = document.querySelector('[data-fav-toast]');
  const toastText = toast ? toast.querySelector('[data-toast-text]') : null;
  let toastTimer = 0;

  const showFavToast = (kind) => {
    if (!toast || !toastText) return;
    toastText.textContent =
      kind === 'remove' ? toast.dataset.textRemoved : toast.dataset.textAdded;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  const renderFavorites = () => {
    favButtons.forEach((button) => {
      const active = favorites.includes(button.dataset.url);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.setAttribute(
        'aria-label',
        active ? button.dataset.labelRemove : button.dataset.labelAdd,
      );
    });
  };

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fav-btn]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const url = button.dataset.url;
    const wasFavorite = favorites.includes(url);
    favorites = wasFavorite
      ? favorites.filter((item) => item !== url)
      : [...favorites, url];

    saveFavorites();
    renderFavorites();

    // Надпись говорит о результате клика: пост добавлен — или удалён из
    // избранного. Гаснет сама, постоянно на карточке ничего не висит.
    showFavToast(wasFavorite ? 'remove' : 'add');

    // В режиме избранного снятие сердечка должно сразу убрать карточку —
    // иначе она останется в ленте до следующего фильтра.
    if (state.favorites) apply();
  });

  favToggle?.addEventListener('click', () => {
    state.favorites = !state.favorites;
    favToggle.classList.toggle('is-active', state.favorites);
    favToggle.setAttribute('aria-pressed', state.favorites ? 'true' : 'false');
    apply();
  });

  renderFavorites();

  // --- sticky search --------------------------------------------------------
  // The gradient under the bar only fades in once it has actually detached,
  // which is why this is measured rather than assumed. Порог берём из CSS
  // (top панели, 12px): прилипшая панель застывает именно на этом значении,
  // а не на нуле, поэтому сравнение с 0 не давало класс is-sticky и градиент
  // под поиском не появлялся.

  if (filters) {
    let limit = 0;
    const measure = () => {
      const offset = parseFloat(getComputedStyle(filters).top);
      limit = Number.isFinite(offset) ? offset + 1 : 0;
    };
    const onScroll = () => {
      filters.classList.toggle('is-sticky', filters.getBoundingClientRect().top <= limit);
    };

    measure();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      onScroll();
    }, { passive: true });
  }
})();

// Share row on post pages. The Telegram button is a plain link; "copy link"
// uses the clipboard API, falls back to execCommand on older/insecure
// contexts, and swaps its label for a couple of seconds as feedback.

(() => {
  const button = document.querySelector('[data-copy-link]');
  if (!button) return;

  const label = button.querySelector('[data-copy-label]');
  const original = label ? label.textContent : '';
  const copied = button.dataset.copied || 'Copied!';
  let reset = 0;

  const fallbackCopy = (text) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
    } catch {
      // Браузер отказал — остаётся ручное копирование из адресной строки.
    }
    area.remove();
  };

  button.addEventListener('click', async () => {
    const url = button.dataset.url || window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      fallbackCopy(url);
    }

    if (label) label.textContent = copied;
    button.classList.add('is-copied');
    clearTimeout(reset);
    reset = setTimeout(() => {
      button.classList.remove('is-copied');
      if (label) label.textContent = original;
    }, 2000);
  });
})();

// Floating "back to top" button on post pages: appears once the reader is
// 400px down the article, smooth-scrolls to the top unless the user prefers
// reduced motion. Renders only in page.html, so the query guard is enough.

(() => {
  const button = document.querySelector('[data-to-top]');
  if (!button) return;

  const LIMIT = 400;
  let ticking = false;

  const sync = () => {
    ticking = false;
    button.classList.toggle('is-visible', window.scrollY > LIMIT);
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  }, { passive: true });

  sync();

  button.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();

// Featured morph fallback.
//
// The rounding of the hero photo is a scroll-driven animation
// (animation-timeline: scroll(), see main.css). Firefox before 156, Safari
// before 26 and browsers built on older engines (e.g. Zen) fail the
// @supports check there, so the photo stays full-bleed with square corners.
// Here the same 0..1 progress over the first 60svh of scroll is computed on
// the main thread and written to --featured-morph, which the base CSS rules
// already consume. Where the native animation exists this script does
// nothing, so the two paths never fight over the same properties.

(() => {
  if (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('animation-timeline', 'scroll()')
  ) {
    return;
  }

  if (!document.querySelector('.featured-media')) return;

  // animation-range: 0 60svh in CSS; innerHeight is the closest JS
  // equivalent of svh and the few-pixel difference never shows.
  const RANGE = 0.6;

  let frame = 0;
  const update = () => {
    frame = 0;
    const limit = window.innerHeight * RANGE;
    const progress = limit > 0 ? window.scrollY / limit : 0;
    const clamped = Math.min(Math.max(progress, 0), 1);
    document.documentElement.style.setProperty('--featured-morph', String(clamped));
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  update();
})();