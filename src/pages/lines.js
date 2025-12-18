import { Header, initHeader } from "../components/layout/Header.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";
import {
  getAlbumsByLineSlug,
  getLineBySlug,
  getPlaylistsByLineSlug,
  getSongsByLineSlug,
  getVideosByLineSlug,
} from "../api/exploreApi.js";
import { SectionHeader } from "../components/section/SectionHeader.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { VideoCard } from "../components/cards/VideoCard.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { SongCard } from "../components/cards/SongCard.js";
import { formatNumber } from "../utils/utils.js";
import { router } from "../router/router.js";
import { hideLoading, showLoading } from "../utils/loading.js";

export function LinePage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 pb-20 min-h-screen">
        <main id="mainContent" class="js-line-content mt-10 mx-15  " >
          <div class="pb-15"> 
            <h1 class="js-line-name text-5xl font-bold mb-6"></h1>
            <p class="js-line-desc mt-3 text-[20px]"></p> 
         </div>

         <section class="mb-10">
            ${SectionHeader({
              title: "Bài hát",
              hasBtn: false,
              underline: false,
            })}
           <!-- Nội dung bên dưới (horizontal scroll cards) -->
          <div class="js-song-list-container overflow-x-auto custom-scrollbar pb-2.5">
             <div class="js-song-list grid grid-flow-col grid-rows-4 gap-x-10 gap-y-4 auto-cols-fr">
                    <!--   Songs -->
                    Danh sách bài hát ở đây
             </div>
          </div>
         </section>

         <section class="mb-15">   
            ${SectionHeader({
              title: "Danh sách phát nổi bật",
              hasBtn: false,
              underline: false,
            })}
           <!-- Nội dung bên dưới (horizontal scroll cards) -->
          <div class="js-playlist-list-container  overflow-x-auto custom-scrollbar pb-2.5">
             <div class="js-playlist-list grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                    <!--   Playlists -->
                Danh sách playlists ở đây
             </div>
          </div>
         </section>

         <section class="mb-15">  
            ${SectionHeader({
              title: "Video nhạc",
              hasBtn: false,
              underline: false,
            })}
         <!-- Nội dung bên dưới (horizontal scroll cards) -->
          <div class="js-video-list-container overflow-x-auto custom-scrollbar pb-2.5">
             <div class="js-video-list grid grid-flow-col gap-3.75 auto-cols-[calc(100%/4-10px)]">
                    <!--   Videos -->
                    Danh sách videos ở đây
             </div>
          </div>
         </section>

         <section class="mb-15"> 
            ${SectionHeader({
              title: "Đĩa nhạc",
              hasBtn: false,
              underline: false,
            })}
         <!-- Nội dung bên dưới (horizontal scroll cards) -->
          <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
             <div class="js-albums-list  grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                    <!--   ALBUMs -->
                    Danh sách albums ở đây
             </div>
          </div>
         </section>

        </main>
      </div>
    </div>
  `;
}

export async function initLinePage() {
  initHeader();
  initSidebar();
}

export const initLineContent = async (slug) => {
  if (!slug) {
    contentEl.innerHTML = ``;
    return;
  }
  try {
    /**
     * Gọi PromiseAll để các API chạy song song
     * Kết quả:
     *  - Tổng thời gian chạy = API chạy chậm nhất, không phải tổng của cả 5 cái
     *  - Data được render ngay khi hideLoading.
     */
    showLoading();
    const [lineRes, playlistsRes, videosRes, albumsRes, songsRes] =
      await Promise.all([
        getLineBySlug(slug),
        getPlaylistsByLineSlug(slug),
        getVideosByLineSlug(slug),
        getAlbumsByLineSlug(slug),
        getSongsByLineSlug(slug),
      ]);

    renderHeader(lineRes.data.name, lineRes.data.description);
    renderPlaylists(playlistsRes.data.items);
    renderVideos(videosRes.data.items);
    renderAlbums(albumsRes.data.items);
    renderSongs(songsRes.data.items);
    initCustomScrolling();
  } catch (error) {
    console.log(error.message);
  } finally {
    setTimeout(() => {
      hideLoading();
    }, 700);
  }
};

function renderHeader(name, desc) {
  const lineName = document.querySelector(".js-line-name");
  const lineDesc = document.querySelector(".js-line-desc");
  lineName.innerHTML = name;
  lineDesc.innerHTML = desc;
}

function renderAlbums(items) {
  const container = document.querySelector(".js-albums-list");
  if (!container) return;

  container.innerHTML = items
    .map((item) =>
      AlbumCard({
        thumbnail: item.thumb,
        name: item.name,
        albumType: item.albumType || "Unknown",
        views: item.views,
        slug: item.slug,
        id: item.id,
        artist: item.artists || "Unknown",
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

function renderVideos(items) {
  const container = document.querySelector(".js-video-list");

  if (!container) return;
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
}

function renderPlaylists(items) {
  const container = document.querySelector(".js-playlist-list ");
  if (!container) return;

  container.innerHTML = items
    .map((item) =>
      AlbumCard({
        thumbnail: item.thumb,
        name: item.name,
        albumType: item.albumType || "Unknown",
        views: item.views,
        slug: item.slug,
        id: item.id,
        artist: item.artists,
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

function renderSongs(items) {
  const container = document.querySelector(".js-song-list ");
  if (!container) return;

  container.innerHTML = items
    .slice(0, 12)
    .map((item) =>
      SongCard({
        slug: item.slug,
        id: item.id,
        thumbnail: item.thumb,
        name: item.albumName,
        views: `${formatNumber(item.views)} `,
      })
    )
    .join("");

  container.addEventListener("click", (e) => {
    const song = e.target.closest(".js-song");
    if (!song) return;

    const idVideo = song.dataset.id;

    router.navigate(`/songs/details/${encodeURIComponent(idVideo)}`);
  });
}
