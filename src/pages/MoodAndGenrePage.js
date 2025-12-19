import { SectionHeader } from "../components/section/SectionHeader.js";
import { getMetaList } from "../api/exploreApi.js";
import { GenreCateList } from "../components/chips/GenreCategoryList.js";
import { initCustomScrolling } from "../utils/horizontalScroll.js";
import { router } from "../router/router.js";

export function MoodsAndGenresPage() {
  return `
      <!--  Main content  -->
      <div class="h-full">
          <div class="pb-15"> 
            <h1 class="js-line-name text-5xl font-bold mb-6">Tâm trạng và thể loại</h1>
          </div>

          <section class="mb-15">
            ${SectionHeader({
              title: "Tâm trạng và khoảnh khắc",
              hasBtn: false,
              underline: false,
            })}
             <!-- Nội dung bên dưới (horizontal scroll cards) -->
             <div class="js-moods-and-genres-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-moods-and-genres grid grid-flow-col gap-3.75 auto-cols-[calc(100%/5-10px)]" >
                    <!--  Moods and genres -->
                    Danh sách ở đây
                </div>
             </div>
          </section>

          <section class="mb-15">
            ${SectionHeader({
              title: "Dòng nhạc",
              hasBtn: false,
              underline: false,
            })}
             <!-- Nội dung bên dưới (horizontal scroll cards) -->
             <div class="js-lines-container overflow-x-auto custom-scrollbar pb-2.5">
                <div class="js-lines grid grid-flow-col gap-2.5 auto-cols-[calc((100%-40px)/6)]">
                    <!-- Lines -->
                    Danh sách ở đây
                </div>
             </div>
          </section>
      </div>
  `;
}

export function initMoodsAndGenresPage() {
  renderMoods().then(initCustomScrolling());
  renderLines().then(initCustomScrolling());
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const renderMoods = async () => {
  const container = document.querySelector(".js-moods-and-genres");
  if (!container) return;
  const response = await getMetaList();

  const metaList = response.data.categories;
  const cols = chunk(metaList, 4);

  container.innerHTML = cols.map((items) => GenreCateList({ items })).join("");

  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".js-genre-chip");
    const slug = chip.dataset.slug;
    if (!chip) return;

    router.navigate(`/categories/${encodeURIComponent(slug)}`);
  });
};

const renderLines = async () => {
  const container = document.querySelector(".js-lines");
  if (!container) return;
  const response = await getMetaList();

  const metaList = response.data.lines;
  const cols = chunk(metaList, 4);

  container.innerHTML = cols.map((items) => GenreCateList({ items })).join("");

  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".js-genre-chip");
    const slug = chip.dataset.slug;
    if (!chip) return;

    router.navigate(`/lines/${encodeURIComponent(slug)}`);
  });
};
