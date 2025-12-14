export function SectionHeader({
  title = "",
  showMore = true,
  showNav = true,
  underline = true,
  btnContent = "",
} = {}) {
  return `
    <div class="flex items-center justify-between mb-6">
      <!-- Title -->
  <h2 class="text-[32px] ${underline ? "hover:underline" : ""} ${
    underline ? "cursor-pointer" : "cursor-default"
  } md:text-[36px] font-extrabold text-white leading-tight">
  <a>${title}</a>
</h2>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        ${
          showMore
            ? `
          <button
            class="rounded-full border border-white/20 px-4 py-1.5
                   text-sm text-white hover:bg-white/10 transition"
          >
           ${btnContent}
          </button>
        `
            : ""
        }

        ${
          showNav
            ? `
          <button
            class="h-9 w-9 rounded-full border border-white/20
                   flex items-center justify-center hover:bg-white/10"
            aria-label="Previous"
          >
            <span class="material-symbols-outlined text-white text-[20px]">
              chevron_left
            </span>
          </button>

          <button
            class="h-9 w-9 rounded-full border border-white/20
                   flex items-center justify-center hover:bg-white/10"
            aria-label="Next"
          >
            <span class="material-symbols-outlined text-white text-[20px]">
              chevron_right
            </span>
          </button>
        `
            : ""
        }
      </div>
    </div>
  `;
}
