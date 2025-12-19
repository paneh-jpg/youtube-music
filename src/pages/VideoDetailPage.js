import { getVideoById } from "../api/exploreApi.js";
import { Header, initHeader } from "../components/layout/Header.js";
import { Panel, initPanel } from "../components/layout/Panel.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";
import { VideoArea } from "../components/layout/VideoArea.js";
import { VideoControl } from "../components/layout/VideoControl.js";
import { getOrCreateMusicPlayer } from "../modules/playerSingleton.js";
export function VideoDetailPage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  
      ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-20 md:ml-64 h-screen ">
        <main id="mainContent" class="mt-6 ml-10 mr-10" >
          <!--  MAIN LAYOUT  -->
           <div class="h-[70vh] pb-5">
           <div class="mx-auto max-w-350 h-full max-h-full min-h-0
            overflow-y-auto overflow-x-auto custom-scrollbar
          pt-4
            grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
                ${VideoArea(false)}
                ${Panel()}
                ${VideoControl()}
        </main>
      </div>
    </div>
  `;
}

export async function initVideoDetailPage({ videoId, contextSlug } = {}) {
  initHeader();
  initSidebar();
  initPanel();
}

export async function initVideoDetailContent({ videoId }) {
  const videoIframe = document.querySelector("#videoIframe");
  const response = await getVideoById(videoId);
  videoIframe.src = `https://www.youtube.com/embed/${response.data.videoId}?autoplay=1&rel=0&playsinline=1`;
}
