import { Header, initHeader } from "../components/layout/Header.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";

export function MoodsAndGenresPage() {
  return `    <div class="h-screen bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64  pb-15">
        <main id="mainContent" class="mt-10 ml-15 mr-15 pb-20">
        <h1 class="text-4xl font-bold mb-6">Tâm trạng và thể loại</h1>
        </main>
      </div>
    </div>
  `;
}

export function initMoodsAndGenresPage() {
  initHeader();
  initSidebar();
}
