import { Header, initHeader } from "../components/layout/Header.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";
import { SectionHeader } from "../components/section/SectionHeader.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { VideoCard } from "../components/cards/VideoCard.js";
import { getNewsRelease, getNewestVideoList } from "../api/exploreApi.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { router } from "../router/router";

export function NewsReleasePage() {
  return `    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-full pb-20 ">
        <main id="mainContent" class="mt-6 ml-15 mr-15" >
         <section class="mt-15 ">
              ${SectionHeader({
                title: "Khám phá bản phát hành mới",
                underline: false,
                hasBtn: false,
              })}
        
              <!-- content bên dưới (horizontal scroll cards) -->
             <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-new-release-albums grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                       <!--   ALBUMs -->
                </div>
             </div>
            </section>

              <section class="mt-20">
      ${SectionHeader({
        title: "Video nhạc mới",
        underline: false,
        hasBtn: false,
      })}

      <!-- content bên dưới (horizontal scroll cards) -->
     <div class="js-video-list-container overflow-x-auto custom-scrollbar pb-2.5">
        <div  class="js-newest-videos grid grid-flow-col gap-3.75 auto-cols-[calc(100%/4-10px)] ">
                   <!--   VIDEO -->
        </div>
     </div>
    </section>
        </main>
      </div>
    </div>
  `;
}

export function initNewsReleasePage() {
  initHeader();
  initSidebar();
  loadNewsReleaseAlbum().then(initCustomScrolling);
  loadNewestVideos().then(initCustomScrolling);
}

async function loadNewsReleaseAlbum() {
  const container = document.querySelector(".js-new-release-albums");
  if (!container) return;

  const response = await getNewsRelease();
  const items = response?.data?.items;

  container.innerHTML = items
    .map((item) => {
      return AlbumCard({
        thumbnail: item.thumb,
        name: item.name,
        albumType: item.albumType || "Đĩa đơn",
        artist: item.artistName || item.artist?.name || "Unknown",
        id: item.id,
      });
    })
    .join("");

  container.addEventListener("click", (e) => {
    const album = e.target.closest(".js-album");

    if (!album) return;

    const id = album.dataset.id;

    router.navigate(`/albums/details/${encodeURIComponent(id)}`); // add router
  });
}

async function loadNewestVideos() {
  const container = document.querySelector(".js-newest-videos");
  if (!container) return;

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

    router.navigate(`/videos/details/${encodeURIComponent(slug)}`); // add router
  });
}
