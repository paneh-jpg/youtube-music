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
