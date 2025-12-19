import { SectionHeader } from "../components/section/SectionHeader.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { VideoCard } from "../components/cards/VideoCard.js";

import { getNewestAlbumList, getNewestVideoList } from "../api/exploreApi.js";
import { GenreCateList } from "../components/chips/GenreCategoryList.js";
import { getMetaList } from "../api/exploreApi.js";

import { initCustomScrolling } from "../utils/horizontalScroll.js";

import { router } from "../router/router.js";
import { hideLoading, showLoading } from "../utils/loading.js";

export function ExplorePage() {
  return `
  <!--  Main content  -->
  <div class="h-full">
      <!-- Discover -->
      <div class="flex gap-6 mt-16">
        <!-- Item -->
        <a href="/news-release" data-navigo class="flex flex-1 items-center cursor-pointer gap-3 px-6 py-4 rounded-xl hover:bg-[#2a2a2a] bg-[#3a3a3a] transition text-white font-bold">
          <span class="material-symbols-outlined text-white/80 text-[22px]">
            new_releases
          </span>
          <span class="text-xl">Bản phát hành mới</span>
        </a>

        <!-- Item -->
        <a href="/charts" data-navigo class="flex flex-1 items-center cursor-pointer gap-3 px-6 py-4 rounded-xl hover:bg-[#2a2a2a] bg-[#3a3a3a] transition text-white font-bold">
          <span class="material-symbols-outlined text-white/80 text-[22px]">
            trending_up
          </span>
          <span class="text-xl">Bảng xếp hạng</span>
        </a>

        <!-- Item -->
        <a href="/moods" data-navigo class="flex flex-1 items-center cursor-pointer gap-3 px-6 py-4 rounded-xl hover:bg-[#2a2a2a] bg-[#3a3a3a] transition text-white font-bold">
          <span class="material-symbols-outlined text-white/80 text-[22px]">
            mood
          </span>
          <span class="text-xl">Tâm trạng và thể loại</span>
        </a>
      </div>

       <!-- Discover End -->

        <section class="mt-30">
      ${SectionHeader({
        title: "Đĩa đơn và đĩa nhạc mới",
        btnContent: "Xem thêm",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
        <div class="js-newest-albums grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
               <!--   ALBUMs -->
        </div>
     </div>
    </section>

 <section class="mt-30">
      ${SectionHeader({
        title: "Tâm trạng và thể loại",
        btnContent: "Xem thêm",
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="js-chip-list-container overflow-x-auto custom-scrollbar pb-2.5">
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
     <div class="js-video-list-container overflow-x-auto custom-scrollbar pb-2.5">
        <div  class="js-newest-videos grid grid-flow-col gap-3.75 auto-cols-[calc(100%/4-10px)] ">
                   <!--   VIDEO -->
        </div>
     </div>
    </section>
  </div>

  `;
}

export function initExplorePage() {
  loadNewestAlbums().then(initCustomScrolling);
  loadNewestVideos().then(initCustomScrolling);
  loadGenreChips().then(initCustomScrolling);
}

async function loadNewestAlbums() {
  const container = document.querySelector(".js-newest-albums");
  if (!container) return;

  try {
    showLoading();
    const res = await getNewestAlbumList(10);
    const items = res?.data?.items ?? [];
    container.innerHTML = items
      .map((item) =>
        AlbumCard({
          thumbnail: item.thumb,
          name: item.name,
          albumType: item.albumType || "Đĩa đơn",
          artist: item.artistName || item.artist?.name || "Unknown",
          slug: item.slug,
        })
      )
      .join("");

    container.addEventListener("click", (e) => {
      const album = e.target.closest(".js-album");

      if (!album) return;

      const slug = album.dataset.slug;

      router.navigate(`/albums/details/${encodeURIComponent(slug)}`); // add router
    });
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      hideLoading();
    }, 500);
  }
}

async function loadNewestVideos() {
  const container = document.querySelector(".js-newest-videos");
  if (!container) return;

  try {
    showLoading();
    const res = await getNewestVideoList(10);
    const items = res?.data?.items ?? [];
    container.innerHTML = items
      .map((item) =>
        VideoCard({
          thumbnail: item.thumb,
          name: item.name,
          albumType: item.albumType || "Đĩa đơn",
          views: item.views,
          slug: item.slug,
        })
      )
      .join("");

    container.addEventListener("click", (e) => {
      const video = e.target.closest(".js-video");

      if (!video) return;

      const slug = video.dataset.slug;

      router.navigate(`/videos/lists/${encodeURIComponent(slug)}`); // add router
    });
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
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

  try {
    showLoading();
    const res = await getMetaList();

    const categories = (res?.data?.categories || []).map((item) => ({
      ...item,
      type: "category",
    }));

    const lines = (res?.data?.lines || []).map((item) => ({
      ...item,
      type: "line",
    }));

    const genres = [...categories, ...lines];

    const perCol = 4;
    const cols = chunk(genres, perCol);

    container.innerHTML = cols
      .map((items) => GenreCateList({ items }))
      .join("");

    container.addEventListener("click", (e) => {
      const chip = e.target.closest(".js-genre-chip");
      if (!chip) return;

      const { slug, type } = chip.dataset;

      if (type === "category") {
        router.navigate(`/categories/${encodeURIComponent(slug)}`);
      }

      if (type === "line") {
        router.navigate(`/lines/${encodeURIComponent(slug)}`);
      }
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoading();
  }
}
