import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";
import { SectionHeader } from "../components/section/SectionHeader";
import { AlbumCard } from "../components/cards/AlbumCard";
import { VideoCard } from "../components/cards/VideoCard";

import { getNewestAlbumList, getNewestVideoList } from "../api/exploreApi";
import { GenreChipList } from "../components/chips/GenreChipList";
import { getMetaList } from "../api/exploreApi";

export function ExplorePage() {
  return `
<div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">


  <!-- Overlay -->
  <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

  ${Header()} ${Sidebar()}
  <!--  Main content  -->
  <div id="mainContentWrapper" class="pt-16 md:ml-64 pb-20 ">
    <main id="mainContent" class="mt-10 ml-15 mr-15">

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
        btnContent: "Xem thêm",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="overflow-x-auto custom-scrollbar pb-2.5">
        <div class="js-newest-albums grid grid-flow-col gap-3.75 auto-cols-[calc(100%/6-12px)]">
        
        </div>
     </div>
    </section>

 <section class="mt-30">
      ${SectionHeader({
        title: "Tâm trạng và thể loại",
        btnContent: "Xem thêm",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="overflow-x-auto custom-scrollbar pb-2.5">
     <div class="js-genre-chips grid grid-flow-col gap-2.5 auto-cols-[calc((100%-40px)/6)]">
       
        </div>
     </div>
    </section>


       <section class="mt-30">
      ${SectionHeader({
        title: "Video nhạc mới",
        btnContent: "Xem thêm",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="overflow-x-auto custom-scrollbar pb-2.5">
        <div  class="js-newest-videos grid grid-flow-col gap-3.75 auto-cols-[calc(100%/4-10px)] ">
  
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
  loadNewestAlbums();
  loadNewestVideos();
  loadGenreChips();
}

async function loadNewestAlbums() {
  const container = document.querySelector(".js-newest-albums");
  if (!container) return;

  try {
    const res = await getNewestAlbumList(10);

    const items = res?.data?.items ?? [];

    container.innerHTML = items
      .map((item) =>
        AlbumCard({
          thumbnail: item.thumb,
          name: item.name,
          albumType: item.albumType || "Đĩa đơn",
          artist: item.artistName || item.artist?.name || "Unknown",
        })
      )
      .join("");
  } catch (e) {
    console.error("loadNewestAlbums error:", e);
    container.innerHTML = "";
  }
}

async function loadNewestVideos() {
  const container = document.querySelector(".js-newest-videos");
  if (!container) return;

  try {
    const res = await getNewestVideoList(10);

    const items = res?.data?.items ?? [];

    container.innerHTML = items
      .map((item) =>
        VideoCard({
          thumbnail: item.thumb,
          name: item.name,
          albumType: item.albumType || "Đĩa đơn",
          views: item.views,
        })
      )
      .join("");
  } catch (e) {
    console.error("loadNewestAlbums error:", e);
    container.innerHTML = "";
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function loadGenreChips() {
  const container = document.querySelector(".js-genre-chips");
  if (!container) return;

  const res = await getMetaList();

  const genres = res?.data?.lines;

  const perCol = 4;
  const cols = chunk(genres, perCol);

  container.innerHTML = cols.map((items) => GenreChipList({ items })).join("");

  // optional: bắt sự kiện click 1 lần bằng event delegation
  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".js-genre-chip");
    if (!chip) return;
    const slug = chip.dataset.slug;
    console.log("click genre:", slug);
    // router.navigate(`/genre/${slug}`)  // sau này add router
  });
}
