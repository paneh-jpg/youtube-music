export function AlbumCard() {
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  return `
  <div class="desktopSidebarState === "expanded" ? "180px" : "206px"; shrink-0">
    <!-- ===== THUMBNAIL ===== -->
    <div
      class="relative aspect-square rounded-xl overflow-hidden
             group cursor-pointer"
    >
      <img
        src="https://placehold.co/300x300/181818/ffffff?text=Music"
        class="w-full h-full object-cover"
      />

      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/30
               opacity-0 group-hover:opacity-100
               transition"
      ></div>

      <!-- More -->
      <button
        class="absolute top-2 right-2 z-10
               h-9 w-9 rounded-full
               bg-black/50 backdrop-blur
               flex items-center justify-center
               opacity-0 group-hover:opacity-100
               transition"
      >
        <span class="material-symbols-outlined text-white text-[20px]">
          more_vert
        </span>
      </button>

      <!-- Play -->
      <button
        class="absolute bottom-3 right-3 z-10
               h-6 w-6 rounded-full
               bg-black/80
               flex items-center justify-center
               opacity-0 scale-95
               group-hover:opacity-100 group-hover:scale-100
               transition"
      >
        <span class="material-symbols-outlined text-white text-[28px] ml-[2px]">
          play_arrow
        </span>
      </button>
    </div>

    <!-- ===== INFO ===== -->
    <div class="mt-3 space-y-1">
      <!-- Title -->
      <h3
        class="text-white text-md font-semibold leading-snug
               line-clamp-2"
      >
        Heather
      </h3>

    <div class= "flex">  <!-- Type -->
      <p class="text-white/60 text-sm">
        Đĩa đơn&nbsp;  • 	&nbsp;  
      </p>
      <!-- Artist -->
      <p class="text-white/60 text-sm hover:underline cursor-pointer line-clamp-1" > Conan Gray </p> 
      </div>
    </div>
  </div>
  `;
}
