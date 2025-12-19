import { getMoodBySlug, getMoods } from "../api/homeApi.js";
import { AlbumCard } from "../components/cards/AlbumCard.js";
import { SectionHeader } from "../components/section/SectionHeader.js";
import { router } from "../router/router.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { showLoading, hideLoading } from "../utils/loading.js";

export function MoodsPage() {
  return `
      <!--  Main content  -->
      <div class="h-full">
          <!--  Moods  -->
          <div class="relative">
            <div class="js-moods-list flex gap-3 mt-10 py-6 "></div>
          </div>  

          <div class="py-15"> 
            <h1 class="js-mood-name text-5xl font-bold mb-6"></h1>
            <p class="js-mood-desc mt-3 text-[20px]"></p> 
         </div>

         <section class="my-15">
            ${SectionHeader({
              title: "Featured",
              hasBtn: false,
              underline: false,
            })}
           <!-- Nội dung bên dưới (horizontal scroll cards) -->
          <div class="js-featured-container overflow-x-auto custom-scrollbar pb-2.5">
              <div class="js-featured-list grid grid-flow-col  gap-4 auto-cols-[calc(100%/6-12px)]" >
                    <!--   Songs -->
                    Danh sách featured ở đây
              </div>
          </div>
         </section>

         <section class="mt-30">
            ${SectionHeader({
              title: "More picks",
              hasBtn: false,
              underline: false,
            })}
           <!-- Nội dung bên dưới (horizontal scroll cards) -->
          <div class="js-more-pick-container overflow-x-auto custom-scrollbar pb-2.5">
              <div class="js-more-pick grid grid-flow-col  gap-4 auto-cols-[calc(100%/6-12px)]" >
                    <!--   Songs -->
                    Danh sách More picks ở đây
              </div>
          </div>
         </section>

      </div>
  `;
}

export function initMoodsPage() {
  initMoods();
}

const initMoods = async () => {
  const container = document.querySelector(".js-moods-list");
  const response = await getMoods();
  const moods = response.data.items;

  // 1. Lấy slug từ URL
  const currentSlug = window.location.pathname.split("/").pop();

  container.innerHTML = moods
    .map((mood) => {
      // 2. Kiểm tra: nếu trùng slug thì thêm class 'mood-active'
      const activeClass = mood.slug === currentSlug ? "mood-active" : "";

      return `
        <button data-slug="${mood.slug}" class="js-mood category-item ${activeClass}">
          ${mood.name}
        </button>
      `;
    })
    .join("");

  container.addEventListener("click", (e) => {
    const mood = e.target.closest(".js-mood");
    if (!mood) return;

    const slug = mood.dataset.slug;
    router.navigate(`/moods/${encodeURIComponent(slug)}`);
  });
};

export const initMoodContent = async (slug) => {
  if (!slug) {
    contentEl.innerHTML = ``;
    return;
  }
  try {
    showLoading();
    const response = await getMoodBySlug(slug);
    const hero = response.data.hero;

    const sections = response.data.sections;

    renderHeader(hero.title, hero.subtitle);
    renderFeatures(sections[0].items);
    renderMorePicks(sections[1].items);
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
  const moodName = document.querySelector(".js-mood-name");
  const moodDesc = document.querySelector(".js-mood-desc");
  moodName.innerHTML = name;
  moodDesc.innerHTML = desc;
}

const renderFeatures = (items) => {
  const container = document.querySelector(".js-featured-list");
  if (!container) return;

  container.innerHTML = items
    .map((item) =>
      AlbumCard({
        thumbnail: item.thumbnails,
        name: item.title,
        // desc: item.description,
        slug: item.slug,
        id: item.id,
        artist: item.artists.length > 0 ? item.artists : "Unknown",
      })
    )
    .join("");

  container.addEventListener("click", (e) => {
    const album = e.target.closest(".js-album");

    if (!album) return;

    const slug = album.dataset.slug;

    router.navigate(`/playlists/details/${encodeURIComponent(slug)}`); // add router
  });
};

const renderMorePicks = (items) => {
  const container = document.querySelector(".js-more-pick");
  if (!container) return;

  container.innerHTML = items
    .map((item) =>
      AlbumCard({
        thumbnail: item.thumbnails,
        name: item.title,
        // desc: item.description,
        slug: item.slug,
        id: item.id,
        artist: item.artists.length > 0 ? item.artists : "Unknown",
      })
    )
    .join("");

  container.addEventListener("click", (e) => {
    const album = e.target.closest(".js-album");

    if (!album) return;

    const slug = album.dataset.slug;

    router.navigate(`/playlists/details/${encodeURIComponent(slug)}`); // add router
  });
};
