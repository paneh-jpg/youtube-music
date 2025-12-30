import { getAlbumBySlug, getSongById } from "../api/exploreApi.js";
import { getPLaylistBySlug } from "../api/homeApi.js";
import { Panel, initPanel } from "../components/layout/Panel.js";

import { VideoArea } from "../components/layout/VideoArea.js";
import { getOrCreateUnifiedPlayer } from "../modules/playerSingleton.js";
import { hideLoading, showLoading } from "../utils/loading.js";
import { mergeSongWithAlbumTracks } from "../utils/utils.js";

import { closeVideoDetail } from "../modules/VideoDetailManager.js";

export function SongDetailPage() {
  return `
     <!-- Main content -->
     <div class="h-[80vh] pb-5">
        <div class="mx-auto max-w-350 h-full max-h-full min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar pt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
          ${VideoArea()}
          ${Panel()}  
        </div>
     </div>
  `;
}

export async function initSongDetailContent({ songId, contextSlug, type }) {
  const videoPlayer = document.querySelector("#video-detail-root");
  if (videoPlayer) {
    closeVideoDetail({ remove: true });
  }

  // Lấy đúng elements trước khi querySelector (tránh null khi page chưa mount)
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
  const mainImgEl = document.querySelector(".main-img");

  playerBarEl?.classList.remove("player-hidden");

  let response;
  let tracks = [];
  if (contextSlug) {
    if (type === "album") {
      try {
        showLoading();
        response = await getAlbumBySlug(contextSlug);
        tracks = response.data.tracks;
      } catch (error) {
      } finally {
        setTimeout(() => {
          hideLoading();
        }, 700);
      }
    } else {
      try {
        showLoading();
        response = await getPLaylistBySlug(contextSlug);
        tracks = response.data.tracks;
      } catch (error) {
        console.log(error.message);
      } finally {
        setTimeout(() => {
          hideLoading();
        }, 700);
      }
    }
  } else {
    try {
      showLoading();
      response = await getSongById(songId);
      tracks = mergeSongWithAlbumTracks(response.data, response.data.related);
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        hideLoading();
      }, 800);
    }
  }

  // Khởi tạo / cập nhật UnifiedPlayer (Audio)
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
    mainImgEl,
  });

  // Set queue + autoplay (nếu đang phát video thì sẽ dừng video trước)
  player.setQueue({ mode: "audio", tracks, initialId: songId });
}
