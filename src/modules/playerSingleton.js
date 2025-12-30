// Singleton cho UnifiedPlayer (Audio + Video dùng chung 1 controller)

import { UnifiedPlayer } from "./UnifiedPlayer.js";

let playerInstance = null;

export function getOrCreateUnifiedPlayer(elements = {}) {
  if (!playerInstance) {
    playerInstance = new UnifiedPlayer();
  }

  // Cập nhật elements mới theo từng page (SongDetail/VideoDetail)
  playerInstance.setElements(elements);
  return playerInstance;
}

export function stopAllMedia() {
  playerInstance?.stopAll();
}

export function destroyVideoPlayer() {
  playerInstance?.destroyVideoPlayer();
}
