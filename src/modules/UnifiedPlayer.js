// Player dùng chung cho Audio + YouTube Video

import { formatSecondsToHms } from "../utils/utils.js";
import { toast } from "../components/common/Toast.js";

const YT_API_SRC = "https://www.youtube.com/iframe_api";

// Tránh NaN, ép về [0,1]
function clamp01(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.min(1, Math.max(0, x));
}

function ensureYouTubeAPI() {
  // Đã có sẵn
  if (window.YT && window.YT.Player) return Promise.resolve();

  // Đợi callback global
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve();
    };

    // Nếu chưa có script thì append
    if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
      const tag = document.createElement("script");
      tag.src = YT_API_SRC;
      document.head.appendChild(tag);
    }
  });
}

export class UnifiedPlayer {
  constructor() {
    //  UI elements
    this.playerBarEl = null;
    this.playBtnEl = null;
    this.nextBtnEl = null;
    this.prevBtnEl = null;
    this.progressEl = null;
    this.repeatBtnEl = null;
    this.shuffleBtnEl = null;
    this.currentTimeEl = null;
    this.durationTimeEl = null;
    this.titleEl = null;
    this.metaEl = null;
    this.thumbEl = null;
    this.mainImgEl = null;
    this.queueListEl = null;

    this.volumeEl = null;
    this.volumeBtnEl = null;
    this.volumeIconEl = null;

    //  Media
    this.audioEl = null;
    this.ytPlayer = null;
    this.ytHostId = null;
    this.isYtReady = false;
    this.videoTicker = null;

    //  State
    this.mode = null; // 'audio' | 'video'
    this.tracks = [];
    this.originalTracks = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isSeeking = false;
    this.isRepeat = false;
    this.isShuffle = false;

    // Volume state
    this.volumeStorageKey = "unified_player_volume";
    this.lastVolume = 0.8;

    // Bind handlers 1 lần
    this._onAudioTimeUpdate = this._onAudioTimeUpdate.bind(this);
    this._onAudioEnded = this._onAudioEnded.bind(this);
    this._onAudioLoadedMeta = this._onAudioLoadedMeta.bind(this);
  }

  // Init / Bind UI
  setElements({
    playerBarEl,
    playBtnEl,
    nextBtnEl,
    prevBtnEl,
    progressEl,
    repeatBtnEl,
    shuffleBtnEl,
    currentTimeEl,
    durationTimeEl,
    titleEl,
    metaEl,
    thumbEl,
    queueListEl,
    volumeEl,
    volumeBtnEl,
    volumeIconEl,
    mainImgEl,
  } = {}) {
    // Ghi nhận elements (có thể thay đổi theo page)
    if (playerBarEl) this.playerBarEl = playerBarEl;
    if (playBtnEl) this.playBtnEl = playBtnEl;
    if (nextBtnEl) this.nextBtnEl = nextBtnEl;
    if (prevBtnEl) this.prevBtnEl = prevBtnEl;
    if (progressEl) this.progressEl = progressEl;
    if (repeatBtnEl) this.repeatBtnEl = repeatBtnEl;
    if (shuffleBtnEl) this.shuffleBtnEl = shuffleBtnEl;
    if (currentTimeEl) this.currentTimeEl = currentTimeEl;
    if (durationTimeEl) this.durationTimeEl = durationTimeEl;
    if (titleEl) this.titleEl = titleEl;
    if (metaEl) this.metaEl = metaEl;
    if (thumbEl) this.thumbEl = thumbEl;
    if (queueListEl) this.queueListEl = queueListEl;
    if (volumeEl) this.volumeEl = volumeEl;
    if (volumeBtnEl) this.volumeBtnEl = volumeBtnEl;
    if (volumeIconEl) this.volumeIconEl = volumeIconEl;
    if (mainImgEl) this.mainImgEl = mainImgEl;

    // Đảm bảo có audio element persistent
    this._ensureAudioEl();

    // Rebind UI events (xoá handler cũ bằng cách gán lại onclick)
    this._bindUIEvents();
  }

  _ensureAudioEl() {
    if (!this.playerBarEl) return;

    // Ưu tiên dùng element đã có sẵn trong DOM
    const existing = this.playerBarEl.querySelector("#audio-player");
    if (existing) {
      this.audioEl = existing;
      this._bindAudioEvents();
      return;
    }

    // Tạo mới nếu chưa có
    const audio = document.createElement("audio");
    audio.id = "audio-player";
    audio.preload = "metadata";
    audio.playsInline = true;
    audio.className = "hidden";

    this.playerBarEl.appendChild(audio);
    this.audioEl = audio;
    this._bindAudioEvents();
  }

  _bindAudioEvents() {
    if (!this.audioEl) return;

    // Tránh bind nhiều lần: remove trước
    this.audioEl.removeEventListener("timeupdate", this._onAudioTimeUpdate);
    this.audioEl.removeEventListener("ended", this._onAudioEnded);
    this.audioEl.removeEventListener("loadedmetadata", this._onAudioLoadedMeta);

    this.audioEl.addEventListener("timeupdate", this._onAudioTimeUpdate);
    this.audioEl.addEventListener("ended", this._onAudioEnded);
    this.audioEl.addEventListener("loadedmetadata", this._onAudioLoadedMeta);
  }

  _bindUIEvents() {
    if (this.playBtnEl) {
      this.playBtnEl.onclick = () => this.togglePlay();
    }
    if (this.nextBtnEl) {
      this.nextBtnEl.onclick = () => this.next();
    }
    if (this.prevBtnEl) {
      this.prevBtnEl.onclick = () => this.prev();
    }
    if (this.shuffleBtnEl) {
      this.shuffleBtnEl.onclick = () => this.toggleShuffle();
    }
    if (this.repeatBtnEl) {
      this.repeatBtnEl.onclick = () => this.toggleRepeat();
    }

    // Seek (progress)
    if (this.progressEl) {
      this.progressEl.onpointerdown = () => {
        this.isSeeking = true;
      };
      this.progressEl.oninput = (e) => {
        const val = Number(e.target.value);
        this._setProgressCSS(val);
        this._previewSeek(val);
      };
      this.progressEl.onchange = (e) => {
        const val = Number(e.target.value);
        this.seekPercent(val);
        this.isSeeking = false;
      };
      this.progressEl.onpointerup = () => {
        this.isSeeking = false;
      };
    }

    // Volume
    if (this.volumeEl) {
      this.volumeEl.oninput = (e) => {
        const v = clamp01(Number(e.target.value) / 100);
        this.setVolume(v, { updateUI: true });
      };
      this.volumeEl.onchange = (e) => {
        const v = clamp01(Number(e.target.value) / 100);
        this.setVolume(v, { updateUI: true });
      };
    }
    if (this.volumeBtnEl) {
      this.volumeBtnEl.onclick = () => this.toggleMute();
    }
  }

  // Queue / Load
  setQueue({ mode, tracks, startIndex = 0, ytHostId } = {}) {
    if (!Array.isArray(tracks) || tracks.length === 0) return;

    this.mode = mode;
    if (ytHostId) this.ytHostId = ytHostId;

    // Chuẩn hoá track list theo mode
    this.originalTracks = tracks.map((t) => this._normalizeTrack(t, mode));
    this.tracks = [...this.originalTracks];

    // Index-based: clamp startIndex
    this.currentIndex = Math.max(
      0,
      Math.min(Number(startIndex) || 0, this.tracks.length - 1)
    );

    this.renderQueue();
    this.loadCurrent({ autoplay: true });
  }

  _normalizeTrack(raw, mode) {
    if (mode === "video") {
      return {
        mode: "video",
        uid: String(raw.videoId ?? raw.id ?? ""),
        videoId: String(raw.videoId ?? ""),
        title: raw.title ?? "",
        thumb: raw.thumbnails ?? "",
        duration: Number(raw.duration ?? 0),
        meta: raw.artists ? `${raw.artists} ` : "Không rõ nghệ sĩ",
      };
    }

    // audio
    const artistsArr = Array.isArray(raw.artists) ? raw.artists : [];
    const artistText = artistsArr
      .map((a) => a?.name ?? a)
      .filter(Boolean)
      .join(", ");

    return {
      mode: "audio",
      uid: String(raw.id ?? raw.videoId ?? ""),
      audioUrl: raw.audioUrl ?? "",
      title: raw.title ?? "",
      thumb: raw.thumbnails ?? "",
      duration: Number(raw.duration ?? 0),
      meta: artistText || "Ca sĩ",
    };
  }

  renderQueue() {
    if (!this.queueListEl) return;

    this.queueListEl.innerHTML = this.tracks
      .map((t, i) => {
        const active = i === this.currentIndex;

        return `
        <button data-index="${i}"
          class="js-queue-item w-full text-left px-5 py-3 hover:bg-white/5 transition flex items-center gap-3 ${
            active ? "bg-white/5" : ""
          }">
          <div class="w-12 h-12 rounded-md overflow-hidden bg-white/10 shrink-0">
            <img src="${t.thumb}" class="w-full h-full object-cover" alt="" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate font-semibold">${t.title}</p>
            <p class="truncate text-xs text-white/60">${t.meta || ""}</p>
          </div>
          <div class="text-sm text-white/60">
            ${formatSecondsToHms(Number(t.duration || 0))}
          </div>
        </button>
      `;
      })
      .join("");

    // Click queue (delegation)
    this.queueListEl.onclick = (e) => {
      const item = e.target.closest(".js-queue-item");
      if (!item) return;

      const index = Number(item.dataset.index);
      this.playByIndex(index);
    };
  }

  _updateQueueActive() {
    if (!this.queueListEl) return;

    const currentIndex = this.currentIndex;

    const items = this.queueListEl.querySelectorAll(".js-queue-item");

    items.forEach((el) => {
      const index = Number(el.dataset.index);
      el.classList.toggle("bg-white/5", index === currentIndex);
    });

    // Scroll item active
    const activeItem = this.queueListEl.querySelector(
      `.js-queue-item[data-index="${currentIndex}"]`
    );

    activeItem?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  loadCurrent({ autoplay = false } = {}) {
    const track = this.tracks[this.currentIndex];
    if (!track) return;

    // Đổi mode => dừng media còn lại
    this._stopOtherMedia(track.mode);

    // Render UI chung
    this._renderNowPlaying(track);
    this._updateQueueActive();

    if (track.mode === "audio") {
      if (!this.audioEl) return;
      if (!track.audioUrl) {
        toast.error("Không có audioUrl để phát");
        return;
      }
      this.audioEl.src = track.audioUrl;
      this.audioEl.load();
      if (autoplay) this.play();
      this._syncDurationFromTrack(track);
      return;
    }

    // video
    this._ensureYouTubePlayer(track.videoId)
      .then(() => {
        if (!this.isYtReady) return;
        this.ytPlayer.loadVideoById(track.videoId);
        if (autoplay) this.play();
        this._syncDurationFromYt();
      })
      .catch((err) => {
        toast.error(`Lỗi YouTube: ${err?.message || err}`);
      });
  }

  _renderNowPlaying(track) {
    if (this.titleEl) this.titleEl.textContent = track.title || "";
    if (this.thumbEl && track.thumb) this.thumbEl.src = track.thumb;
    if (this.mainImgEl && track.thumb)
      this.mainImgEl.src = `https://picsum.photos/1200/800?rand=${Date.now()}`;
    if (this.metaEl) this.metaEl.textContent = track.meta || "";

    // Reset progress/time UI
    this._setProgress(0);
    if (this.currentTimeEl) this.currentTimeEl.textContent = "0:00";
    if (this.durationTimeEl) {
      const d = Number(track.duration || 0);
      this.durationTimeEl.textContent = d ? formatSecondsToHms(d) : "0:00";
    }
  }

  _syncDurationFromTrack(track) {
    // Với audio, duration thực tế sẽ cập nhật lại ở loadedmetadata
    if (!this.durationTimeEl) return;
    const d = Number(track.duration || 0);
    this.durationTimeEl.textContent = d ? formatSecondsToHms(d) : "0:00";
  }

  // Play / Pause / Next / Prev
  togglePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  play() {
    const track = this.tracks[this.currentIndex];
    if (!track) return;

    if (track.mode === "audio") {
      if (!this.audioEl) return;
      const p = this.audioEl.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          this.isPlaying = true;
          this._updatePlayIcon(true);
        }).catch((err) => toast.error(`Lỗi: ${err?.message || err}`));
      } else {
        this.isPlaying = true;
        this._updatePlayIcon(true);
      }
      return;
    }

    if (track.mode === "video") {
      if (!this.ytPlayer || !this.isYtReady) return;
      this.ytPlayer.playVideo();
      this.isPlaying = true;
      this._updatePlayIcon(true);
      this._startVideoTicker();
    }
  }

  pause() {
    const track = this.tracks[this.currentIndex];
    if (!track) return;

    if (track.mode === "audio") {
      this.audioEl?.pause();
      this.isPlaying = false;
      this._updatePlayIcon(false);
      return;
    }

    if (track.mode === "video") {
      if (this.ytPlayer && this.isYtReady) this.ytPlayer.pauseVideo();
      this.isPlaying = false;
      this._updatePlayIcon(false);
      this._stopVideoTicker();
    }
  }

  next() {
    if (!this.tracks.length) return;
    if (this.isShuffle) return this._playShuffle();
    let nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.tracks.length) nextIndex = 0;
    this.currentIndex = nextIndex;
    this.loadCurrent({ autoplay: true });
  }

  prev() {
    if (!this.tracks.length) return;
    if (this.isShuffle) return this._playShuffle();
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) prevIndex = this.tracks.length - 1;
    this.currentIndex = prevIndex;
    this.loadCurrent({ autoplay: true });
  }

  _playShuffle() {
    if (this.tracks.length <= 1) return;
    let idx;
    do {
      idx = Math.floor(Math.random() * this.tracks.length);
    } while (idx === this.currentIndex);
    this.currentIndex = idx;
    this.loadCurrent({ autoplay: true });
  }

  playByIndex(index) {
    if (!this.tracks?.length) return;

    const idx = Number(index);
    if (Number.isNaN(idx)) return;
    if (idx < 0 || idx >= this.tracks.length) return;

    if (idx === this.currentIndex) {
      // Bấm lại đúng bài -> toggle play/pause
      this.togglePlay();
      return;
    }

    this.currentIndex = idx;
    this.loadCurrent({ autoplay: true });
  }

  // Repeat / Shuffle
  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtnEl?.classList.toggle("repeat-active", this.isRepeat);
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.shuffleBtnEl?.classList.toggle("shuffle-active", this.isShuffle);
  }

  // Seek / Progress
  seekPercent(percent) {
    const p = Math.max(0, Math.min(100, Number(percent)));

    const track = this.tracks[this.currentIndex];
    if (!track) return;

    if (track.mode === "audio") {
      if (!this.audioEl || !this.audioEl.duration) return;
      this.audioEl.currentTime = (this.audioEl.duration * p) / 100;
      return;
    }

    if (track.mode === "video") {
      if (!this.ytPlayer || !this.isYtReady) return;
      const dur = Number(this.ytPlayer.getDuration?.() || 0);
      if (!dur) return;
      this.ytPlayer.seekTo((dur * p) / 100, true);
    }
  }

  _previewSeek(percent) {
    if (!this.currentTimeEl) return;
    const track = this.tracks[this.currentIndex];
    if (!track) return;

    const p = Math.max(0, Math.min(100, Number(percent)));

    // Preview theo duration đang có
    let dur = Number(track.duration || 0);
    if (track.mode === "audio" && this.audioEl?.duration)
      dur = this.audioEl.duration;
    if (track.mode === "video" && this.ytPlayer?.getDuration) {
      const ytDur = Number(this.ytPlayer.getDuration() || 0);
      if (ytDur) dur = ytDur;
    }

    if (dur > 0) {
      const previewTime = (dur * p) / 100;
      this.currentTimeEl.textContent = formatSecondsToHms(previewTime);
    }
  }

  _setProgress(percent) {
    if (this.progressEl) this.progressEl.value = String(percent);
    this._setProgressCSS(percent);
  }

  _setProgressCSS(percent) {
    if (!this.progressEl) return;
    const p = Math.max(0, Math.min(100, Number(percent)));
    // +0.45 để đỡ bị hụt phần fill ở đầu
    this.progressEl.style.setProperty("--p", `${p + 0.45}%`);
  }

  _updateTimeUI(current, duration) {
    if (this.currentTimeEl)
      this.currentTimeEl.textContent = formatSecondsToHms(current);
    if (this.durationTimeEl)
      this.durationTimeEl.textContent = formatSecondsToHms(duration);
  }

  setVolume(vol01, { updateUI = true } = {}) {
    const v = clamp01(vol01);
    if (v > 0) this.lastVolume = v;

    // Áp dụng cho audio
    if (this.audioEl) {
      this.audioEl.volume = v;
      this.audioEl.muted = v === 0;
    }

    // Áp dụng cho video (0-100)
    if (this.ytPlayer && this.isYtReady && this.ytPlayer.setVolume) {
      this.ytPlayer.setVolume(Math.round(v * 100));
      if (v === 0) this.ytPlayer.mute();
      else this.ytPlayer.unMute();
    }

    if (updateUI && this.volumeEl) {
      const v100 = Math.round(v * 100);
      this.volumeEl.value = String(v100);
      this.volumeEl.style?.setProperty("--p", `${v100}%`);
    }

    if (updateUI) this._updateVolumeIcon();
  }

  toggleMute() {
    // Nếu đang mute -> restore
    const current = this._getEffectiveVolume();
    if (current === 0) {
      const restore = this.lastVolume > 0 ? this.lastVolume : 0.8;
      this.setVolume(restore, { updateUI: true });
      return;
    }
    // Mute
    this.lastVolume = current > 0 ? current : this.lastVolume;
    this.setVolume(0, { updateUI: true });
  }

  _getEffectiveVolume() {
    // Ưu tiên audio vì luôn có volume
    if (this.audioEl) {
      return this.audioEl.muted ? 0 : clamp01(this.audioEl.volume);
    }
    // Video
    if (this.ytPlayer && this.isYtReady && this.ytPlayer.getVolume) {
      const v = clamp01(Number(this.ytPlayer.getVolume() || 0) / 100);
      return this.ytPlayer.isMuted() ? 0 : v;
    }
    return 0;
  }

  _updateVolumeIcon() {
    if (!this.volumeIconEl) return;
    const v = this._getEffectiveVolume();
    if (v === 0) this.volumeIconEl.textContent = "volume_off";
    else if (v < 0.5) this.volumeIconEl.textContent = "volume_down";
    else this.volumeIconEl.textContent = "volume_up";
  }

  // Audio events
  _onAudioLoadedMeta() {
    if (!this.audioEl) return;
    const dur = Number(this.audioEl.duration || 0);
    if (dur > 0) this._updateTimeUI(Number(this.audioEl.currentTime || 0), dur);
  }

  _onAudioTimeUpdate() {
    if (!this.audioEl) return;
    if (this.mode !== "audio") return;
    if (this.isSeeking) return;
    const dur = Number(this.audioEl.duration || 0);
    if (!dur) return;
    const cur = Number(this.audioEl.currentTime || 0);
    const percent = (cur / dur) * 100;
    this._setProgress(percent);
    this._updateTimeUI(cur, dur);
  }

  _onAudioEnded() {
    if (this.mode !== "audio") return;
    if (this.isRepeat) {
      this.audioEl.currentTime = 0;
      this.play();
      return;
    }
    this.next();
  }

  // YouTube
  async _ensureYouTubePlayer(videoId) {
    if (!this.ytHostId) throw new Error("Thiếu ytHostId (#videoIframe)");

    await ensureYouTubeAPI();

    // Nếu đã có player -> OK
    if (this.ytPlayer) return;

    this.isYtReady = false;

    this.ytPlayer = new window.YT.Player(this.ytHostId, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          this.isYtReady = true;
          this._applyVolumeToYt();
          this._syncDurationFromYt();
        },
        onStateChange: (e) => {
          // PLAYING
          if (e.data === window.YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this._updatePlayIcon(true);
            this._startVideoTicker();
          }
          // PAUSED
          if (e.data === window.YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this._updatePlayIcon(false);
            this._stopVideoTicker();
          }
          // ENDED
          if (e.data === window.YT.PlayerState.ENDED) {
            this._stopVideoTicker();
            if (this.isRepeat) {
              this.ytPlayer.seekTo(0, true);
              this.ytPlayer.playVideo();
            } else {
              this.next();
            }
          }
        },
      },
    });
  }

  _applyVolumeToYt() {
    const v = this._readSavedVolume();
    if (!this.ytPlayer || !this.isYtReady) return;
    this.ytPlayer.setVolume(Math.round(v * 100));
    if (v === 0) this.ytPlayer.mute();
    else this.ytPlayer.unMute();
  }

  _readSavedVolume() {
    try {
      const saved = localStorage.getItem(this.volumeStorageKey);
      if (saved !== null && saved !== "") return clamp01(parseFloat(saved));
    } catch (error) {
      console.log(error);
    }
    return clamp01(this.volumeEl ? Number(this.volumeEl.value) / 100 : 0.8);
  }

  _syncDurationFromYt() {
    if (!this.durationTimeEl || !this.ytPlayer || !this.isYtReady) return;
    const dur = Number(this.ytPlayer.getDuration() || 0);
    if (dur > 0) this.durationTimeEl.textContent = formatSecondsToHms(dur);
  }

  _startVideoTicker() {
    this._stopVideoTicker();
    this.videoTicker = window.setInterval(() => {
      if (!this.ytPlayer || !this.isYtReady) return;
      if (this.mode !== "video") return;
      if (this.isSeeking) return;
      const dur = Number(this.ytPlayer.getDuration() || 0);
      if (!dur) return;
      const cur = Number(this.ytPlayer.getCurrentTime() || 0);
      const percent = (cur / dur) * 100;
      this._setProgress(percent);
      this._updateTimeUI(cur, dur);
    }, 250);
  }

  _stopVideoTicker() {
    if (this.videoTicker) {
      window.clearInterval(this.videoTicker);
      this.videoTicker = null;
    }
  }

  // Common helpers
  _updatePlayIcon(isPlaying) {
    if (!this.playBtnEl) return;
    this.playBtnEl
      .querySelector(".js-icon-play")
      ?.classList.toggle("hidden!", isPlaying);
    this.playBtnEl
      .querySelector(".js-icon-pause")
      ?.classList.toggle("hidden!", !isPlaying);
  }

  _stopOtherMedia(nextMode) {
    // Chuyển qua audio -> dừng video
    if (nextMode === "audio") {
      if (this.ytPlayer && this.isYtReady) {
        this.ytPlayer.pauseVideo();
      }
      this._stopVideoTicker();
      return;
    }

    // Chuyển qua video -> dừng audio
    if (nextMode === "video") {
      if (this.audioEl) {
        this.audioEl.pause();
      }
    }
  }

  stopAll() {
    // Dừng hết (khi đóng detail)
    this.audioEl.pause();
    if (this.ytPlayer && this.isYtReady) this.ytPlayer.pauseVideo?.();
    this._stopVideoTicker();
    this.isPlaying = false;
    this._updatePlayIcon(false);
  }

  destroyVideoPlayer() {
    // Dùng khi remove VideoDetail khỏi DOM
    this._stopVideoTicker();
    if (this.ytPlayer && this.ytPlayer.destroy) {
      try {
        this.ytPlayer.destroy();
      } catch (error) {
        console.log(error);
      }
    }
    this.ytPlayer = null;
    this.isYtReady = false;
  }
}
