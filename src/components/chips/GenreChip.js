export function GenreColorChip({
  label = "",
  color = "#ff6d00", // màu accent bên trái
} = {}) {
  return `
    <div
      class="
             px-4 py-6
             rounded-xl
             bg-[#2a2a2a]
             text-sm
             text-white font-bold
             hover:bg-[#333]
             transition
             border-l-4"
      style="border-left-color: ${color};"
    >
      ${label}
    </div>
  `;
}
