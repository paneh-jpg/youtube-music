export function initCustomScrolling() {
  const containerSelector = [
    ".js-album-list-container",
    ".js-video-list-container",
    ".js-chip-list-container",
    ".js-playlist-list-container",
    ".js-song-list-container",
    ".js-quick-pick-list-container",
    ".js-featured-container",
    ".js-more-pick-container",
    ".js-lines-container",
    ".js-moods-and-genres-container",
    ".js-listened-list-container",
  ].join(", ");

  document.querySelectorAll("section").forEach((section) => {
    const container = section.querySelector(containerSelector);
    const prevBtn = section.querySelector(".swiper-button-prev");
    const nextBtn = section.querySelector(".swiper-button-next");

    if (!container || !prevBtn || !nextBtn) return;
    if (container.dataset.hsInited === "1") return;
    container.dataset.hsInited = "1";

    setupHorizontalScroll(container, prevBtn, nextBtn);
  });
}

function setupHorizontalScroll(container, prevBtn, nextBtn) {
  const EPS = 20;
  const DISABLED_CLASS = "is-disabled";

  const setDisabled = (btn, disabled) => {
    btn.classList.toggle(DISABLED_CLASS, disabled);
    btn.setAttribute("aria-disabled", String(disabled));
    btn.style.pointerEvents = disabled ? "none" : "";
    if (btn instanceof HTMLButtonElement) btn.disabled = disabled;
  };

  const updateButtons = () => {
    const left = container.scrollLeft;
    const visible = container.clientWidth;
    const total = container.scrollWidth;

    setDisabled(prevBtn, left <= EPS);
    setDisabled(nextBtn, left + visible >= total - EPS);
  };

  const scrollStep = (dir) => {
    container.scrollBy({
      left: Math.round(container.clientWidth * 0.7) * dir,
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", () => scrollStep(-1));
  nextBtn.addEventListener("click", () => scrollStep(1));

  container.addEventListener("scroll", updateButtons, { passive: true });

  new MutationObserver(updateButtons).observe(container, {
    childList: true,
    subtree: true,
  });

  updateButtons();
}
