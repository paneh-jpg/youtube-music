export const VideoArea = (isAudio = true) => {
  // NOTE:
  // - Media elements (<audio>/<video>) must be persistent to keep playing across route changes.
  // - This component only renders the VISUAL area (cover image / a slot for future video).
  const mediaHtml = isAudio
    ? `
      <div class="js-media-slot hidden"></div>
      <img src="" class="main-img w-full h-full object-cover" />
    `
    : `
      <div class="js-media-slot h-full w-full bg-black"></div>
    `;

  return ` <!--  LEFT: VIDEO AREA  -->
        <section class="rounded-xl bg-black/40 border border-white/10 overflow-hidden" >
          <div class="relative h-full bg-black">
            ${mediaHtml}

            <button class="absolute inset-0 flex items-center justify-center">
              <div class="h-16 w-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center" >
                <svg class="h-7 w-7 translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </div>
            </button>
          </div>
        </section>
`;
};
