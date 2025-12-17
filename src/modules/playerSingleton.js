import { MusicPlayer } from "./MusicPlayer.js";

let playerInstance = null;

/**
 * Tìm index của bài hát dựa trên ID
 */
function findTrackIndexById(tracks, id) {
  if (!Array.isArray(tracks) || !id) return -1;
  return tracks.findIndex((track) => String(track?.id) === String(id));
}

/**
 * Khởi tạo hoặc cập nhật MusicPlayer (Singleton Pattern)
 */
export function getOrCreateMusicPlayer(config = {}) {
  const { tracks = [], initialSongId, ...elements } = config;

  if (!playerInstance) {
    playerInstance = new MusicPlayer({ ...elements, tracks, initialSongId });
    return playerInstance;
  }

  // 1. Cập nhật các element DOM mới từ trang vừa chuyển sang
  Object.keys(elements).forEach((key) => {
    if (elements[key]) {
      const instanceKey = key.replace("El", "");
      playerInstance[key] === undefined
        ? (playerInstance[instanceKey] = elements[key])
        : (playerInstance[key] = elements[key]);
    }
  });

  // 2.  !!Nếu có container queue mới, phải gán lại sự kiện ngay
  if (elements.queueListContainer) {
    playerInstance.queueListContainer = elements.queueListContainer;
    playerInstance.renderQueue(); // Vẽ bài hát ra container mới
    playerInstance.bindQueueEvents(); // Dán "keo" sự kiện vào container mới
  }

  // 3. Cập nhật danh sách nhạc nếu có sự thay đổi (Album khác)
  const isNewList =
    JSON.stringify(playerInstance.tracks) !== JSON.stringify(tracks);
  if (tracks.length && isNewList) {
    playerInstance.tracks = [...tracks];
    playerInstance.originalTracks = [...tracks];
    playerInstance.renderQueue();
  }

  // 4. Phát bài được chọn
  const nextIndex = findTrackIndexById(playerInstance.tracks, initialSongId);
  if (nextIndex !== -1) {
    playerInstance.loadTrack(nextIndex);
  }

  return playerInstance;
}
