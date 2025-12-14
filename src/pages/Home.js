import { Header, initHeader } from "../components/layout/Header";
import { Sidebar, initSidebar } from "../components/layout/Sidebar";
import { LoadingOverlay } from "../components/loading/LoadingOverlay";

import { SectionHeader } from "../components/section/SectionHeader";
export function HomePage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter]">
      <!-- Overlay -->
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>

      ${Header()}  ${Sidebar()} 
      <!--  Main content  -->
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-screen ">
        <main id="mainContent" class="mt-6 ml-15 mr-15" >
          <!-- ===== Moods ===== -->
          <div class="relative">

                    ${LoadingOverlay()}
            <!-- Mood Item -->
            <div class="flex gap-3 py-6 ">
              <button class="category-item">Nạp năng lượng</button>
              <button class="category-item">Vui tươi</button>
              <button class="category-item">Thư giãn</button>
              <button class="category-item">Tập thể dục</button>
              <button class="category-item">Trên đường đi làm</button>
              <button class="category-item">Tiệc tùng</button>
            </div>
          </div>

                  <section class="mt-15">
      ${SectionHeader({
        title: "Chọn nhanh đài phát",
        underline: false,
        btnContent: "Phát tất cả",
      })}
        </div>
     </div>
    </section>

        </main>
      </div>
    </div>
  `;
}

export function initHomePage() {
  initHeader();
  initSidebar();
}
