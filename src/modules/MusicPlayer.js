import { formatSecondsToHms } from "../utils/utils";

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
    currentTimeEl,
    durationTimeEl,
    songTitleEl,
    randomBtn,
    queueListContainer,
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
    this.currentTimeEl = currentTimeEl;
    this.durationTimeEl = durationTimeEl;
    this.songTitleEl = songTitleEl;
    this.randomBtn = randomBtn;
    this.queueListContainer = queueListContainer;

    // Data
    this.tracks = tracks;
    this.isPlaying = false;
    this.isSeeking = false;
    this.currentTrackIndex = this.tracks.findIndex(
      (item) => item.id === initialSongId
    );

    // Gọi phương thức khởi tạo
    this.renderQueue();
    this.loadTrack(this.currentTrackIndex);

    this.addEventListeners();
  }

  // Tải thông tin và audio bài hát
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
    this.play();
  }

  // Hiển thị danh sách chờ
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
              id === currentTrackId ? "bg-white/5" : "" // So sánh với ID để highlight
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
  }

  // Cập nhật active cho item đang phát
  updateQueueActive(trackId) {
    // Bỏ active cũ
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

  // Phương thức play/pause
  play() {
    this.audio.play();
    this.isPlaying = true;

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
    let nextIndex = this.currentTrackIndex + 1;
    if (nextIndex >= this.tracks.length) {
      nextIndex = 0; // Quay lại bài đầu tiên
    }

    this.loadTrack(nextIndex);
    this.play();
  }

  prev() {
    let prevIndex = this.currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.tracks.length - 1;
    }

    this.loadTrack(prevIndex);
    this.play();
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

  // Xử lý sự kiện
  addEventListeners() {
    // Play/Pause
    this.playBtn.addEventListener("click", () => {
      this.isPlaying ? this.pause() : this.play();
    });

    // Next
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

    // Tự chuyển bài khi kết thúc
    this.audio.addEventListener("ended", () => {
      this.next();
    });

    //
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio.duration > 0) {
        const ratio = this.audio.currentTime / this.audio.duration;
        const progressPercent = Math.floor(ratio * 100);

        this.progressEl.value = progressPercent;

        this.progressEl.style.setProperty("--p", `${progressPercent}%`);

        this.updateTimeDisplay(this.audio.currentTime, this.audio.duration);
      }
    });
  }
}
