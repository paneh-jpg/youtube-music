import { getAlbumBySlug, getSongById } from "../api/exploreApi.js";
import { getPLaylistBySlug } from "../api/homeApi.js";
import { Panel, initPanel } from "../components/layout/Panel.js";

import { VideoArea } from "../components/layout/VideoArea.js";
import { getOrCreateMusicPlayer } from "../modules/playerSingleton.js";
import { hideLoading, showLoading } from "../utils/loading.js";
import { mergeSongWithAlbumTracks } from "../utils/utils.js";

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

export async function initSongDetailPage({ songId, contextSlug } = {}) {
  initPanel();
}

export async function initSongDetailContent({ songId, contextSlug, type }) {
  const audio = document.querySelector("#audio");
  const currentTrackNameEl = document.querySelector(".js-current-track-name");
  const currentTrackThumbEl = document.querySelector(".js-thumb");
  const songImg = document.querySelector(".main-img");
  const playBtn = document.querySelector(".js-play");
  const progress = document.querySelector(".js-progress");
  const nextBtn = document.querySelector(".js-next");
  const prevBtn = document.querySelector(".js-prev");
  const repeatBtn = document.querySelector(".js-repeat");
  const shuffleBtn = document.querySelector(".js-shuffle");
  const currentTime = document.querySelector(".js-current-time");
  const durationTime = document.querySelector(".js-duration-time");
  const randomBtn = document.querySelector(".js-shuffle");
  const queueListContainer = document.querySelector(".js-queue-list");
  const songTitle = document.querySelector(".js-title");

  const volumeEl = document.querySelector(".js-volume");
  const volumeBtn = document.querySelector(".js-volume-btn");
  const volumeIconEl = document.querySelector(".js-volume-icon");

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

  // Khởi tạo player
  getOrCreateMusicPlayer({
    // Elements
    audioEl: audio,
    currentTrackNameEl: currentTrackNameEl,
    currentTrackThumbEl: currentTrackThumbEl,
    songImgEl: songImg,
    playBtn: playBtn,
    progressEl: progress,
    nextBtn: nextBtn,
    prevBtn: prevBtn,
    repeatBtn: repeatBtn,
    shuffleBtn: shuffleBtn,
    durationTimeEl: durationTime,
    currentTimeEl: currentTime,
    songTitleEl: songTitle,
    randomBtn: randomBtn,
    queueListContainer: queueListContainer,
    volumeBtn: volumeBtn,
    volumeEl: volumeEl,
    volumeIconEl: volumeIconEl,

    // Data
    tracks: tracks,
    initialSongId: songId,
  });
}
