import { getCategoryBySlug } from "../api/exploreApi.js";

export function CategoryPage() {
  return `
      <!--  Main content  -->
        <div class="js-category-content h-screen t-0" >
        <h1 class="text-4xl font-bold mb-6">Đang cập nhật...</h1>
        </div>
  `;
}

export async function initCategoryPage() {}

export const initCategoryContent = async (slug) => {
  const contentEl = document.querySelector(".js-category-content");
  if (!contentEl) return;

  if (!slug) {
    contentEl.innerHTML = ``;
    return;
  }
  const response = await getCategoryBySlug(slug);
  const data = response.data;
  const categoryName = data.name;

  const html = ` </div> <h1 class="text-[32px] md:text-[36px] font-extrabold text-white leading-tight">${categoryName}</h1>
  <p class="mt-3 text-[20px]">${data.description}</p> 
  
    <p class="mt-10">Đang cập nhật.....</p> 

  </div>
  `;

  contentEl.innerHTML = html;
};
