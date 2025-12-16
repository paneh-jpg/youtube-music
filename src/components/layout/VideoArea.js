export const VideoArea = (isAudio = true) => {
  const mediaHtml = isAudio
    ? `<audio id="audio" class="h-full w-full object-contain bg-black" preload="metadata" autoplay src=""></audio>
      <img src="" class="main-img w-full h-full object-cover" />`
    : `<video id="video" class="h-full w-full object-contain bg-black" preload="metadata" autoplay src=""></video>`;
  return ` <!--  LEFT: VIDEO AREA  -->
        <section class="rounded-xl bg-black/40 border border-white/10 overflow-hidden" >
          <div class="relative h-full  bg-black">
            ${mediaHtml}

          
              <div class="h-16 w-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center" >
                <svg class="h-7 w-7 translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor" > <path d="M8 5v14l11-7z"></path>
                </svg>
              </div>
            </button>
          </div>
        </section>
`;
};
