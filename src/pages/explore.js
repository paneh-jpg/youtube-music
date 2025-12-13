import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";
import { SectionHeader } from "../components/section/SectionHeader";
import { AlbumCard } from "../components/cards/AlbumCard";
import { VideoCard } from "../components/cards/VideoCard";
import { GenreChipList } from "../components/chips/GenreChipList";

export function ExplorePage() {
  return `
   <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]" >
  <!-- Overlay -->
  <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

  ${Header()} ${Sidebar()}
  <!--  Main content  -->
  <div id="mainContentWrapper" class="pt-16 md:ml-64 pb-20 ">
    <main id="mainContent" class="mt-10 ml-20 mr-15">

      <!-- Discover -->
      <div class="flex gap-6 mt-16">
        <!-- Item -->
        <button class="flex flex-1 items-center cursor-pointer gap-3 px-6 py-4 rounded-xl hover:bg-[#2a2a2a] bg-[#3a3a3a] transition text-white font-bold">
          <span class="material-symbols-outlined text-white/80 text-[22px]">
            new_releases
          </span>
          <span class="text-xl">Bản phát hành mới</span>
        </button>

        <!-- Item -->
        <button class="flex flex-1 items-center cursor-pointer gap-3 px-6 py-4 rounded-xl hover:bg-[#2a2a2a] bg-[#3a3a3a] transition text-white font-bold">
          <span class="material-symbols-outlined text-white/80 text-[22px]">
            trending_up
          </span>
          <span class="text-xl">Bảng xếp hạng</span>
        </button>

        <!-- Item -->
        <button class="flex flex-1 items-center cursor-pointer gap-3 px-6 py-4 rounded-xl hover:bg-[#2a2a2a] bg-[#3a3a3a] transition text-white font-bold">
          <span class="material-symbols-outlined text-white/80 text-[22px]">
            mood
          </span>
          <span class="text-xl">Tâm trạng và thể loại</span>
        </button>
      </div>

       <!-- Discover End -->

        <section class="mt-30">
      ${SectionHeader({
        title: "Đĩa đơn và đĩa nhạc mới",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="overflow-x-auto custom-scrollbar pb-2.5">
        <div  class="grid grid-flow-col gap-3.75 auto-cols-[calc(100%/6-12px)]">
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        ${AlbumCard()}
        </div>
     </div>
    </section>

 <section class="mt-30">
      ${SectionHeader({
        title: "Tâm trạng và thể loại",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="overflow-x-auto custom-scrollbar pb-2.5">
     <div class="grid grid-flow-col gap-[10px]
            auto-cols-[calc((100%-40px)/6)]">
        ${GenreChipList()}
        ${GenreChipList()}
        ${GenreChipList()}
        ${GenreChipList()}
        ${GenreChipList()}
        ${GenreChipList()}
        ${GenreChipList()}
        ${GenreChipList()}
        </div>
     </div>
    </section>


       <section class="mt-30">
      ${SectionHeader({
        title: "Video nhạc mới",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="overflow-x-auto custom-scrollbar pb-2.5">
        <div  class="grid grid-flow-col gap-3.75 auto-cols-[calc(100%/4-10px)] ">
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
          ${VideoCard()}
        </div>
     </div>
    </section>
    </main>
  </div>
</div>
  `;
}

export function initExplorePage() {
  initHeader();
  initSidebar();
}
