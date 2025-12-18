import { Header, initHeader } from "../components/layout/Header.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";
import { SectionHeader } from "../components/section/SectionHeader.js";
import {
  getAlbumsForYou,
  getTodayHits,
  getPlaylistByCountry,
  getMoods,
} from "../api/homeApi.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { getProfileApi } from "../api/userApi.js";
import { router } from "../router/router.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";

export function HomePage() {
  return `
    <div class="h-full bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

       ${Header()}  ${Sidebar()}  
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-full pb-50 ">
        <main id="mainContent" class="mt-10 ml-15 mr-15" >
        <div> <h1 class=" text-5xl font-bold js-username">  </h1>
          <!--  Moods  -->
          <div class="relative">

            <!-- Mood List -->
            <div class="js-moods-list flex gap-3 mt-10 py-6 "></div>
          </div>

          <!--  Albums For You  -->
          <section class="mt-10">
              ${SectionHeader({
                title: "Album dành cho bạn",
                underline: false,
                btnContent: "Xem thêm",
              })}
  
              <!-- content bên dưới (horizontal scroll cards) -->
             <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-album-for-you grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                       <!--   ALBUMs -->
                </div>
             </div>
          </section>

          <!--  Today's Hits  -->
          <section class="mt-20">
              ${SectionHeader({
                title: "Today's Hits",
                underline: false,
                btnContent: "Xem thêm",
              })}
  
              <!-- content bên dưới (horizontal scroll cards) -->
             <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-today-hits grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                       <!--   ALBUMs -->
                </div>
             </div>
          </section>


        </main>
      </div>
</div>
  `;
}

export function initHomePage() {
  initHeader();
  initSidebar();
  initUserName();
  initMoods();
  loadAlbumsForYou().then(initCustomScrolling());
  loadTodayHits().then(initCustomScrolling());
}

const initUserName = async () => {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) return;
  const usernameEl = document.querySelector(".js-username");
  const res = await getProfileApi();
  usernameEl.innerHTML = `Xin chào ${res.data.name}`;
};

const initMoods = async () => {
  const container = document.querySelector(".js-moods-list");
  const response = await getMoods();

  const moods = response.data.items;

  container.innerHTML = moods
    .map((mood) => {
      return ` <button data-slug=${mood.slug} class="category-item">${mood.name}</button>`;
    })
    .join("");
};

async function loadAlbumsForYou() {
  const container = document.querySelector(".js-album-for-you");
  if (!container) return;

  const res = await getAlbumsForYou();

  const items = res?.data ?? [];
  container.innerHTML = items
    .map((item) =>
      AlbumCard({
        thumbnail: item.thumbnails,
        name: item.title,
        albumType: item.type || "Đĩa đơn",
        artist: item.artists || item.artist?.name || "Unknown",
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
}

async function loadTodayHits() {
  const container = document.querySelector(".js-today-hits");
  if (!container) return;

  const res = await getTodayHits();

  const items = res?.data ?? [];
  container.innerHTML = items
    .map((item) =>
      AlbumCard({
        thumbnail: item.thumbnails,
        name: item.title,
        albumType: item.type || "Đĩa đơn",
        artist: item.artists || item.artist?.name || "Unknown",
        slug: item.slug,
      })
    )
    .join("");

  container.addEventListener("click", (e) => {
    const album = e.target.closest(".js-album");

    if (!album) return;

    const slug = album.dataset.slug;

    router.navigate(`/playlists/details/${encodeURIComponent(slug)}`); // add router
  });
}
