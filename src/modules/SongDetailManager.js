import { initSongDetailContent } from "../pages/SongDetailPage.js";
import { SongDetailShell } from "../components/layout/SongDetailUI.js";

let isMini = false;

export function toggleFloatingVideo() {
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  const leftOffset =
    desktopSidebarState === "collapsed" ? "ml-[130px]" : "ml-[300px]";

  const songDetailEl = document.querySelector(".js-song-detail");
  const songDetailWrapEl = document.querySelector(".js-song-detail-wrapper");

  songDetailWrapEl.classList.toggle(leftOffset);

  if (!songDetailEl) return;

  isMini = !isMini;
  songDetailEl.classList.toggle("is-mini", isMini);
}

export function openSongDetail({ songId, contextSlug, type } = {}) {
  const songDetailRoot = document.querySelector("#song-detail-root");
  if (!songDetailRoot) return;

  let songDetailEl = songDetailRoot.querySelector(".js-song-detail");

  if (!songDetailEl) {
    songDetailEl = SongDetailShell();
    songDetailRoot.appendChild(songDetailEl);
  }

  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  const leftOffset =
    desktopSidebarState === "collapsed" ? "ml-[130px]" : "ml-[300px]";

  const songDetailWrapEl = document.querySelector(".js-song-detail-wrapper");
  songDetailWrapEl.classList.add(leftOffset);

  songDetailEl.classList.remove("hidden");
  songDetailEl.classList.remove("is-mini");
  isMini = false;

  initSongDetailContent({ songId, contextSlug, type });
}
export function closeSongDetail(remove = false) {
  const songDetailEl = document.querySelector(".js-song-detail");
  if (!songDetailEl) return;

  songDetailEl.classList.add("hidden");
  songDetailEl.classList.remove("is-mini");
  isMini = false;

  if (remove) {
    const songDetailRoot = document.querySelector("#song-detail-root");
    songDetailRoot.removeChild(songDetailEl);
  }
}

export function initSongDetailManager() {
  document.addEventListener(
    "click",
    (event) => {
      const songDetailEl = document.querySelector(".js-song-detail");
      if (!songDetailEl) return;

      const isOpen = !songDetailEl.classList.contains("hidden");
      const isMini = songDetailEl.classList.contains("is-mini");

      // Nút X
      if (event.target.closest(".js-song-detail-close")) {
        const songDetailRoot = document.querySelector("#song-detail-root");
        songDetailRoot.removeChild(songDetailEl);
        closeSongDetail();
        return;
      }

      // Nút PiP
      if (event.target.closest(".js-video-mini-btn")) {
        toggleFloatingVideo();
        return;
      }

      // Chỉ xử lý khi đang FULL
      if (!isOpen || isMini) return;

      //  click playerControl thì bỏ qua
      if (
        event.target.closest("#player-root") ||
        event.target.closest(".js-player-control") ||
        event.target.closest(".js-player")
      ) {
        return;
      }

      // Click trong video/panel thì bỏ qua
      if (event.target.closest(".js-song-detail-video")) return;
      if (event.target.closest(".js-song-detail-panel")) return;

      // Click ngoài song detail => mini
      toggleFloatingVideo();
    },
    true // capture phase
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSongDetail();
  });
}
