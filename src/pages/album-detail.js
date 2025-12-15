import { getAlbumBySlug } from "../api/exploreApi";
import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";

export function AlbumsDetails() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 pb-20 min-h-screen">
        <main id="mainContent" class="js-album-content mt-10 mx-15  " >
        <h1 class"text-3xl font-bold py-10 text-[#333]"> Album detail </h1>
        </main>
      </div>
    </div>
  `;
}

export async function initAlbumsDetails() {
  initHeader();
  initSidebar();
}

export async function initAlbumsContent(slug) {
  const contentEl = document.querySelector(".js-album-content");
  if (!contentEl) return;

  if (!slug) {
    contentEl.textContent = "Không có slug (route param bị rỗng).";
    return;
  }
  const response = await getAlbumBySlug(slug);
  const data = response.data;
  console.log(data);
}
