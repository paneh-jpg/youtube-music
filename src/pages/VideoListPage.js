import { getVideoBySlug } from "../api/exploreApi.js";
import { formatSecondsToHms, formatDateVietnamese } from "../utils/utils.js";

import { router } from "../router/router.js";
import { hideLoading, showLoading } from "../utils/loading.js";

export function VideosLists() {
  return `
      <!--  Main content  -->
      <div class="h-screen">
        <main class="js-album-content  " >
            <h1 class"text-3xl font-bold py-10 text-[#333]"> Album detail </h1>
        </main>
      </div>
  `;
}

export async function initVideosLists() {}

export async function initVideosContent(slug) {
  const contentEl = document.querySelector(".js-album-content");
  if (!contentEl) return;

  if (!slug) {
    contentEl.textContent = "Không có slug (route param bị rỗng).";
    return;
  }

  try {
    showLoading();
    const response = await getVideoBySlug(slug);
    const data = response?.data;
    const tracksHtml = data.related
      .map(
        (video, index) => `
      <div data-id =${
        video.id
      } class="js-video cursor-pointer flex items-center p-2 rounded-lg hover:bg-gray-800 transition duration-150">
        <div class="w-1/12 text-lg font-medium text-gray-400">${index + 1}</div>
        <div class="w-9/12 flex items-center space-x-4">
          <img
            src="${
              video.thumbnails ||
              "https://cdn.saleminteractivemedia.com/shared/images/default-cover-art.png"
            }"
            alt="${video.title || ""}"
            class="w-10 h-10 rounded object-cover"
          />
         <div class="flex flex-col">
            <h3 class="text-white font-medium truncate">${
              video.title || ""
            }</h3>

               <span class="text-gray-400  text-[12px] truncate ">${
                 video.singer || "Tên ca sĩ"
               } </span>

         </div>
        </div>
        <p class="w-2/12 text-right text-[14px] text-gray-400">${
          formatSecondsToHms(video.duration) || ""
        }</p>
      </div>
    `
      )
      .join("");

    const html = `<div class="w-full flex space-x-12 justify-between">
    <div class="w-2/5 flex flex-col items-center pt-2">

      <!-- Cover -->
      <div class="w-full max-w-112.5">
        <div class="w-full h-[clamp(300px,24vw,400px)] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.55)]" >
          <img src="${
            // data.thumbnails ||
            `https://picsum.photos/800/800?rand=${Date.now()}`
          }" alt="Bìa Album" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Info -->
      <div class="mt-4 w-full text-center">
        <p class="text-[11px] font-semibold tracking-[0.22em] text-white/55 uppercase" >
          ${data.albumType || "Album"}
        </p>

        <h1 class="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight line-clamp-2" >
          ${data.title}
        </h1>

        <div class="mt-2 text-sm text-white/65">
          <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>${data.related.length} bài</span>
            <span class="text-white/35">•</span>
            <span>${formatSecondsToHms(data.duration)}</span>
            <span class="text-white/35">•</span>
            <span>${data.popularity} lượt nghe</span>
          </div>
          
        </div>

        <!-- Actions -->
        <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button class="js-play-btn px-5 py-2 rounded-full bg-white text-black font-semibold hover:scale-[1.02] active:scale-[0.98] transition" >
            ▶ Phát
          </button>

          <button class="h-9 w-9 rounded-full border border-white/20 text-white/90 hover:bg-white/10 transition flex items-center justify-center" aria-label="Tùy chọn">
            ⋯
          </button>
        </div>
      </div>
    </div>

    <!-- Tracks list-->
    <div class="js-video-list w-3/5 max-h-[82vh] overflow-y-auto ml-10 overscroll-y-contain hide-scrollbar pr-4 space-y-2" >
      <div class="md:flex text-gray-500 text-xs uppercase tracking-wider mb-2 sticky top-0 bg-[#0d1117] pt-2 pb-1 z-10" >
        <div class="w-1/12">#</div>
        <div class="w-9/12">Tên bài hát</div>
        <div class="w-2/12 text-right">Thời lượng</div>
      </div>

      ${tracksHtml}

      <div class="h-20"></div>
    </div>
  </div>`;
    contentEl.innerHTML = html;

    const container = document.querySelector(".js-video-list");
    const playAllBtn = document.querySelector(".js-play-btn");

    container.addEventListener("click", (e) => {
      const video = e.target.closest(".js-video");
      if (!video) return;

      const idVideo = video.dataset.id;
      console.log(idVideo);

      router.navigate(`/videos/details/${encodeURIComponent(idVideo)}`);
    });

    playAllBtn.onclick = () => {
      const idVideo = data.related[0].id;
      router.navigate(`/videos/details/${encodeURIComponent(idVideo)}`);
    };
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoading();
  }
}
