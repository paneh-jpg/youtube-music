export const VideoArea = (isAudio = true) => {
  const mediaHtml = isAudio
    ? `<audio id="audio" class="h-full w-full object-contain bg-black" preload="metadata" autoplay src=""></audio>`
    : `<video id="video" class="h-full w-full object-contain bg-black" preload="metadata" autoplay src=""></video>`;
  return ` <!--  LEFT: VIDEO AREA  -->
        <section class="rounded-xl bg-black/40 border border-white/10 overflow-hidden" >
          <div class="relative aspect-video bg-black">
            ${mediaHtml}

            <!-- overlay play button center (optional) -->
            <button
              id="bigPlay"
              type="button"
              class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition"
              aria-label="Play"
            >
              <div class="h-16 w-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center" >
                <svg class="h-7 w-7 translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor" > <path d="M8 5v14l11-7z"></path>
                </svg>
              </div>
            </button>
          </div>
        </section>
`;
};
