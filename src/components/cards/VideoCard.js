export function VideoCard() {
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  return `
  <div class="desktopSidebarState === "expanded" ? "280px" : "320px"; shrink-0">
    <!-- ===== THUMBNAIL ===== -->
    <div
      class="relative aspect-video rounded-xl overflow-hidden
             group cursor-pointer"
    >
      <img
        src="https://placehold.co/480x270/181818/ffffff?text=Video"
        class="w-full h-full object-cover"
      />

      <!-- Overlay (hover mới tối) -->
      <div
        class="absolute inset-0 bg-black/30
               opacity-0 group-hover:opacity-100
               transition"
      ></div>

      <!-- Play icon (LUÔN HIỆN – KHÔNG NỀN) -->
      <div
        class="absolute inset-0 flex items-center justify-center
               pointer-events-none"
      >
       <i
  class="fa-solid fa-play
         text-white text-[30px]
         drop-shadow-lg"
></i>

      </div>

      <!-- More (chỉ hiện khi hover) -->
      <button
        class="absolute top-2 right-2 z-10
               h-8 w-8 rounded-full
               bg-black/60 backdrop-blur
               flex items-center justify-center
               opacity-0 group-hover:opacity-100
               transition"
      >
        <span class="material-symbols-outlined text-white text-[18px]">
          more_vert
        </span>
      </button>
    </div>

    <!-- ===== INFO ===== -->
    <div class="mt-3 space-y-1">
      <h3
        class="text-white text-md font-semibold
               leading-snug line-clamp-2"
      >
        xmas day, em dau
      </h3>

      <p class="text-white/60 text-sm line-clamp-1">
        Kai Dinh, PiaLinh và Dangrangto • 364 N lượt xem
      </p>
    </div>
  </div>
  `;
}
