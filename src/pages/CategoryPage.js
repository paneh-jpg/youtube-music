import { getCategoryBySlug } from "../api/exploreApi.js";
import { hideLoading, showLoading } from "../utils/loading.js";
import { SectionHeader } from "../components/section/SectionHeader.js";

import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";

import { router } from "../router/router.js";

export function CategoryPage() {
  return `
      <!--  Main content  -->
        <div class="js-category-container min-h-screen pb-30 t-0" >
           <div class="js-category-header text-5xl font-bold mb-6"></div> 
           <div class="js-category-content"></div>
        </div>
  `;
}

export async function initCategoryPage() {
  initCustomScrolling();
}

export const initCategoryContent = async (slug) => {
  const headerEl = document.querySelector(".js-category-header");
  const contentEl = document.querySelector(".js-category-content");
  const container = document.querySelector(".js-category-container");
  if (!headerEl) return;
  try {
    showLoading();
    if (!slug) {
      headerEl.innerHTML = ``;
      return;
    }
    const response = await getCategoryBySlug(slug);
    const data = response.data;
    const categoryName = data.name;
    const subcategories = data.subcategories;

    const isUpdating =
      subcategories.length <= 0
        ? `<p class="mt-10 text-[16px]">Đang cập nhật.....</p>`
        : "";

    const headerHtml = ` 
    <div>
       <h1 class="text-4xl font-bold mb-6">${categoryName}</h1>
       <p class="mt-3 font-light text-[20px]">${data.description}</p>
       ${isUpdating} 
    </div>
  `;
    headerEl.innerHTML = headerHtml;
    console.log(subcategories[0].playlists[0]);

    const contentHtml = subcategories
      .map((subCate) => {
        return `<section class="mt-20">
           ${SectionHeader({
             title: subCate.name,
             underline: false,
             hasBtn: false,
             showNav: false,
           })}
     <div class="js-album-list-container overflow-x-auto custom-scrollbar pb-2.5">
        <div class="js-newest-albums grid grid-flow-col gap-4 auto-cols-[calc(100%/6-12px)]">
           ${
             subCate.playlists.length <= 0
               ? '<p class="mt-10 text-gray-400 w-[200px]">Chưa có Alums/Playlists </p>'
               : subCate.playlists
                   .map(
                     (item) =>
                       `${AlbumCard({
                         thumbnail: item.thumbnails,
                         name: item.title,
                         albumType: item.albumType || "Đĩa đơn",
                         artist: item.artists || item.artist?.name || "Unknown",
                         slug: item.slug,
                         id: item._id,
                       })}`
                   )
                   .join("")
           } 
             </div>
     </div>
        </section>`;
      })
      .join("");

    contentEl.innerHTML = contentHtml;

    container.addEventListener("click", async (e) => {
      const album = e.target.closest(".js-album");

      if (!album) return;

      const slug = album.dataset.slug;
      const id = album.dataset.id;

      router.navigate(`/playlists/details/${encodeURIComponent(slug)}`); // add router
    });
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
};
