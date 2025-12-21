import { getProfileApi, changePasswordApi } from "../api/userApi.js";
import { SettingsModal } from "../components/modals/SettingsModal.js";
import { updateProfileApi } from "../api/userApi.js";
import { toast } from "../components/common/Toast.js";

import { escapeHTML, generateAvatar } from "../utils/utils.js";
import { hideLoading, showLoading } from "../utils/loading.js";
import { getListenHistory } from "../api/authApi.js";

export function ProfilePage() {
  return `
      <!--  Main content  -->
      <div class="h-screen">
        <div class="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <!-- Avatar -->
          <div class="profile-avatar w-28 h-28 md:w-36 md:h-36 shrink-0 rounded-full bg-gray-600 text-white text-9xl md:text-5xl font-bold flex items-center justify-center mx-auto md:mx-0">A</div>

          <!-- Info -->
          <div class="text-center md:text-left">
            <h1 class="user-name text-3xl md:text-4xl font-bold">
              Tên người dùng
            </h1>
            <p id="profileSub" class="text-white/60 text-base md:text-lg mt-1">
              Không có người đăng ký
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row items-center gap-3 ml-auto md:ml-auto mt-4 md:mt-0" >
            <button class="js-open-settings cursor-pointer flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium border border-white/20 w-full sm:w-auto">
              <span class="material-symbols-outlined text-base">edit</span>
              Chỉnh sửa
            </button>

            <button class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium border border-white/20 w-full sm:w-auto">
              <span class="cursor-pointer material-symbols-outlined text-base">share</span>
              Chia sẻ
            </button>
          </div>
        </div>

        <!-- Section -->
        <h2 class="text-xl md:text-2xl font-semibold mt-14 mb-4 text-center md:text-left" >
          Đài phát của bạn
        </h2>

        <!-- Empty state -->
        <div class="text-center mt-8 px-4">
          <p class="text-white/50 text-base md:text-lg mb-6 leading-relaxed">
            Nghe nhiều nhạc hơn để chúng tôi có thể tạo ra một đài phát phù hợp
            với sở thích của bạn
          </p>

          <button class="flex items-center gap-2 mx-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2.5 rounded-full font-medium" >
            <span class="material-symbols-outlined text-lg">home</span>
            <a href="/" data-navigo>Khám phá nhạc</a>
          </button>
        </div>

        ${SettingsModal()}
      </div>

  `;
}

export function initProfilePage() {
  initSettingsModal();
  renderProfile();
}

const renderProfile = async () => {
  const username = document.querySelector(".user-name");
  const userAvt = document.querySelector(".profile-avatar");

  try {
    showLoading();
    const response = await getProfileApi();
    const user = response.data;

    const avt = generateAvatar(user.name);
    username.textContent = user.name;
    userAvt.textContent = avt.char;
    userAvt.style.color = avt.text;
    userAvt.style.backgroundColor = avt.bg;

    const response2 = await getListenHistory();
    console.log(response2);
  } catch (error) {
    toast.error(error.data.message || "Có lỗi xảy ra");
  } finally {
    hideLoading();
  }
};

const initSettingsModal = async () => {
  const modal = document.querySelector(".js-settings-modal");
  if (!modal) return;

  const openBtn = document.querySelector(".js-open-settings");
  const overlay = modal.querySelector(".js-modal-overlay");
  const closeBtn = modal.querySelector(".js-modal-close");

  const tabs = modal.querySelectorAll(".js-tab");
  const panes = modal.querySelectorAll(".js-pane");

  const formProfile = modal.querySelector(".js-form-profile");
  const formPassword = modal.querySelector(".js-form-password");

  const setTab = (name) => {
    tabs.forEach((btn) => {
      const active = btn.dataset.tab === name;
      btn.classList.toggle("bg-white/10", active);
      btn.classList.toggle("font-semibold", active);
      btn.classList.toggle("hover:bg-white/5", !active);
      btn.classList.toggle("text-white/90", !active);
    });

    panes.forEach((pane) => {
      pane.classList.toggle("hidden", pane.dataset.pane !== name);
    });
  };

  const openModal = () => {
    modal.classList.remove("hidden");
    setTab("profile");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    window.location.reload();
  };

  openBtn.onclick = () => {
    openModal();
  };

  overlay?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  tabs.forEach((btn) =>
    btn.addEventListener("click", () => setTab(btn.dataset.tab))
  );

  const username = document.querySelector(".js-username");
  const userEmail = document.querySelector(".js-user-email");

  const userInfo = await getProfileApi();

  username.value = userInfo.data.name;
  userEmail.value = userInfo.data.email;

  formProfile?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userInfo = new FormData(formProfile);
    const name = escapeHTML((userInfo.get("name") || "").toString().trim());
    const email = escapeHTML((userInfo.get("email") || "").toString().trim());

    if (!name || !email) return;

    try {
      await updateProfileApi({ name, email });
      toast.success("Đổi thông tin thành công");
    } catch (err) {
      console.log(err.message);
    } finally {
    }
  });

  formPassword?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userPw = new FormData(formPassword);

    const oldPassword = escapeHTML(
      (userPw.get("oldPassword") || "").toString().trim()
    );
    const password = escapeHTML(
      (userPw.get("newPassword") || "").toString().trim()
    );
    const confirmPassword = escapeHTML(
      (userPw.get("confirmPassword") || "").toString().trim()
    );

    if (!oldPassword || !password || !confirmPassword) return;

    try {
      await changePasswordApi({
        oldPassword,
        password,
        confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công");
    } catch (err) {
      console.log(err.message);
    } finally {
    }
  });
};
