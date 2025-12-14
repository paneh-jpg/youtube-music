// src/components/chips/GenreChip.js
export function GenreColorChip({
  label = "",
  color = "#ff6d00",
  slug = "",
} = {}) {
  return `
    <button
      type="button"
      class="js-genre-chip w-full px-4 py-3 text-[14px] rounded-xl bg-[#2a2a2a]
             text-white font-semibold hover:bg-[#333] transition text-center
             border-l-[6px]"
      style="border-left-color:${color};"
      data-slug="${slug}" 
    >
      ${label}
    </button>
  `;
}
