export const Panel = () => {
  return `        <!--  RIGHT: PANEL  -->
        <aside class=" rounded-xl bg-black/40 border border-white/10 overflow-hidden flex flex-col">
          <!-- Tabs -->
          <div class="px-5 p-4">
            <div class="flex items-center justify-between gap-8 border-b border-white/10">
              <button class="tab-btn pb-3 text-sm font-semibold tracking-wide text-white border-b-2 border-white" data-tab="next" >
                TIẾP THEO
              </button>
              <button class="tab-btn pb-3 text-sm font-semibold tracking-wide text-white/50 hover:text-white" data-tab="lyrics" >
                LỜI NHẠC
              </button>
              <button class="tab-btn pb-3 text-sm font-semibold tracking-wide text-white/50 hover:text-white" data-tab="related" >
                LIÊN QUAN
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-h-0">
            <!--  TAB: NEXT  -->
            <div class="tab-panel h-full" data-panel="next">
              <div class="px-5 py-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-xs text-white/60">Đang phát từ</p>
                    <h3 class="mt-1 font-semibold leading-tight"> Nhạc Acoustic Album 9 - Bài 5</h3>
                  </div>
                </div>

                <div class="mt-5 flex items-center justify-between">
                   <p class="text-md font-semibold"> Các bài hát tiếp theo: </p>
                </div>
              </div>

              <!-- Queue list -->
              <div class="border-t border-white/10"></div>
              <div class="h-full overflow-y-auto no-scrollbar">
                <!-- Item active -->
                <button
                  class="queue-item w-full text-left px-5 py-3 hover:bg-white/5 transition flex items-center gap-3 bg-white/5"
                  data-src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  data-title="Nhạc Acoustic Album 9 - Bài 5"
                  data-artist="HTM"
                  data-duration="158">
                  <div class="w-12 h-12 rounded-md overflow-hidden bg-white/10 relative">
                    <img class="h-full w-full object-cover"
                      src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                      alt="" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/35" >
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor" >
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate font-semibold">
                      Nhạc Acoustic Album 9 - Bài 5
                    </p>
                    <p class="truncate text-sm text-white/60">Ca sĩ</p>
                  </div>

                  <div class="text-sm text-white/60">2:38</div>
                </button>

                <!-- Other items -->
                <button
                  class="queue-item w-full text-left px-5 py-3 hover:bg-white/5 transition flex items-center gap-3"
                  data-src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                 
                >
                  <div class="w-12 h-12 rounded-md overflow-hidden bg-white/10">
                    <img
                      class="h-full w-full object-cover"
                      src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                      alt=""
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate font-semibold">
                     Nhạc Acoustic Album 9 - Bài 5
                    </p>
                    <p class="truncate text-sm text-white/60">Ca sĩ</p>
                  </div>

                  <div class="text-sm text-white/60">3:54</div>
                </button>

                <button
                  class="queue-item w-full text-left px-5 py-3 hover:bg-white/5 transition flex items-center gap-3"
                >
                  <div class="w-12 h-12 rounded-md overflow-hidden bg-white/10">
                    <img
                      class="h-full w-full object-cover"
                      src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                      alt=""
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate font-semibold">
                    Nhạc Acoustic Album 9 - Bài 5
                    </p>
                    <p class="truncate text-sm text-white/60">Ca sĩ</p>
                  </div>

                  <div class="text-sm text-white/60">4:30</div>
                </button>

                <button
                  class="queue-item w-full text-left px-5 py-3 hover:bg-white/5 transition flex items-center gap-3"
                 
                >
                  <div class="w-12 h-12 rounded-md overflow-hidden bg-white/10">
                    <img
                      class="h-full w-full object-cover"
                      src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                      alt=""
                    />
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="truncate font-semibold">Nhạc Acoustic Album 9 - Bài 5</p>
                    <p class="truncate text-sm text-white/60">Ca sĩ</p>
                  </div>

                  <div class="text-sm text-white/60">3:18</div>
                </button>
              </div>
            </div>

            <!--  TAB: LYRICS  -->
            <div class="tab-panel hidden h-full" data-panel="lyrics">
              <div class="px-5 py-4">
               
              </div>
            </div>

            <!--  TAB: RELATED  -->
            <div class="tab-panel hidden h-full" data-panel="related">
              <div class="px-5 py-4">
                
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>`;
};
