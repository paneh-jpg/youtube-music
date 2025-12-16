import { getAlbumBySlug } from "../api/exploreApi.js";
import { Header, initHeader } from "../components/layout/Header.js";
import { Panel, initPanel } from "../components/layout/Panel.js";
import { PlayerControl } from "../components/layout/PlayerControl.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";
import { VideoArea } from "../components/layout/VideoArea.js";
import { MusicPlayer } from "../modules/MusicPlayer.js";

export function SongDetailPage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  
      ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-screen ">
        <main id="mainContent" class="mt-6 ml-10 mr-10" >
          <!--  MAIN LAYOUT  -->
           <div class="h-[70vh] pb-5">
           <div class="mx-auto max-w-350 h-full max-h-full min-h-0
            overflow-y-auto overflow-x-auto custom-scrollbar
          pt-4
            grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
                ${VideoArea()}
                ${Panel()}
                ${PlayerControl()}
        </main>
      </div>
    </div>
  `;
}

export async function initSongDetailPage() {
  initHeader();
  initSidebar();
  initPanel();

  const response = await getAlbumBySlug(albumSlug);
  const tracks = response.data.tracks;
}

export async function initSongDetailContent({ songId, albumSlug }) {
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

  const response = await getAlbumBySlug(albumSlug);
  const tracks = response.data.tracks;

  // Khởi tạo player
  const player = new MusicPlayer({
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

    // Data
    tracks: tracks,
    initialSongId: songId,
  });
}
