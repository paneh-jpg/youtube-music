export const PlayerControl = () => {
  return `  <footer class="fixed player-bar player-hidden  left-0 right-0 bottom-0 z-100 bg-[#1f1f1f]">
      <!-- TOP PROGRESS -->
      <div class="-mt-3.5">
        <input
          type="range"
          min="0"
          max="100"
          step = "1"
          value="0"
          class="js-progress w-full"
          aria-label="progress"

        />
      </div>

      <!-- MAIN BAR -->
      <div class="px-2 ">
        <div class="mx-auto w-full flex items-center justify-between gap-4">
          <!-- LEFT: transport + time -->
          <div class="w-1/4 flex items-center gap-3 min-w-65">
            <button
              type="button"
              class="js-prev h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Previous"
              title="Previous"
            >
              <span class="material-symbols-outlined text-[26px]">skip_previous</span>
            </button>

            <button
              type="button"
              class="js-play h-12 w-12 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
              aria-label="Play/Pause"
              title="Play/Pause"
            >
              <span class="js-icon-play material-symbols-outlined text-[30px]" >play_arrow</span
              >
              <span
                class="js-icon-pause material-symbols-outlined text-[30px] hidden!" >pause</span>
            </button>

            <button
              type="button"
              class="js-next h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Next"
              title="Next"
            >
              <span class="material-symbols-outlined text-[26px]" >skip_next</span>
            </button>

            <div class="ml-3 text-sm text-white/70 whitespace-nowrap">
              <span class="js-current-time">0:00</span>
              <span class="text-white/40"> / </span>
              <span class="js-duration-time">0:00</span>
            </div>
          </div>

          <!-- CENTER: thumbnail + title/meta + actions -->
          <div class="ml-50 w-2/4 flex items-center gap-4 min-w-0 pb-2">
            <div
              class="w-12 h-12 rounded-md overflow-hidden bg-white/10 shrink-0"
            >
              <img
                class="js-thumb h-full w-full object-cover"
                src="https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg"
                alt=""
              />
            </div>

            <div class="min-w-0">
              <div class="flex items-center justify-between gap-3 min-w-0">
                <p class="js-title truncate font-semibold">Song name</p>

                <div class="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    class="js-like h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
                    aria-label="Like"
                    title="Like"
                  >
                    <span class="material-symbols-outlined text-[22px]"
                      >thumb_up</span
                    >
                  </button>

                  <button
                    type="button"
                    class="js-dislike h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
                    aria-label="Dislike"
                    title="Dislike"
                  >
                    <span class="material-symbols-outlined text-[22px]"
                      >thumb_down</span
                    >
                  </button>

                  <button
                    type="button"
                    class="js-more h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
                    aria-label="More"
                    title="More" >
                    <span class="material-symbols-outlined text-[24px]" >more_vert</span>
                  </button>
                </div>
              </div>
              <p class="js-meta truncate -mt-2 text-sm text-white/60">
                Singer • Views • Likes
              </p>
            </div>
          </div>

          <!-- RIGHT: volume + misc -->
          <div class="w-1/4 flex items-center justify-end gap-2">
            <button
              type="button"
              class="js-volume-btn h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Volume"
              title="Volume"
            >
              <span class="js-volume-icon material-symbols-outlined text-[24px]" >volume_up</span>
            </button>

            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value="80"
              class="js-volume w-28"
              aria-label="volume"
            />

            <button
              type="button"
              class="js-repeat  h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Repeat"
              title="Repeat"
            >
              <span class="material-symbols-outlined text-[24px]">repeat</span>
            </button>

            <button
              type="button"
              class="js-shuffle  h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Shuffle"
              title="Shuffle"
            >
              <span class="material-symbols-outlined text-[24px]">shuffle</span>
            </button>

            <button
              type="button" id="hide-player-btn"
              class="js-menu h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              aria-label="Menu"
              title="Menu"
            >
              <span class="material-symbols-outlined text-[26px]"
                >arrow_drop_down</span
              >
            </button>
          </div>
        </div>
      </div>

      <!-- Persistent media elements (do NOT put these inside routed pages) -->
      <audio id="audio" class="hidden" preload="metadata" src=""></audio>
      <video id="video" class="hidden" preload="metadata" playsinline src=""></video>
    </footer>`;
};
