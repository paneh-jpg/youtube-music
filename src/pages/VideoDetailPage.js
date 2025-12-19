import { getVideoById } from "../api/exploreApi.js";
import { Panel, initPanel } from "../components/layout/Panel.js";
import { VideoArea } from "../components/layout/VideoArea.js";
import { VideoControl } from "../components/layout/VideoControl.js";
import { getOrCreateMusicPlayer } from "../modules/playerSingleton.js";
export function VideoDetailPage() {
  return `
    <!--  MAIN LAYOUT  -->
    <div class="h-[70vh] pb-5">
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
  const videoIframe = document.querySelector("#videoIframe");
  const response = await getVideoById(videoId);
  videoIframe.src = `https://www.youtube.com/embed/${response.data.videoId}?autoplay=1&rel=0&playsinline=1`;
}
