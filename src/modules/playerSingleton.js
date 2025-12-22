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

  // 1. Chưa có instance → tạo mới
  if (!playerInstance) {
    playerInstance = new MusicPlayer({
      ...elements,
      tracks,
      initialSongId,
    });
    return playerInstance;
  }

  // 2. Cập nhật DOM elements mới
  Object.entries(elements).forEach(([key, value]) => {
    if (value && key in playerInstance) {
      playerInstance[key] = value;
    }
  });

  // 3. Rebind queue nếu container mới
  if (elements.queueListContainer) {
    playerInstance.queueListContainer = elements.queueListContainer;

    if (Array.isArray(tracks) && tracks.length) {
      playerInstance.tracks = tracks;

      playerInstance.currentTrackIndex = findTrackIndexById(
        tracks,
        initialSongId
      );

      if (playerInstance.currentTrackIndex === -1) {
        playerInstance.currentTrackIndex = 0;
      }

      playerInstance.renderQueue();
    }

    playerInstance.bindQueueEvents();
  }

  // 4. Cập nhật track list nếu khác
  const isNewList =
    tracks.length &&
    JSON.stringify(playerInstance.tracks) !== JSON.stringify(tracks);

  if (isNewList) {
    playerInstance.tracks = [...tracks];
    playerInstance.originalTracks = [...tracks];
    if (Array.isArray(tracks) && tracks.length) {
      playerInstance.tracks = tracks;
      playerInstance.renderQueue();
    }
  }

  // 5. Load bài được chọn (nếu có)
  const nextIndex = findTrackIndexById(playerInstance.tracks, initialSongId);

  if (nextIndex !== -1) {
    playerInstance.loadTrack(nextIndex);
  }

  return playerInstance;
}
