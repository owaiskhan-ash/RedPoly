const grid = document.getElementById('issue-grid');
const issueCount = document.getElementById('issue-count');
const dialog = document.getElementById('story-reader');
const readerImage = document.getElementById('reader-image');
const readerTitle = document.getElementById('reader-title');
const readerIssueLabel = document.getElementById('reader-issue-label');
const readerPageCount = document.getElementById('reader-page-count');
const readerProgress = document.getElementById('reader-progress-bar');
const closeButton = document.getElementById('reader-close');
const prevButtons = [document.getElementById('reader-prev'), document.getElementById('reader-prev-label')];
const nextButtons = [document.getElementById('reader-next'), document.getElementById('reader-next-label')];
const readerStage = document.getElementById('reader-stage');
const readerShop = document.getElementById('reader-shop');
const readerShopItems = document.getElementById('reader-shop-items');
const readerFigure = document.getElementById('reader-figure');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const zoomLevelButton = document.getElementById('zoom-level');

let catalog = [];
let activeIssue = null;
let activeManifest = null;
let activePage = 0;
let opener = null;
let touchStartX = null;
const manifestRequests = new Map();
const prefetchedPages = new Set();

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function getIssueManifest(issue) {
  if (!manifestRequests.has(issue.id)) {
    const request = fetch(issue.manifest).then(response => {
      if (!response.ok) throw new Error(`Issue data returned ${response.status}`);
      return response.json();
    }).catch(error => {
      manifestRequests.delete(issue.id);
      throw error;
    });
    manifestRequests.set(issue.id, request);
  }
  return manifestRequests.get(issue.id);
}

function prefetchNextPage() {
  if (!activeManifest || activePage >= activeManifest.pages.length - 1) return;
  const src = activeManifest.pages[activePage + 1].image;
  if (prefetchedPages.has(src)) return;
  prefetchedPages.add(src);
  const image = new Image();
  image.decoding = 'async';
  image.fetchPriority = 'low';
  image.src = src;
}

function partLabel(issue) {
  return issue.part ? ` · PART ${issue.part}` : '';
}

function getNextPart() {
  if (!activeIssue.part) return null;
  return catalog.find(issue => issue.number === activeIssue.number && issue.part === activeIssue.part + 1);
}

function renderIssueCard(issue) {
  const title = issue.part ? `${issue.title}, Part ${issue.part}` : issue.title;
  const article = make('article', 'issue-card');
  const button = make('button', 'issue-card__open');
  button.type = 'button';
  button.setAttribute('aria-label', `Read Issue ${issue.number}: ${title}`);

  const cover = make('span', 'issue-card__cover');
  const image = make('img');
  image.src = issue.cover;
  image.alt = `Preview artwork for REDPOLY Issue ${issue.number}: ${title}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.fetchPriority = 'low';
  cover.append(image, make('span', 'issue-card__number', `ISSUE ${issue.number}${partLabel(issue)}`), make('span', 'issue-card__cover-label', issue.label || `ISSUE ${issue.number}`));

  const body = make('span', 'issue-card__body');
  body.append(make('span', 'issue-card__eyebrow', `REDPOLY COMICS · NO. ${issue.number}`));
  body.append(make('h3', 'issue-card__title', issue.title));
  body.append(make('span', 'issue-card__description', issue.subtitle));
  const meta = make('span', 'issue-card__meta');
  meta.append(make('span', '', `${issue.pageCount} COMIC PAGES`), make('span', '', `${issue.panelCount} PANELS`));
  body.append(meta);
  const cta = make('span', 'issue-card__cta');
  cta.append(make('span', '', issue.status || `READ ISSUE ${issue.number}`), make('b', '', '↗'));
  body.append(cta);
  button.append(cover, body);
  button.addEventListener('click', () => openIssue(issue, 0, button));
  article.append(button);
  return article;
}

function renderCatalog(items) {
  grid.replaceChildren();
  if (!items.length) {
    grid.append(make('p', 'shelf-status', 'A new story is on its way. Check back after the next splash.'));
    issueCount.textContent = 'MORE ISSUES COMING SOON';
    return;
  }
  items.forEach(issue => grid.append(renderIssueCard(issue)));
  const count = new Set(items.map(issue => issue.number)).size;
  issueCount.textContent = count === 1 ? `ISSUE ${items[0].number} · PICK A STORY` : `${count} ISSUES · PICK A STORY`;
}

function updateShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('issue', activeIssue.id);
  url.searchParams.set('page', String(activePage + 1));
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function renderShop(page) {
  const items = Array.isArray(page.shop) ? page.shop : [];
  readerShopItems.replaceChildren();
  if (!items.length) {
    readerShop.hidden = true;
    return;
  }
  items.forEach(item => {
    const link = make('a', 'reader-shop__item');
    link.href = item.href;
    link.setAttribute('aria-label', `Shop ${item.name}, seen on this page`);
    const thumb = make('img');
    thumb.src = item.image;
    thumb.alt = '';
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    thumb.width = 30;
    thumb.height = 30;
    link.append(thumb, make('span', 'reader-shop__name', item.name), make('b', 'reader-shop__cta', '↗'));
    readerShopItems.append(link);
  });
  readerShop.hidden = false;
}

function renderPage() {
  if (!activeManifest) return;
  const page = activeManifest.pages[activePage];
  const current = activePage + 1;
  const total = activeManifest.pages.length;
  const pageNumber = String(current).padStart(2, '0');
  const lastPage = current === total;
  const nextPart = lastPage ? getNextPart() : null;

  readerImage.alt = page.alt || `${activeManifest.title}, page ${current}`;
  readerImage.decoding = 'async';
  readerImage.fetchPriority = 'high';
  readerImage.onload = prefetchNextPage;
  resetZoom();
  readerImage.src = page.image;
  readerPageCount.textContent = `PAGE ${pageNumber} / ${String(total).padStart(2, '0')}`;
  readerProgress.style.width = `${(current / total) * 100}%`;
  prevButtons.forEach(button => { button.disabled = activePage === 0; });
  nextButtons.forEach(button => {
    button.disabled = lastPage && !nextPart;
    button.setAttribute('aria-label', nextPart ? `Continue to Part ${nextPart.part}` : 'Next page');
  });
  nextButtons[1].textContent = nextPart ? `PART ${nextPart.part} →` : 'NEXT PAGE →';
  renderShop(page);
}

async function openIssue(issue, pageIndex = 0, trigger = null) {
  if (!issue) return;
  opener = trigger || opener;
  try {
    activeManifest = await getIssueManifest(issue);
    activeIssue = issue;
    activePage = Math.min(Math.max(pageIndex, 0), activeManifest.pages.length - 1);
    readerTitle.textContent = activeManifest.title;
    readerIssueLabel.textContent = `REDPOLY COMICS · ISSUE ${activeManifest.number}${partLabel(issue)}`;
    renderPage();
    if (!dialog.open) dialog.showModal();
    updateShareUrl();
    closeButton.focus();
  } catch (error) {
    console.error('Could not open comic issue:', error);
    grid.prepend(make('p', 'shelf-status shelf-status--error', 'This issue did not load. Please try again in a moment.'));
  }
}

function goToPage(index) {
  if (!activeManifest || index < 0) return;
  if (index >= activeManifest.pages.length) {
    openIssue(getNextPart());
    return;
  }
  activePage = index;
  renderPage();
  updateShareUrl();
}

function closeReader() {
  if (dialog.open) dialog.close();
  const url = new URL(window.location.href);
  url.searchParams.delete('issue');
  url.searchParams.delete('page');
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  if (opener && document.contains(opener)) opener.focus();
}

prevButtons.forEach(button => button.addEventListener('click', () => goToPage(activePage - 1)));
nextButtons.forEach(button => button.addEventListener('click', () => goToPage(activePage + 1)));
closeButton.addEventListener('click', closeReader);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeReader(); });
dialog.addEventListener('click', event => { if (event.target === dialog) closeReader(); });
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); goToPage(activePage + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); goToPage(activePage - 1); }
});
// ---- Zoom and pan -------------------------------------------------------
// One finger swipes pages, two fingers pinch to zoom, and while magnified a
// single finger drags the page around instead of turning it.
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
let zoom = 1;
let panX = 0;
let panY = 0;
const points = new Map();
let pinchStartDistance = 0;
let pinchStartZoom = 1;
let dragStart = null;
let lastTap = { time: 0, x: 0, y: 0 };

function applyZoom(animate) {
  if (!readerImage) return;
  if (animate === false) readerFigure.classList.add('is-zoomed');
  else readerFigure.classList.toggle('is-zoomed', zoom > 1.001);
  readerImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  if (zoomLevelButton) zoomLevelButton.textContent = zoom > 1.001 ? `${Math.round(zoom * 100)}%` : 'FIT';
  if (zoomInButton) zoomInButton.disabled = zoom >= ZOOM_MAX - 0.001;
  if (zoomOutButton) zoomOutButton.disabled = zoom <= ZOOM_MIN + 0.001;
  readerFigure.classList.toggle('is-zoomed', zoom > 1.001);
}

// Keep the dragged page from leaving its own bounds.
function clampPan() {
  if (zoom <= 1.001) { panX = 0; panY = 0; return; }
  const rect = readerFigure.getBoundingClientRect();
  const img = readerImage.getBoundingClientRect();
  const limitX = Math.max(0, (img.width - rect.width) / 2);
  const limitY = Math.max(0, (img.height - rect.height) / 2);
  panX = Math.min(limitX, Math.max(-limitX, panX));
  panY = Math.min(limitY, Math.max(-limitY, panY));
}

function setZoom(next, originX, originY, animate) {
  const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
  if (originX !== undefined && zoom > 0) {
    // keep the point under the fingers or cursor steady while scaling
    const ratio = clamped / zoom;
    panX = originX - (originX - panX) * ratio;
    panY = originY - (originY - panY) * ratio;
  }
  zoom = clamped;
  if (zoom <= 1.001) { zoom = 1; panX = 0; panY = 0; }
  clampPan();
  applyZoom(animate);
}

function panBy(dx, dy) {
  if (zoom <= 1.001) return;
  panX += dx;
  panY += dy;
  clampPan();
  applyZoom(false);
}

function zoomBy(step) {
  if (!readerImage) return;
  setZoom(zoom + step);
}

function resetZoom() {
  zoom = 1; panX = 0; panY = 0;
  applyZoom();
}

function pointFromEvent(event) {
  const rect = readerFigure.getBoundingClientRect();
  return { x: event.clientX - (rect.left + rect.width / 2), y: event.clientY - (rect.top + rect.height / 2) };
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

readerFigure.addEventListener('pointerdown', event => {
  readerFigure.setPointerCapture(event.pointerId);
  points.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (points.size === 2) {
    const [first, second] = [...points.values()];
    pinchStartDistance = distanceBetween(first, second);
    pinchStartZoom = zoom;
    dragStart = null;
  } else if (points.size === 1) {
    dragStart = { x: event.clientX, y: event.clientY, panX, panY };
  }
});

readerFigure.addEventListener('pointermove', event => {
  if (!points.has(event.pointerId)) return;
  points.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (points.size >= 2 && pinchStartDistance > 0) {
    const [first, second] = [...points.values()];
    const ratio = distanceBetween(first, second) / pinchStartDistance;
    const midpoint = pointFromEvent({ clientX: (first.x + second.x) / 2, clientY: (first.y + second.y) / 2 });
    setZoom(pinchStartZoom * ratio, midpoint.x, midpoint.y, false);
    return;
  }
  if (dragStart && zoom > 1.001) {
    panX = dragStart.panX + (event.clientX - dragStart.x);
    panY = dragStart.panY + (event.clientY - dragStart.y);
    clampPan();
    applyZoom(false);
    readerFigure.classList.add('is-panning');
  }
});

function endPointer(event) {
  if (!points.has(event.pointerId)) return;
  const wasSingle = points.size === 1;
  points.delete(event.pointerId);
  readerFigure.classList.remove('is-panning');
  if (points.size < 2) pinchStartDistance = 0;

  if (!wasSingle) { dragStart = null; return; }

  const moved = dragStart ? Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y) : 0;
  const startedZoomed = dragStart ? zoom > 1.001 : false;

  // double tap toggles between fit and 2x around the tapped point
  const now = Date.now();
  if (moved < 8) {
    if (now - lastTap.time < 320 && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 40) {
      const point = pointFromEvent(event);
      setZoom(zoom > 1.001 ? 1 : 2, point.x, point.y);
      lastTap.time = 0;
    } else {
      lastTap = { time: now, x: event.clientX, y: event.clientY };
    }
  }

  // horizontal swipe turns the page only when the page is not magnified
  if (moved > 60 && !startedZoomed && zoom <= 1.001) {
    const delta = event.clientX - dragStart.x;
    goToPage(activePage + (delta < 0 ? 1 : -1));
  }
  dragStart = null;
  touchStartX = null;
}
readerFigure.addEventListener('pointerup', endPointer);
readerFigure.addEventListener('pointercancel', endPointer);

// Desktop: wheel or trackpad pinch zooms, ctrl+wheel is the browser pinch signal.
readerStage.addEventListener('wheel', event => {
  if (!readerImage) return;
  if (!(event.ctrlKey || event.metaKey || Math.abs(event.deltaY) > 6)) return;
  event.preventDefault();
  const point = pointFromEvent(event);
  setZoom(zoom * (event.deltaY < 0 ? 1.12 : 0.89), point.x, point.y, false);
}, { passive: false });

zoomInButton.addEventListener('click', () => setZoom(zoom + 0.5));
zoomOutButton.addEventListener('click', () => setZoom(zoom - 0.5));
zoomLevelButton.addEventListener('click', resetZoom);
dialog.addEventListener('keydown', event => {
  if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomBy(0.5); }
  if (event.key === '-' || event.key === '_') { event.preventDefault(); zoomBy(-0.5); }
  if (event.key === '0') { event.preventDefault(); resetZoom(); }
});

async function startStories() {
  try {
    const response = await fetch('/comics/catalog.json');
    if (!response.ok) throw new Error(`Catalog returned ${response.status}`);
    catalog = await response.json();
    renderCatalog(catalog);
    catalog.forEach(issue => { getIssueManifest(issue).catch(() => {}); });
    const params = new URLSearchParams(window.location.search);
    const requestedIssue = catalog.find(issue => issue.id === params.get('issue'));
    if (requestedIssue) {
      const requestedPage = Number(params.get('page'));
      openIssue(requestedIssue, Number.isInteger(requestedPage) ? requestedPage - 1 : 0);
    }
  } catch (error) {
    console.error('Could not load comic catalog:', error);
    grid.replaceChildren(make('p', 'shelf-status shelf-status--error', 'The story shelf could not load. Please refresh to try again.'));
  }
}

startStories();
