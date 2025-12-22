import { SectionHeader } from "../components/section/SectionHeader.js";
import {
  getAlbumsForYou,
  getTodayHits,
  getPlaylistByCountry,
  getMoods,
  getQuickPick,
} from "../api/homeApi.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { QuickPickCard } from "../components/cards/QuickPickCard.js";
import { getProfileApi } from "../api/userApi.js";
import { router } from "../router/router.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { hideLoading, showLoading } from "../utils/loading.js";
import { saveListenHistory } from "../api/authApi.js";

export function HomePage() {
  return `
      <!--  Main content  -->
      <div class="h-full ">

        <h1 class=" text-5xl font-bold js-username"> </h1>
          <!--  Moods  -->
          <div class="relative">
            <!-- Mood List -->
            <div class="js-moods-list flex gap-3 mt-10 py-6 "></div>
          </div>  

          <!--  Quick pick  -->
          <section class="mt-10">
              ${SectionHeader({
                title: "Chọn nhanh đài phát",
                underline: false,
                btnContent: "Xem tất cả",
              })}
  
          <!-- content bên dưới (horizontal scroll cards) -->
          <div class="js-quick-pick-list-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-quick-pick-list grid grid-flow-col grid-rows-4 auto-cols-[calc(100%/3-20px)] gap-x-10 gap-y-2" >
                       <!--   ALBUMs -->
                </div>
             </div>
          </section>

          <!--  Albums For You  -->
          <section class="mt-10">
              ${SectionHeader({
                title: "Album dành cho bạn",
                underline: false,
                btnContent: "Xem tất cả",
              })}
  
          <!-- content bên dưới (horizontal scroll cards) -->
          <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
              <div class="js-album-for-you grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                       <!--   ALBUMs -->
                </div>
             </div>
          </section>

          <!--  Today's Hits  -->
          <section class="mt-20 mb-30">
              ${SectionHeader({
                title: "Today's Hits",
                underline: false,
                btnContent: "Xem tất cả",
              })}
  
          <!-- content bên dưới (horizontal scroll cards) -->
          <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
              <div class="js-today-hits grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                       <!--   ALBUMs -->
              </div>
             </div>
          </section>

      </div>
    </div>
  `;
}

export function initHomePage() {
  initUserName();
  initMoods();
  loadQuickPick().then(initCustomScrolling());
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
  try {
    showLoading();
    const response = await getMoods();
    const moods = response.data.items;

    container.innerHTML = moods
      .map((mood) => {
        return ` <button data-slug=${mood.slug} class="js-mood category-item">${mood.name}</button>`;
      })
      .join("");
    container.addEventListener("click", (e) => {
      const mood = e.target.closest(".js-mood");
      if (!mood) return;

      const slug = mood.dataset.slug;

      router.navigate(`/moods/${encodeURIComponent(slug)}`);
    });
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
};

async function loadQuickPick() {
  const container = document.querySelector(".js-quick-pick-list");
  if (!container) return;
  const response = await getQuickPick();
  const quickPicks = response.data;

  container.innerHTML = quickPicks
    .map((item) =>
      QuickPickCard({
        id: item._id,
        slug: item.slug,
        thumbnail: item.thumbnails,
        title: item.title,
        type: item.type,
        artist: item.artists,
      })
    )
    .join("");

  container.addEventListener("click", async (e) => {
    const quickPick = e.target.closest(".js-quick-pick-card");

    if (!quickPick) return;

    const slug = quickPick.dataset.slug;
    const id = quickPick.dataset.id;

    const response = await saveListenHistory(id);

    router.navigate(`/playlists/details/${encodeURIComponent(slug)}`); // add router
  });
}

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
        id: item.id,
      })
    )
    .join("");

  container.addEventListener("click", async (e) => {
    const album = e.target.closest(".js-album");

    if (!album) return;

    const slug = album.dataset.slug;
    const id = album.dataset.id;

    const response = await saveListenHistory(id);
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
        id: item.id,
      })
    )
    .join("");

  container.addEventListener("click", async (e) => {
    const album = e.target.closest(".js-album");

    if (!album) return;

    const slug = album.dataset.slug;
    const id = album.dataset.id;

    const response = await saveListenHistory(id);

    router.navigate(`/playlists/details/${encodeURIComponent(slug)}`); // add router
  });
}
