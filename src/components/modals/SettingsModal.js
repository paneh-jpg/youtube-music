export const SettingsModal = () => {
  return `
    <div class="js-settings-modal fixed inset-0 z-9 hidden">
      <div class="js-modal-overlay absolute inset-0 bg-black/60"></div>

      <div
        class="absolute left-1/2 top-1/2 w-[58vw] max-w-5xl h-[72vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#2b2b2b] text-white shadow-2xl border border-white/10 flex overflow-hidden" >
        <aside class="w-67.5 bg-[#2f2f2f] border-r border-white/10">
          <div class="px-6 py-5">
            <h2 class="text-2xl font-semibold">Cài đặt</h2>
          </div>

          <nav class="px-2 pb-4 space-y-1">
            <button type="button" class="js-tab w-full text-left px-4 py-3 rounded-lg bg-white/10 font-semibold" data-tab="profile" >
              Đổi thông tin
            </button>

            <button type="button" class="js-tab w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-white/90" data-tab="password" >
              Đổi mật khẩu
            </button>
          </nav>
        </aside>

        <section class="flex-1 relative">
          <button type="button" class="js-modal-close absolute right-3 top-3 h-10 w-10 rounded-full hover:bg-white/10 
                                          flex items-center justify-center text-white/80 hover:text-white">
                ✕
          </button>

          <div class="h-full overflow-y-auto px-8 py-7 pr-10">
            <!-- Profile -->
            <div class="js-pane" data-pane="profile">
              <h3 class="text-xl font-semibold mb-1">
                Đổi thông tin người dùng
              </h3>
              <p class="text-white/60 mb-6">Cập nhật tên và email của bạn.</p>

              <form class="js-form-profile space-y-5 max-w-xl">
                <div>
                  <label class="block text-sm text-white/70 mb-2">Tên</label>
                  <input name="name" autocomplete="name" class="js-username w-full rounded-lg bg-[#1f1f1f] border border-white/10
                                                                px-4 py-3 outline-none focus:border-white/30" placeholder="Nhập tên mới..."/>
                </div>

                <div>
                  <label class="block text-sm text-white/70 mb-2">Email</label>
                  <input name="email" type="email" autocomplete="email" class="js-user-email w-full rounded-lg bg-[#1f1f1f] border border-white/10
                                                                               px-4 py-3 outline-none focus:border-white/30" placeholder="Nhập email mới..." />
                </div>

                <button type="submit" class="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-white/90" >
                  Lưu thay đổi
                </button>
              </form>
            </div>

            <!-- Password -->
            <div class="js-pane hidden" data-pane="password">
              <h3 class="text-xl font-semibold mb-1">Đổi mật khẩu</h3>
              <p class="text-white/60 mb-6">
                Nhập mật khẩu cũ và mật khẩu mới.
              </p>

              <form class="js-form-password space-y-5 max-w-xl">
                <div>
                  <label class="block text-sm text-white/70 mb-2">
                    Mật khẩu cũ
                  </label>
                  <input name="oldPassword" type="password" autocomplete="current-password" class="w-full rounded-lg bg-[#1f1f1f] border border-white/10
                                                                                                   px-4 py-3 outline-none focus:border-white/30" placeholder="Nhập mật khẩu cũ..." />
                </div>

                <div>
                  <label class="block text-sm text-white/70 mb-2">
                    Mật khẩu mới
                  </label>
                  <input name="newPassword" type="password" autocomplete="new-password"
                         class="w-full rounded-lg bg-[#1f1f1f] border border-white/10
                                px-4 py-3 outline-none focus:border-white/30" placeholder="Nhập mật khẩu mới..." />
                </div>

                <div>
                  <label class="block text-sm text-white/70 mb-2">
                    Nhập lại mật khẩu mới
                  </label>
                  <input name="confirmPassword" type="password" autocomplete="new-password"
                    class="w-full rounded-lg bg-[#1f1f1f] border border-white/10
                           px-4 py-3 outline-none focus:border-white/30" placeholder="Nhập lại mật khẩu mới..."/>
                </div>

                <button type="submit" class="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-white/90">
                  Đổi mật khẩu
                </button>
              </form>
            </div>

            <div class="h-10"></div>
          </div>
        </section>
      </div>
    </div>
  `;
};
