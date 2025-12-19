export const VideoArea = (isAudio = true) => {
  // - Các phần tử media (<audio>/<video>) phải được giữ tồn tại xuyên suốt khi chuyển route để việc phát nhạc/video không bị gián đoạn.
  // - Component này CHỈ render phần giao diện hiển thị (ảnh cover / vùng chứa để sau này gắn video).
  const mediaHtml = isAudio
    ? `
      <div class="js-media-slot hidden"></div>
      <img src="" class="main-img w-full h-full object-cover" />
    `
    : `
      <iframe id="videoIframe" class="w-full aspect-video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
    `;

  return ` <!--  LEFT: VIDEO AREA  -->
        <section class="rounded-xl bg-black/40 border border-white/10 overflow-hidden" >
          <div class="relative h-full bg-black">
            ${mediaHtml}

          <!--  <button class="absolute inset-0 flex items-center justify-center">
              <div class="h-16 w-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center" >
                <svg class="h-7 w-7 translate-x-px" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg> 
              </div>
            </button>-->
          </div>
        </section>
`;
};
