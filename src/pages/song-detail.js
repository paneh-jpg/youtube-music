import { getAlbumBySlug } from "../api/exploreApi";
import { Header, initHeader } from "../components/layout/Header";
import { Panel } from "../components/layout/Panel";
import { PlayerControl } from "../components/layout/PlayerControl";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";
import { VideoArea } from "../components/layout/VideoArea";

export function SongDetailPage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-[100vh] ">
        <main id="mainContent" class="mt-6 ml-10 mr-10" >
         <!--  MAIN LAYOUT  -->
      <div class="min-h-screen pb-5">
      <div class="mx-auto max-w-[1400px] px-5 pt-4 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
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
}

export async function initSongDetailContent({ songId, albumSlug }) {
  const videoEl = document.querySelector("#audio");

  const response = await getAlbumBySlug(albumSlug);
  const tracks = response.data.tracks;
  const track = tracks.find((el) => el.id === songId);

  videoEl.src = `${track.audioUrl}`;
}
