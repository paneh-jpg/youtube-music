export function VideoCard({
  name = "Unknown",
  thumbnail = "https://placehold.co/300x300/181818/ffffff?text=Music",
  views = "1tr",
  slug = "",
} = {}) {
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  return `
  <div class="desktopSidebarState === "expanded" ? "280px" : "320px"; shrink-0 ">
    <!-- Thumbnail -->
    <div data-slug="${slug}" class=" js-video relative aspect-video rounded-xl overflow-hidden group cursor-pointer" >
      <img src="${thumbnail}" class="w-full h-full object-cover" />

      <!-- Overlay (hover mới tối) -->
      <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" ></div>

      <!-- Play icon (LUÔN HIỆN – KHÔNG NỀN) -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none" >
          <i class="fa-solid fa-play  text-white text-[30px] drop-shadow-lg" ></i>
      </div>

      <!-- More (chỉ hiện khi hover) -->
      <button
        class="absolute top-2 right-2 z-10 h-8 w-8 rounded-full  bg-black/60 backdrop-blur
               flex items-center justify-center opacity-0 group-hover:opacity-100 transition" >
        <span class="material-symbols-outlined text-white text-[18px]">
          more_vert
        </span>
      </button>
    </div>

    <!-- Video Info -->
    <div class="mt-3 space-y-1">
      <h3 class="text-white text-md font-semibold leading-snug line-clamp-2" >
        ${name}
      </h3>
      <p class="text-white/60 text-sm line-clamp-1">
        Singer • ${formatViewsFull(views)}
      </p>
    </div>
  </div>
  `;
}

export function formatViewsFull(views) {
  const n = Number(views) || 0;
  return `${n.toLocaleString("vi-VN")} lượt xem`;
}
