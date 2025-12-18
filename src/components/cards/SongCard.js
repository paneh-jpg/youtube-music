export function SongCard({
  thumbnail = "https://placehold.co/120x120/181818/ffffff?text=Music",
  name = "Unknown song",
  albumName = "Uncategorized",
  views = 0,
  slug = "",
  id = "",
} = {}) {
  return `
    <div
      data-slug="${slug}"
      data-id="${id}"
      class="js-song group flex items-center gap-4 lg:gap-5 cursor-pointer"
    >
      <!-- Thumbnail-->
      <div
        class="
          relative
          w-14 h-14
          lg:w-16 lg:h-16
          shrink-0
          rounded-md overflow-hidden
        "
      >
        <img
          src="${thumbnail}"
          alt="${name}"
          class="w-full h-full object-cover"
        />

        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/40
                 opacity-0 group-hover:opacity-100
                 transition"
        ></div>

        <!-- Play -->
        <button
          class="absolute inset-0
                 flex items-center justify-center
                 opacity-0 scale-95
                 group-hover:opacity-100 group-hover:scale-100
                 transition"
        >
          <span class=" material-symbols-outlined  text-white text-[26px] lg:text-[30px]"> 
              play_arrow
          </span>
        </button>
      </div>

      <!-- ===== INFO ===== -->
      <div class="min-w-0">
        <!-- Song name -->
        <h4
          class="
            text-white
            text-sm
            lg:text-[15px]
            font-semibold
            leading-snug
            truncate
          "
          title="${name}"
        >
          ${name}
        </h4>

        <!-- Meta -->
        <p
          class="
            text-white/60
            text-xs
            lg:text-sm
            mt-1
            truncate
          "
        >
          ${views} lượt xem • ${albumName}
        </p>
      </div>
    </div>
  `;
}
