export function QuickPickCard({
  id = "",
  title = "",
  slug = "",
  thumbnail = "",
  artist = "",
  type = "",
} = {}) {
  return `
    <div
      class="js-quick-pick-card group flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/10 transition"
      data-id="${id}"
      data-slug="${slug}"
      data-type="${type}"
    >
      <!-- Thumbnail -->
      <div class="relative w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-md overflow-hidden bg-black">
        <img
          src="${thumbnail}"
          alt="${title}"
          class="w-full h-full object-cover"
        />

        <!-- Play button -->
        <button
          class="absolute inset-0
                 flex items-center justify-center
                 opacity-0 scale-95
                 group-hover:opacity-100 group-hover:scale-100
                 transition"
        >
          <span class=" material-symbols-outlined  text-white text-[26px] lg:text-[30px]"> play_arrow
          </span>
        </button>
      </div>

      <!-- Info -->
      <div class="min-w-0 flex-1">
        <h3 class="text-sm font-medium text-white truncate">
          ${title}
        </h3>

        <p class="text-xs text-white/60 truncate">
          Playlist • ${artist}
        </p>
      </div>

    </div>
  `;
}
