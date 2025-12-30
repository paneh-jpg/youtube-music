import { initVideoDetailContent } from "../pages/VideoDetailPage";
import { VideoDetailShell } from "../components/layout/VideoDetailUI.js";
import { stopAllMedia, destroyVideoPlayer } from "./playerSingleton.js";

export function openVideoDetail({ videoId } = {}) {
  const videoDetailRoot = document.querySelector("#video-detail-root");
  if (!videoDetailRoot) return;
  let videoDetailEl = videoDetailRoot.querySelector(".js-video-detail");

  if (!videoDetailEl) {
    videoDetailEl = VideoDetailShell();
    videoDetailRoot.appendChild(videoDetailEl);
  }

  const videoDetailWrapEl = document.querySelector(".js-video-detail-wrapper");
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  const leftOffset =
    desktopSidebarState === "collapsed" ? "ml-[130px]" : "ml-[300px]";

  videoDetailWrapEl.classList.add(leftOffset);

  videoDetailEl.classList.remove("is-mini");
  videoDetailEl.classList.remove("hidden");
  const videoContainer = document.querySelector(".js-video-container");
  videoContainer.className = "js-video-container relative h-[76vh] bg-black";

  initVideoDetailContent({ videoId });
}

export function closeVideoDetail({ remove = false } = {}) {
  const videoDetailRoot = document.querySelector("#video-detail-root");
  const videoDetailEl = videoDetailRoot?.querySelector(".js-video-detail");
  if (!videoDetailEl) return;

  // thoát mini khi đóng
  videoDetailEl.classList.remove("is-mini");
  videoDetailEl.classList.add("hidden");

  // Dừng video khi đóng (tránh hidden mà vẫn phát)
  stopAllMedia();

  // remove khỏi DOM
  if (remove) {
    videoDetailEl.remove();
    // Remove khỏi DOM thì destroy YT player
    destroyVideoPlayer();
  }
}

export function toggleVideoDetailMini() {
  const videoDetailEl = document.querySelector(".js-video-detail");
  const videoContainer = document.querySelector(".js-video-container");
  const videoDetailWrapEl = document.querySelector(".js-video-detail-wrapper");

  if (!videoDetailEl || !videoContainer) return;
  if (videoDetailEl.classList.contains("hidden")) return;

  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  const leftOffset =
    desktopSidebarState === "collapsed" ? "ml-[130px]" : "ml-[300px]";

  videoDetailWrapEl.classList.toggle(leftOffset);

  // Toggle state
  videoDetailEl.classList.toggle("is-mini");

  const isMini = videoDetailEl.classList.contains("is-mini");

  videoContainer.className = isMini
    ? "js-video-container absolute inset-0 bg-black"
    : "js-video-container relative h-[76vh] bg-black";

  const iframe = videoDetailEl.querySelector("iframe");
  iframe?.style.setProperty("width", "100%");
  iframe?.style.setProperty("height", "100%");
}

export function initVideoDetailManager() {
  document.addEventListener(
    "click",
    (event) => {
      const videoDetailEl = document.querySelector(".js-video-detail");
      if (!videoDetailEl) return;

      const isOpen = !videoDetailEl.classList.contains("hidden");
      const isMini = videoDetailEl.classList.contains("is-mini");

      // Nút X
      if (event.target.closest(".js-video-detail-close")) {
        closeVideoDetail(); // chỉ hidden, KHÔNG remove
        return;
      }

      // Nút PiP
      if (event.target.closest(".js-video-mini-btn")) {
        toggleVideoDetailMini();
        return;
      }

      // Chỉ xử lý khi FULL
      if (!isOpen || isMini) return;

      // Click player control thì bỏ qua
      if (
        event.target.closest("#player-root") ||
        event.target.closest(".js-player-control") ||
        event.target.closest(".js-player")
      ) {
        return;
      }

      // Click trong video / panel thì bỏ qua
      if (event.target.closest(".js-video-detail-video")) return;
      if (event.target.closest(".js-video-detail-panel")) return;

      // Click ngoài => mini
      toggleVideoDetailMini();
    },
    true // capture
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeVideoDetail();
  });
}
