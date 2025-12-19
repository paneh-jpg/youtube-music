import { getVideoById } from "../api/exploreApi.js";
import { Panel, initPanel } from "../components/layout/Panel.js";
import { VideoArea } from "../components/layout/VideoArea.js";

export function VideoDetailPage() {
  return `
    <!--  MAIN LAYOUT  -->
    <div class="h-[75vh] pb-5">
         <div class="mx-auto max-w-350 h-full max-h-full min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar pt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
                ${VideoArea(false)}
                ${Panel()}
         </div>
    </div>
  `;
}

export async function initVideoDetailPage({ videoId, contextSlug } = {}) {
  initPanel();
}

export async function initVideoDetailContent({ videoId }) {
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

  const videoIframe = document.querySelector("#videoIframe");
  const response = await getVideoById(videoId);

  let tracks = response.data.related;
  videoIframe.src = `https://www.youtube.com/embed/${response.data.videoId}?autoplay=1&rel=0&playsinline=1`;
}
