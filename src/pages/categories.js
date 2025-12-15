import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";
import { getCategoryBySlug } from "../api/exploreApi";

export function CategoryPage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 pb-20 min-h-screen">
        <main id="mainContent" class="js-category-content mt-10 mx-15  " >
        <h1 class"text-3xl font-bold py-10 text-[#333]"> Category </h1>
        </main>
      </div>
    </div>
  `;
}

export async function initCategoryPage() {
  initHeader();
  initSidebar();
}

export const initCategoryContent = async (slug) => {
  const contentEl = document.querySelector(".js-category-content");
  if (!contentEl) return;

  if (!slug) {
    contentEl.textContent = "Không có slug (route param bị rỗng).";
    return;
  }
  const response = await getCategoryBySlug(slug);
  const data = response.data;
  console.log(data);

  const categoryName = data.name;

  const html = ` </div> <h1 class="text-[32px] md:text-[36px] font-extrabold text-white leading-tight">${categoryName}</h1>
  <p class="mt-3 text-[20px]">${data.description}</p> 
  
    <p class="mt-10">Đang cập nhật.....</p> 

  </div>
  `;

  contentEl.innerHTML = html;
};
