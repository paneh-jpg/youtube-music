export const VideoArea = (isAudio = true) => {
  const mediaHtml = isAudio
    ? `
      <div class="js-media-slot hidden"></div>
      <img src="" class="main-img w-full h-full object-cover bg-white/5 border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.55)]" />
    `
    : `
      <div id="videoIframe" class=" w-full h-full bg-black"></div>
    `;

  return ` <!--  LEFT: VIDEO AREA  -->
        <section class="rounded-xl bg-black/40 border text-white border-white/10 overflow-hidden" >
          <div class="js-video-container relative h-[76vh] bg-black">
            ${mediaHtml}

             <!-- Top-right controls -->
             <div class="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <!-- PiP / Mini -->
              <button
                type="button"
                class="js-video-mini-btn h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center"
                aria-label="Picture in picture"
                title="Picture in picture"
              >
                   <span class="material-symbols-outlined text-[22px]">picture_in_picture_alt</span>
              </button>

              <!-- Close -->
              <button
                type="button"
                class="js-song-detail-close js-video-detail-close h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center"
                aria-label="Close"
                title="Close">
                   <span class="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
          </div>
        </section>
`;
};
