export const Panel = () => {
  return `        <!--  RIGHT: PANEL  -->
        <aside class="js-panel h-full rounded-xl bg-black/40 border border-white/10 overflow-hidden flex flex-col">
          <!-- Tabs -->
          <div class="px-5 p-4">
            <div class="flex items-center justify-between gap-8 border-b border-white/10">
              <button class="tab-btn cursor-pointer pb-3 text-sm font-semibold tracking-wide text-white border-b-2 border-white" data-tab="next" >
                TIẾP THEO
              </button>
              <button class="tab-btn cursor-pointer pb-3 text-sm font-semibold tracking-wide text-white/50 hover:text-white" data-tab="lyrics" >
                LỜI NHẠC
              </button>
              <button class="tab-btn cursor-pointer pb-3 text-sm font-semibold tracking-wide text-white/50 hover:text-white" data-tab="related" >
                LIÊN QUAN
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-h-0 overflow-hidden">
            <!--  TAB: NEXT  -->
            <div class="tab-panel h-full flex flex-col min-h-0" data-panel="next">
              <div class="px-5 pt-3 pb-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs text-white/60">Đang phát: </p>
                    <h3 class="js-current-track-name mt-1 font-semibold leading-tight"> Nhạc Acoustic Album 9 - Bài 5</h3>
                  </div>
                </div>

                <div class="mt-5 flex items-center justify-between">
                  <p class="text-md font-semibold"> Các bài hát tiếp theo: </p>
                </div>
              </div>

              <div class="border-t border-white/10"></div>

              <!-- Queue list (scroll ở đây) -->
              <div class="js-queue-list flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <!-- Item active -->
              </div>
            </div>

            <!--  TAB: LYRICS  -->
            <div class="tab-panel hidden h-full flex flex-col min-h-0" data-panel="lyrics">
              <div class="px-5 py-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <p class="text-sm">Nội dung đang cập nhật...</p>
              </div>
            </div>

            <!--  TAB: RELATED  -->
            <div class="tab-panel hidden h-full flex flex-col min-h-0" data-panel="related">
              <div class="px-5 py-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <p class="text-sm">Nội dung đang cập nhật...</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>`;
};

export function initPanel() {
  const panelRoot = document.querySelector(".js-panel");
  if (!panelRoot) return;

  const tabBtns = panelRoot.querySelectorAll(".tab-btn");
  const panels = panelRoot.querySelectorAll(".tab-panel");

  const setActiveTab = (tabKey) => {
    // active button
    tabBtns.forEach((btn) => {
      const isActive = btn.dataset.tab === tabKey;

      btn.classList.toggle("text-white", isActive);
      btn.classList.toggle("text-white/50", !isActive);
      btn.classList.toggle("border-b-2", isActive);
      btn.classList.toggle("border-white", isActive);

      if (!isActive) btn.classList.add("hover:text-white");
      else btn.classList.remove("hover:text-white");
    });

    panels.forEach((p) => {
      p.classList.toggle("hidden", p.dataset.panel !== tabKey);
    });

    try {
      localStorage.setItem("panel_tab", tabKey);
    } catch {}
  };

  const saved = localStorage.getItem("panel_tab");
  setActiveTab(saved || "next");

  panelRoot.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    setActiveTab(btn.dataset.tab);
  });

  window.__setPanelTab = setActiveTab;
}
