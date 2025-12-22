export function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatSecondsToHms(totalSeconds) {
  const secondsInput = Math.floor(Math.max(0, totalSeconds));
  let remainingSeconds = secondsInput;

  // Tính Giờ (1 giờ = 3600 giây)
  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds %= 3600;

  // Tính Phút (1 phút = 60 giây)
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds %= 60;

  // Giây còn lại
  const seconds = remainingSeconds;

  // Hàm phụ trợ để thêm số 0 vào trước (padding)
  const pad = (num) => String(num).padStart(2, "0");

  if (hours === 0) return `${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDateVietnamese(isoString) {
  const d = new Date(isoString);
  const dd = d.getDate();
  const mm = d.getMonth() + 1;
  const yyyy = d.getFullYear();
  return `${dd} tháng ${mm} năm ${yyyy}`;
}

export function formatNumber(num) {
  if (!num || isNaN(num)) return "0";

  if (num >= 1000000) {
    const formatted = (num / 1000000)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(".", ",");
    return `${formatted} Tr`;
  } else if (num >= 1000) {
    const formatted = (num / 1000)
      .toFixed(1)
      .replace(/\.0$/, "")
      .replace(".", ",");
    return `${formatted} N`;
  }

  return num.toString();
}

// Avt helper
const GOOGLE_COLORS = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FF9800",
  "#FF5722",
];

function getTextColor(bgColor) {
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#000" : "#FFF";
}

function getColorIndex(name) {
  if (!name || name.length === 0) {
    return 0;
  }

  const firstChar = name[0].toUpperCase();
  const charCode = firstChar.charCodeAt(0);

  const numColors = GOOGLE_COLORS.length;
  return charCode % numColors;
}

export function generateAvatar(name) {
  const char = name[0]?.toUpperCase() || "U";

  const colorIndex = getColorIndex(name);
  const bg = GOOGLE_COLORS[colorIndex];

  const text = getTextColor(bg);

  return { char, bg, text };
}

// utils/trackNormalizer.js

export function normalizeSongToTrack(song = {}) {
  return {
    id: song.id,
    title: song.title || song.name || "Unknown",
    audioUrl: song.audioUrl,
    thumbnails: song.thumbnails || song.thumb,
    duration: Number(song.duration || 0),
    artists: song.artists || [],
  };
}

export function mergeSongWithAlbumTracks(song, tracks = []) {
  if (!song || !Array.isArray(tracks)) return tracks;

  const index = tracks.findIndex((t) => String(t.id) === String(song.id));

  if (index === -1) {
    return [song, ...tracks]; // hoặc push cuối
  }

  const newTracks = [...tracks];
  newTracks[index] = { ...tracks[index], ...song };

  return newTracks;
}
