import { SectionHeader } from "../components/section/SectionHeader.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { VideoCard } from "../components/cards/VideoCard.js";
import { getNewsRelease, getNewestVideoList } from "../api/exploreApi.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { router } from "../router/router.js";
import { hideLoading, showLoading } from "../utils/loading.js";

export function NewsReleasePage() {
  return `
      <!--  Main content  -->
    <div class="h-full" >
        <section class="mt-15 ">
              ${SectionHeader({
                title: "Khám phá bản phát hành mới",
                underline: false,
                hasBtn: false,
              })}
        
          <!-- content bên dưới (horizontal scroll cards) -->
          <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
              <div class="js-new-release-albums grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
                  <!-- ALBUMs -->
              </div>
          </div>
        </section>

        <section class="my-20 ">
              ${SectionHeader({
                title: "Video nhạc mới",
                underline: false,
                hasBtn: false,
              })}

          <!-- content bên dưới (horizontal scroll cards) -->
          <div class="js-video-list-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-newest-videos grid grid-flow-col gap-3.75 auto-cols-[calc(100%/4-10px)] ">
                   <!-- VIDEO -->
                </div>
          </div>
        </section>

        <section class="h-10"></section>
    </div>

  `;
}

export function initNewsReleasePage() {
  loadNewsReleaseAlbum().then(initCustomScrolling);
  loadNewestVideos().then(initCustomScrolling);
}

async function loadNewsReleaseAlbum() {
  const container = document.querySelector(".js-new-release-albums");
  if (!container) return;

  try {
    showLoading();
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
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoading();
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

      router.navigate(`/videos/details/${encodeURIComponent(slug)}`); // add router
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    setTimeout(() => {
      hideLoading();
    }, 1000);
  }
}
