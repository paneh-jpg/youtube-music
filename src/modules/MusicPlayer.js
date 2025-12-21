// MusicPlayer.js
import { formatSecondsToHms } from "../utils/utils.js";
import { saveListenHistory } from "../api/authApi.js";

export class MusicPlayer {
  constructor({
    audioEl,
    currentTrackNameEl,
    currentTrackThumbEl,
    songImgEl,
    playBtn,
    progressEl,
    nextBtn,
    prevBtn,
    repeatBtn,
    shuffleBtn,
    currentTimeEl,
    durationTimeEl,
    songTitleEl,
    queueListContainer,

    // (Optional)
    volumeEl,
    volumeBtn,
    volumeIconEl,

    tracks,
    initialSongId,
  }) {
    // Elements
    this.audio = audioEl;
    this.currentTrackNameEl = currentTrackNameEl;
    this.currentTrackThumbEl = currentTrackThumbEl;
    this.songImgEl = songImgEl;
    this.playBtn = playBtn;
    this.progressEl = progressEl;
    this.nextBtn = nextBtn;
    this.prevBtn = prevBtn;
    this.repeatBtn = repeatBtn;
    this.shuffleBtn = shuffleBtn;
    this.currentTimeEl = currentTimeEl;
    this.durationTimeEl = durationTimeEl;
    this.songTitleEl = songTitleEl;
    this.queueListContainer = queueListContainer;

    this.playerBar = document.querySelector(".player-bar");
    this.hideBtn = document.getElementById("hide-player-btn");

    // Volume elements
    this.volumeEl = volumeEl;
    this.volumeBtn = volumeBtn;
    this.volumeIconEl = volumeIconEl;

    // Data
    this.tracks = tracks;

    this.isPlaying = false;
    this.isSeeking = false;
    this.isRandom = false;
    this.isRepeat = false;

    this.originalTracks = [...tracks];

    this.currentTrackIndex = this.tracks.findIndex(
      (item) => item.id === initialSongId
    );

    // Volume state
    this.lastVolume = 0.8; // dùng để restore khi unmute
    this.volumeStorage = "player_volume";

    // Gọi phương thức khởi tạo
    this.renderQueue();
    this.loadTrack(this.currentTrackIndex);

    this.bindQueueEvents();

    // Init volume trước khi add listeners để slider/volume sync ngay từ đầu
    this.initVolume();

    this.addEventListeners();
    this.initVisibilityEvents();
  }

  // Visibility
  initVisibilityEvents() {
    this.hideBtn = document.getElementById("hide-player-btn");
    if (this.hideBtn) {
      // Xử lý ẩn Player Control
      this.hideBtn.onclick = () => {
        this.hidePlayer();
        this.pause();
      };
    }
  }

  showPlayer() {
    if (this.playerBar) {
      this.playerBar.classList.remove("player-hidden");
      this.playerBar.classList.add("player-visible");
    }
  }

  hidePlayer() {
    if (this.playerBar) {
      this.playerBar.classList.remove("player-visible");
      this.playerBar.classList.add("player-hidden");
    }
  }

  // Tránh trường hợp chuỗi rỗng, NaN,... dữ liệu không hợp lệ
  clamp01(n) {
    const x = Number(n);
    if (Number.isNaN(x)) return 0;
    return Math.min(1, Math.max(0, x));
  }

  setVolume(vol01, { save = true, updateUI = true } = {}) {
    if (!this.audio) return;

    const v = this.clamp01(vol01);
    this.audio.volume = v;

    // Nếu kéo về 0 thì coi như mute
    this.audio.muted = v === 0;

    if (v > 0) this.lastVolume = v;

    if (save) {
      try {
        localStorage.setItem(this.volumeStorage, String(v));
      } catch (_) {}
    }

    if (updateUI) {
      if (this.volumeEl) {
        const v100 = Math.round(v * 100);
        this.volumeEl.value = String(v100);
        this.volumeEl.style?.setProperty("--p", `${v100}%`);
      }
      this.updateVolumeIcon();
    }
  }

  //Cập nhật icon
  updateVolumeIcon() {
    if (!this.volumeIconEl || !this.audio) return;

    const v = this.audio.muted ? 0 : this.audio.volume;

    if (v === 0) this.volumeIconEl.textContent = "volume_off";
    else if (v < 0.5) this.volumeIconEl.textContent = "volume_down";
    else this.volumeIconEl.textContent = "volume_up";
  }

  toggleMute() {
    if (!this.audio) return;

    // Nếu đang mute hoặc volume=0 -> unmute về lastVolume
    const isMuted = this.audio.muted || this.audio.volume === 0;
    if (isMuted) {
      const restore = this.lastVolume > 0 ? this.lastVolume : 0.8;
      this.audio.muted = false;
      this.setVolume(restore, { save: true, updateUI: true });
      return;
    }

    // Nếu đang có tiếng -> lưu lại rồi mute (set volume 0)
    this.lastVolume =
      this.audio.volume > 0 ? this.audio.volume : this.lastVolume;
    this.setVolume(0, { save: true, updateUI: true });
  }

  initVolume() {
    if (!this.audio) return;

    let initial = null;

    // 1) ưu tiên localStorage
    try {
      const saved = localStorage.getItem(this.volumeStorage);
      if (saved !== null && saved !== undefined && saved !== "") {
        initial = this.clamp01(parseFloat(saved));
      }
    } catch (_) {}

    // 2 lấy từ input range hiện tại
    if (initial === null) {
      if (this.volumeEl && this.volumeEl.value !== undefined) {
        const v100 = Number(this.volumeEl.value);
        if (!Number.isNaN(v100)) initial = this.clamp01(v100 / 100);
      }
    }

    // 3)  0.8
    if (initial === null) initial = 0.8;

    this.setVolume(initial, { save: false, updateUI: true });
  }

  // ==========================
  // Track
  // ==========================
  loadTrack(index) {
    if (index < 0 || index >= this.tracks.length) return;

    const track = this.tracks[index];
    this.currentTrackIndex = index;

    this.songImgEl.src = track.thumbnails;
    this.currentTrackThumbEl.src = track.thumbnails;
    this.audio.src = track.audioUrl;
    this.currentTrackNameEl.textContent = track.title;
    this.songTitleEl.textContent = track.title;

    this.updateQueueActive(track.id);
    this.scrollToActiveTrack();
    this.audio.load();

    // giữ volume theo state hiện tại sau khi load src mới
    this.updateVolumeIcon();

    this.play();
  }

  bindQueueEvents() {
    if (!this.queueListContainer) return;

    this.queueListContainer.onclick = null;

    this.queueListContainer.onclick = async (e) => {
      const trackItem = e.target.closest(".js-queue-item");
      if (trackItem) {
        const trackId = trackItem.dataset.id;

        const response = await saveListenHistory(trackId);
        const index = this.tracks.findIndex(
          (track) => String(track.id) === String(trackId)
        );

        if (index !== -1) {
          this.loadTrack(index);
          this.play();
        }
      }
    };
  }

  renderQueue() {
    const currentTrackId = this.tracks[this.currentTrackIndex].id;
    const queueHtml = this.tracks
      .map((track) => {
        const artistsArr = Array.isArray(track.artists) ? track.artists : [];
        const id = track.id;
        const title = track.title;
        const artist =
          artistsArr.length > 0
            ? artistsArr
                .map((a) => a.name ?? a)
                .filter(Boolean)
                .join(", ")
            : "Ca sĩ";
        const duration = Number(track.duration || 0);

        const thumb =
          track.thumbnails ||
          "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";
        return `
          <button data-id=${id}
            class="cursor-pointer js-queue-item w-full text-left px-5 py-3 hover:bg-white/5 ${
              id === currentTrackId ? "bg-white/5" : ""
            } transition flex items-center gap-3"
          >
            <div class="w-12 h-12 rounded-md overflow-hidden bg-white/10 relative">
              <img class="h-full w-full object-cover" src="${thumb}" alt="" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/35 ">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold">${title}</p>
              <p class="truncate text-sm text-white/60">${artist}</p>
            </div>

            <div class="text-sm text-white/60">${formatSecondsToHms(
              duration
            )}</div>
          </button>
        `;
      })
      .join("");

    this.queueListContainer.innerHTML = queueHtml;
    this.bindQueueEvents();
  }

  updateQueueActive(trackId) {
    this.queueListContainer
      .querySelectorAll(".js-queue-item")
      .forEach((item) => {
        item.classList.remove("bg-white/5");
      });
    const currentItem = this.queueListContainer.querySelector(
      `[data-id="${trackId}"]`
    );
    if (currentItem) {
      currentItem.classList.add("bg-white/5");
    }
  }

  play() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.showPlayer();
        })
        .catch((error) => {
          console.error("Playback interrupted:", error);
        });
    }

    const pause = this.playBtn.querySelector(".js-icon-pause");
    pause.classList.remove("hidden!");

    const play = this.playBtn.querySelector(".js-icon-play");
    play.classList.add("hidden!");
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;

    const pause = this.playBtn.querySelector(".js-icon-pause");
    pause.classList.add("hidden!");

    const play = this.playBtn.querySelector(".js-icon-play");
    play.classList.remove("hidden!");
  }

  next() {
    if (this.isRandom) {
      this.playShuffleTrack();
    } else {
      let nextIndex = this.currentTrackIndex + 1;
      if (nextIndex >= this.tracks.length) nextIndex = 0;
      this.loadTrack(nextIndex);
    }
  }

  prev() {
    if (this.isRandom) {
      this.playShuffleTrack();
    } else {
      let prevIndex = this.currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = this.tracks.length - 1;
      this.loadTrack(prevIndex);
    }
  }

  playShuffleTrack() {
    let shuffleIndex;
    do {
      shuffleIndex = Math.floor(Math.random() * this.tracks.length);
    } while (shuffleIndex === this.currentTrackIndex && this.tracks.length > 1);
    this.loadTrack(shuffleIndex);
  }

  toggleShuffle() {
    this.isRandom = !this.isRandom;
    this.shuffleBtn.classList.toggle("shuffle-active", this.isRandom);
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtn.classList.toggle("repeat-active", this.isRepeat);
  }

  updateTimeDisplay(currentTime, durationTime) {
    const formattedCurrentTime = formatSecondsToHms(currentTime);
    const formattedDuration = formatSecondsToHms(durationTime);
    this.currentTimeEl.textContent = formattedCurrentTime;
    this.durationTimeEl.textContent = formattedDuration;
  }

  scrollToActiveTrack() {
    const activeItem = this.queueListContainer.querySelector(
      " .js-queue-item.bg-white\\/5"
    );

    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  addEventListeners() {
    // Play/Pause
    this.playBtn.addEventListener("click", () => {
      this.isPlaying ? this.pause() : this.play();
    });

    // Next/Prev
    this.nextBtn.addEventListener("click", () => this.next());
    this.prevBtn.addEventListener("click", () => this.prev());

    // Click vào item trong hàng đợi
    this.queueListContainer.addEventListener("click", (e) => {
      const queueItem = e.target.closest(".js-queue-item");
      if (queueItem) {
        const id = queueItem.dataset.id;
        const newIndex = this.tracks.findIndex((track) => track.id === id);
        if (newIndex !== -1 && newIndex !== this.currentTrackIndex) {
          this.loadTrack(newIndex);
          this.play();
        }
      }
    });

    // Time update -> progress
    this.audio.addEventListener("timeupdate", () => {
      if (this.isSeeking) return;
      if (this.audio.duration > 0) {
        const ratio = this.audio.currentTime / this.audio.duration;
        const progressPercent = ratio * 100;

        this.progressEl.value = progressPercent;
        this.progressEl.style.setProperty("--p", `${progressPercent}%`);

        this.updateTimeDisplay(this.audio.currentTime, this.audio.duration);
      }
    });

    // Seek
    this.progressEl.addEventListener("pointerdown", () => {
      this.isSeeking = true;
    });

    this.progressEl.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      this.progressEl.style.setProperty("--p", `${val}%`);

      if (this.audio.duration > 0) {
        const previewTime = (this.audio.duration * val) / 100;
        this.currentTimeEl.textContent = formatSecondsToHms(previewTime);
      }
    });

    this.progressEl.addEventListener("change", (e) => {
      if (this.audio.duration > 0) {
        const val = Number(e.target.value);
        this.audio.currentTime = (this.audio.duration * val) / 100;
      }
      this.isSeeking = false;
    });

    this.progressEl.addEventListener("pointerup", () => {
      this.isSeeking = false;
    });

    // Ended
    this.audio.addEventListener("ended", () => {
      if (this.isRepeat) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.next();
      }
    });

    // Shuffle/Repeat
    this.shuffleBtn.onclick = () => this.toggleShuffle();
    this.repeatBtn.onclick = () => this.toggleRepeat();

    // Volume events
    if (this.volumeEl) {
      this.volumeEl.addEventListener("input", (e) => {
        const v100 = Number(e.target.value);

        const v = this.clamp01(v100 / 100);
        this.setVolume(v, { save: true, updateUI: true });
      });

      this.volumeEl.addEventListener("change", (e) => {
        const v100 = Number(e.target.value);
        const v = this.clamp01(v100 / 100);
        this.setVolume(v, { save: true, updateUI: true });
      });
    }

    if (this.volumeBtn) {
      this.volumeBtn.addEventListener("click", () => this.toggleMute());
    }
  }
}
