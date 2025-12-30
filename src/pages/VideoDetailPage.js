import { getVideoById } from "../api/exploreApi.js";
import { initPanel, Panel } from "../components/layout/Panel.js";
import { VideoArea } from "../components/layout/VideoArea.js";
import { closeSongDetail } from "../modules/SongDetailManager.js";
import { getOrCreateUnifiedPlayer } from "../modules/playerSingleton.js";
import { hideLoading, showLoading } from "../utils/loading.js";

// khởi tạo trang chi tiết video
export function VideoDetailPage() {
  return `
    <div class="pb-5 -mt-7 overflow-hidden">
      <div class="mx-auto w-full overflow-hidden">
        <div class="h-[80vh] pb-5">
          <div class="mx-auto max-w-350 h-full min-h-0 pt-4
                      grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 overflow-hidden">
            ${VideoArea(false)}
            ${Panel()}
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initVideoDetailPage() {
  initPanel();
}

// khởi tạo nội dung chi tiết video
export async function initVideoDetailContent({ videoId }) {
  const songDetailEl = document.querySelector(".js-song-detail");
  if (songDetailEl) {
    closeSongDetail({ remove: true });
  }

  // Dọn iframe cũ (nếu có)
  const oldIframe = document.querySelector("#videoIframe iframe");
  oldIframe?.remove();

  const playerBarEl = document.querySelector(".player-bar");
  const playBtnEl = document.querySelector(".js-play");
  const nextBtnEl = document.querySelector(".js-next");
  const prevBtnEl = document.querySelector(".js-prev");
  const progressEl = document.querySelector(".js-progress");
  const repeatBtnEl = document.querySelector(".js-repeat");
  const shuffleBtnEl = document.querySelector(".js-shuffle");
  const currentTimeEl = document.querySelector(".js-current-time");
  const durationTimeEl = document.querySelector(".js-duration-time");
  const queueListEl = document.querySelector(".js-queue-list");
  const titleEl = document.querySelector(".js-title");
  const metaEl = document.querySelector(".js-meta");
  const thumbEl = document.querySelector(".js-thumb");
  const volumeEl = document.querySelector(".js-volume");
  const volumeBtnEl = document.querySelector(".js-volume-btn");
  const volumeIconEl = document.querySelector(".js-volume-icon");

  playerBarEl?.classList.remove("player-hidden");

  try {
    showLoading();

    // Lấy dữ liệu video
    const res = await getVideoById(videoId);
    const current = res.data;
    const related = Array.isArray(res.data?.related) ? res.data.related : [];

    const tracks = [
      current,
      ...related.filter((t) => t?.videoId !== current?.videoId),
    ];
    const initialId = current?.videoId;

    // Khởi tạo / cập nhật UnifiedPlayer (Video)
    const player = getOrCreateUnifiedPlayer({
      playerBarEl,
      playBtnEl,
      nextBtnEl,
      prevBtnEl,
      progressEl,
      repeatBtnEl,
      shuffleBtnEl,
      currentTimeEl,
      durationTimeEl,
      titleEl,
      metaEl,
      thumbEl,
      queueListEl,
      volumeEl,
      volumeBtnEl,
      volumeIconEl,
    });

    // Set queue + autoplay
    player.setQueue({
      mode: "video",
      tracks,
      initialId,
      ytHostId: "videoIframe",
    });
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      hideLoading();
    }, 500);
  }
}
