import { Panel } from "./Panel";
import { VideoArea } from "./VideoArea";

export function SongDetailShell() {
  const desktopSidebarState = JSON.parse(
    localStorage.getItem("sidebar_state") || "{}"
  ).desktop;

  // root
  const songRoot = document.createElement("div");
  songRoot.className = "js-song-detail fixed inset-0 z-10 hidden";

  // overlay
  const overlay = document.createElement("div");
  overlay.className = "overlay absolute inset-0 bg-[#333]";

  // wrapper
  const wrapper = document.createElement("div");
  const leftOffset =
    desktopSidebarState === "collapsed" ? "ml-[130px]" : "ml-[300px]";
  wrapper.className = `js-song-detail-wrapper relative h-full ${leftOffset} mr-15 mt-20 mb-50`;

  // grid
  const grid = document.createElement("div");
  grid.className =
    "grid grid-cols-[minmax(0,1fr)_480px] gap-6 h-full min-h-0 overflow-hidden";

  // left: video area
  const videoCol = document.createElement("div");
  videoCol.className = "js-song-detail-video min-h-0";
  videoCol.innerHTML = VideoArea();

  // right: panel
  const panelCol = document.createElement("div");
  panelCol.className = "js-song-detail-panel min-h-0";
  panelCol.innerHTML = Panel();

  // compose
  grid.append(videoCol, panelCol);
  wrapper.appendChild(grid);
  songRoot.append(overlay, wrapper);

  return songRoot;
}
