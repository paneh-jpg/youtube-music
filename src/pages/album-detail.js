import { getAlbumBySlug } from "../api/exploreApi";
import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";
import { formatSecondsToHms, formatDateVietnamese } from "../utils/utils";

import { router } from "../router/router";

export function AlbumsDetails() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 pb-20 min-h-screen  custom-scrollbar">
        <main id="mainContent" class="js-album-content mt-10 mx-15  " >
        <h1 class"text-3xl font-bold py-10 text-[#333]"> Album detail </h1>
        </main>
      </div>
    </div>
  `;
}

export async function initAlbumsDetails() {
  initHeader();
  initSidebar();
}

export async function initAlbumsContent(slug) {
  const contentEl = document.querySelector(".js-album-content");
  if (!contentEl) return;

  if (!slug) {
    contentEl.textContent = "Không có slug (route param bị rỗng).";
    return;
  }

  const response = await getAlbumBySlug(slug);
  const data = response.data;

  const tracksHtml = data.tracks
    .map(
      (song, index) => `
      <div data-id =${
        song.id
      } class="js-song cursor-pointer flex items-center p-2 rounded-lg hover:bg-gray-800 transition duration-150">
        <div class="w-1/12 text-lg font-medium text-gray-400">${index + 1}</div>
        <div class="w-9/12 flex items-center space-x-4">
          <img
            src="${
              song.thumbnails ||
              "https://cdn.saleminteractivemedia.com/shared/images/default-cover-art.png"
            }"
            alt="${song.title || ""}"
            class="w-10 h-10 rounded object-cover"
          />
         <div class="flex flex-col">
            <h3 class="text-white font-medium truncate">${song.title || ""}</h3>
            
               <span class="text-gray-400  text-[12px] truncate ">${
                 song.singer || "Tên ca sĩ"
               } </span>
           
         </div>
        </div>
        <p class="w-2/12 text-right text-[14px] text-gray-400">${
          formatSecondsToHms(song.duration) || ""
        }</p>
      </div>
    `
    )
    .join("");

  const html = `<div class="w-full flex space-x-12 justify-between">

        <div class="w-2/5 flex flex-col items-center justify-center">
            <div class="w-full h-100 bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
                <img src="${
                  // data.thumbnails ||
                  "https://img.freepik.com/free-photo/guitar-nature_169016-1926.jpg?semt=ais_hybrid&w=740&q=80"
                }" alt="Bìa Album" class="w-full h-full object-cover">
            </div>

            <div class="mt-6 text-center">
                <h1 class="text-3xl font-bold mb-4">${data.title}</h1>

                <p class="text-gray-400 text-sm">
                    ${data.songCount} bài hát &bull; ${formatSecondsToHms(
    data.duration
  )}
                </p>
                <p class="text-gray-400 text-sm">
                    ${data.popularity} lượt nghe
                </p>
                <p class="text-gray-400 text-sm mt-3">
                    Loại album: ${data.albumType}
                </p>
                <p class="text-gray-400 text-sm">
                    Phát hành: ${formatDateVietnamese(data.releaseDate)}
                </p>
            </div>
        </div>

        <div class="js-song-list w-3/5 max-h-[82vh] overflow-y-auto ml-10 overscroll-y-contain hide-scrollbar pr-4 space-y-2">
            <div class=" md:flex text-gray-500 text-xs uppercase tracking-wider mb-2 sticky top-0 bg-[#0d1117] pt-2 pb-1 z-10">
                <div class="w-1/12">#</div>
                <div class="w-9/12">Tên bài hát</div>
                <div class="w-2/12 text-right">Thời lượng</div>
            </div>
            
             ${tracksHtml}
          
            <div class="h-20"></div> </div>
    </div>`;
  contentEl.innerHTML = html;

  const container = document.querySelector(".js-song-list");

  container.addEventListener("click", (e) => {
    const song = e.target.closest(".js-song");
    if (!song) return;

    const idVideo = song.dataset.id;

    router.navigate(
      `/songs/details/${encodeURIComponent(idVideo)}?album=${encodeURIComponent(
        slug
      )}`
    );
  });
}
