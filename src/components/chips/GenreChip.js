export function GenreColorChip({
  label = "",
  color = "#ff6d00", // màu accent bên trái
} = {}) {
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;
  return `
    <div
      class=" cursor-pointer
             px-4 py-5 
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
