/**
 * Khởi tạo chức năng cuộn ngang tùy chỉnh cho tất cả các SectionHeader
 */
export function initCustomScrolling() {
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    const scrollContainer = section.querySelector(
      ".js-album-list-container, .js-video-list-container, .js-chip-list-container, .js-playlist-list-container, .js-song-list-container, .js-quick-pick-list-container, .js-featured-container, .js-more-pick-container"
    );
    const prevButton = section.querySelector(".swiper-button-prev");
    const nextButton = section.querySelector(".swiper-button-next");

    if (!scrollContainer || !prevButton || !nextButton) return;

    if (scrollContainer.dataset.hsInited === "1") return; // ✅ chặn init lặp
    scrollContainer.dataset.hsInited = "1";

    handleHorizontalScroll(scrollContainer, prevButton, nextButton);
  });
}

function handleHorizontalScroll(container, prevBtn, nextBtn) {
  const DISABLED_CLASS = "is-disabled";
  const EPS = 20;

  const setDisabled = (btn, disabled) => {
    btn.classList.toggle(DISABLED_CLASS, disabled);

    if (btn instanceof HTMLButtonElement) btn.disabled = disabled;

    btn.setAttribute("aria-disabled", String(disabled));
    btn.style.pointerEvents = disabled ? "none" : "";
  };

  const updateNavState = () => {
    // làm tròn lên để tránh lệch 0.x px
    const left = Math.ceil(container.scrollLeft);
    const visible = Math.ceil(container.clientWidth);
    const total = Math.ceil(container.scrollWidth);

    const atStart = left <= EPS;
    const atEnd = left + visible >= total - EPS; // ✅ check mép phải

    setDisabled(prevBtn, atStart);
    setDisabled(nextBtn, atEnd);
  };

  const scrollByAmount = (dir) => {
    const amount = Math.round(container.clientWidth * 0.7) * dir;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  prevBtn.addEventListener("click", () => scrollByAmount(-1));
  nextBtn.addEventListener("click", () => scrollByAmount(1));

  container.addEventListener("scroll", updateNavState, { passive: true });

  // cập nhật khi list bên trong render xong / thay đổi
  new MutationObserver(updateNavState).observe(container, {
    childList: true,
    subtree: true,
  });

  updateNavState();
}
