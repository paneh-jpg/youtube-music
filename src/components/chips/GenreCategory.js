export function GenreColorCate({
  label = "",
  color = "#ff6d00",
  slug = "",
  type = "",
} = {}) {
  return `
    <button
      type="button"
      class="h-15 js-genre-chip cursor-pointer w-full px-4 py-2 text-[14px] rounded-xl bg-[#2a2a2a]
             text-white font-semibold hover:bg-[#333] transition text-center
             border-l-[6px]"
      style="border-left-color:${color};"
      data-slug="${slug}"
      data-type="${type}">
      ${label}
    </button>
  `;
}
