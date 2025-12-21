import { getVideoById } from "../api/exploreApi.js";
import { VideoArea } from "../components/layout/VideoArea.js";

export function VideoDetailPage() {
  return `
    <div class="pb-5 -mt-5 overflow-hidden">
      <div class="mx-auto w-full overflow-hidden">
        <div class="h-[calc(100vh-96px)] max-h-[calc(100vh-96px)] overflow-hidden flex items-center justify-center">
          <div class="w-full max-w-275 overflow-hidden">
            ${VideoArea(false)}
          </div>
        </div>

      </div>
    </div>
  `;
}

export async function initVideoDetailPage({ videoId, contextSlug } = {}) {}

export async function initVideoDetailContent({ videoId }) {
  const videoIframe = document.querySelector("#videoIframe");

  const playerControl = document.querySelector(".player-bar");
  const audioEl = document.querySelector("#audio");
  console.log(playerControl);

  playerControl.classList.replace("player-visible", "player-hidden");
  audioEl.pause();

  const response = await getVideoById(videoId);

  let tracks = response.data.related;
  videoIframe.src = `https://www.youtube.com/embed/${response.data.videoId}?autoplay=1&rel=0&playsinline=1`;
}
