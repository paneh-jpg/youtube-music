import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";

export function LibraryPage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-screen ">
        <main id="mainContent" class="mt-6 ml-10" >
        <h1 class"text-3xl font-bold py-10 text-[#333]"> Thư viện </h1>
        </main>
      </div>
    </div>
  `;
}

export function initLibraryPage() {
  initHeader();
  initSidebar();
}
