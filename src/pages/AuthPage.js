import axiosInstance from "../utils/authorizedAxios.js";

import { router } from "../router/router.js";
import { showLoading, hideLoading } from "../utils/loading.js";
import { LoadingOverlay } from "../components/loading/LoadingOverlay.js";
import { toast } from "../components/common/Toast.js";

import { escapeHTML } from "../utils/utils.js";

const BASE_URL = import.meta.env.VITE_API_URL;

export function AuthPage() {
  return `  <div class="bg-black -ml-40  text-white font-[Inter]">
    <!-- Background gradient -->
    <div
      class="fixed inset-0 bg-linear-to-b from-[#05070b] via-black to-black"
    ></div>

    <!-- Blur circles -->
    <div class="pointer-events-none fixed inset-0">
      <div class="absolute -top-40 -left-20 h-72 w-72 rounded-full bg-[#ff0033]/20 blur-3xl"></div>
      <div class="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-[#2563eb]/20 blur-3xl"></div>
    </div>
    <!-- Main container -->
    <div class="flex flex-col">
      <!-- Auth card -->
      <main class="flex-1 flex items-center justify-center mt-3">
        <div
          class="w-full max-w-md rounded-3xl border border-white/10 bg-[#05070b]/90 shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl p-5 sm:p-6"
        >
          <!-- Title -->
          <div class="mb-5 text-center">
            <h1 id="formTitle" class="text-xl text-white sm:text-2xl font-semibold">
              Chào mừng trở lại 👋
            </h1>
            <p id="formSubtitle" class="mt-2 text-sm text-white/60 mx-6">
              Đăng nhập để tiếp tục nghe những bài hát yêu thích của bạn.
            </p>
          </div>

          <!-- Gray line  -->
          <div class="relative mb-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center"></div>
          </div>


          <!-- Sign in form -->
          <form id="signInForm" class="space-y-3">
            <div class="space-y-1">
              <label
                for="signin-email"
                class="text-xs font-medium text-white/70">
                Email
              </label>
              <div class="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#111111] px-3 py-2 focus-within:border-[#ff0033] focus-within:ring-1 focus-within:ring-[#ff0033]">
                <span
                  class="material-symbols-outlined text-[18px] text-white/50">
                  alternate_email
                </span>
                <input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full bg-transparent text-sm outline-none placeholder:text-white/35 placeholder:text-[13px] text-[16px]"
                />
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <label for="signin-password" class="font-medium text-white/70">
                  Mật khẩu
                </label>
                <button type="button" class="text-white/50 hover:text-white/80">
                  Quên mật khẩu?
                </button>
              </div>
              <div class="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#111111] px-3 py-2 focus-within:border-[#ff0033] focus-within:ring-1 focus-within:ring-[#ff0033]" >
                <span class="material-symbols-outlined text-[18px] text-white/50" >
                  lock
                </span>
                <input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  class="w-full bg-transparent text-sm outline-none placeholder:text-white/35 placeholder:text-[13px] text-[16px]"
                />
              </div>
            </div>

            <button type="submit" class="mt-2 w-full rounded-full bg-[#ff0033] py-2.5 text-sm font-semibold hover:bg-[#ff2450] transition-colors" >
              Đăng nhập
            </button>

            <p class="mt-2 text-xs text-white/50 text-center">
              Chưa có tài khoản?
              <button type="button" id="fromLoginToSignUp" class="text-[#ff7b9b] hover:text-[#ff99b5] font-medium" >
                Đăng ký ngay
              </button>
            </p>
          </form>

          <!-- Sign up form -->
          <form id="signUpForm" class="space-y-3 hidden">
            <div class="space-y-1">
              <label for="signup-name" class="text-xs font-medium text-white/70" >
                Họ và tên
              </label>
              <div class="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#111111] px-3 py-2 focus-within:border-[#ff0033] focus-within:ring-1 focus-within:ring-[#ff0033]" >
                <span class="material-symbols-outlined text-[18px] text-white/50" >
                  person
                </span>
                <input
                  id="signup-name"
                  type="text"
                  required
                  placeholder="Tên hiển thị trên YouTube Music"
                  class="w-full bg-transparent text-sm outline-none placeholder:text-white/35 placeholder:text-[13px] text-[16px]"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label for="signup-email" class="text-xs font-medium text-white/70" >
                Email
              </label>
              <div class="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#111111] px-3 py-2 focus-within:border-[#ff0033] focus-within:ring-1 focus-within:ring-[#ff0033]" >
                <span class="material-symbols-outlined text-[18px] text-white/50" >
                  alternate_email
                </span>
                <input
                  id="signup-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  class="w-full text-[16px] bg-transparent text-sm outline-none placeholder:text-white/35 placeholder:text-[13px]"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label for="signup-password" class="text-xs font-medium text-white/70" >
                Mật khẩu
              </label>
              <div class="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#111111] px-3 py-2 focus-within:border-[#ff0033] focus-within:ring-1 focus-within:ring-[#ff0033]" >
                <span class="material-symbols-outlined text-[18px] text-white/50" >
                  lock
                </span>
                <input
                  id="signup-password"
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  class="w-full text-[16px] bg-transparent text-sm outline-none placeholder:text-white/35 placeholder:text-[13px]"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label for="signup-confirm" class="text-xs font-medium text-white/70" >
                Xác nhận mật khẩu
              </label>
              <div class="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#111111] px-3 py-2 focus-within:border-[#ff0033] focus-within:ring-1 focus-within:ring-[#ff0033]" >
                <span class="material-symbols-outlined text-[18px] text-white/50" >
                  lock_reset
                </span>
                <input
                  id="signup-confirm"
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu"
                  class="w-full text-[16px] bg-transparent text-sm outline-none placeholder:text-white/35 placeholder:text-[13px]"
                />
              </div>
            </div>

            <button type="submit" class="mt-2 w-full rounded-full bg-[#ff0033] py-2.5 text-sm font-semibold hover:bg-[#ff2450] transition-colors" >
              Tạo tài khoản
            </button>

            <p class="mt-2 text-xs text-white/50 text-center">
              Đã có tài khoản?
              <button type="button" id="fromSignUpToLogin" class="text-[#ff7b9b] hover:text-[#ff99b5] font-medium" >
                Đăng nhập
              </button>
            </p>
          </form>
        </div>

        ${LoadingOverlay()}
  </div>
</div>

      </main>
    </div>
  </div>`;
}

export function initAuthPage() {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  const toSignUpBtn = document.getElementById("fromLoginToSignUp");
  const toSignInBtn = document.getElementById("fromSignUpToLogin");

  const title = document.getElementById("formTitle");
  const subtitle = document.getElementById("formSubtitle");

  //  Login → Register
  toSignUpBtn.addEventListener("click", () => {
    signInForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");

    title.textContent = "Tạo tài khoản mới ✨";
    subtitle.textContent =
      "Đăng ký để bắt đầu xây dựng danh sách nhạc của bạn.";
  });

  //  Register → Login
  toSignInBtn.addEventListener("click", () => {
    signUpForm.classList.add("hidden");
    signInForm.classList.remove("hidden");

    title.textContent = "Chào mừng trở lại 👋";
    subtitle.textContent =
      "Đăng nhập để tiếp tục nghe những bài hát yêu thích của bạn.";
  });

  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = escapeHTML(
      document.getElementById("signup-name").value.trim()
    );
    const email = escapeHTML(
      document.getElementById("signup-email").value.trim()
    );
    const password = escapeHTML(
      document.getElementById("signup-password").value.trim()
    );
    const confirmPassword = escapeHTML(
      document.getElementById("signup-confirm").value.trim()
    );

    try {
      showLoading();
      const response = await axiosInstance.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      const token = response.data;

      localStorage.setItem("access_token", token.access_token);
      localStorage.setItem("refresh_token", token.refresh_token);

      toast.success("Đăng ký thành công!");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log(error);
    } finally {
      hideLoading();
    }
  });

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = escapeHTML(
      document.getElementById("signin-email").value.trim()
    );
    const password = escapeHTML(
      document.getElementById("signin-password").value.trim()
    );

    try {
      showLoading();
      const response = await axiosInstance.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data;
      localStorage.setItem("access_token", token.access_token);
      localStorage.setItem("refresh_token", token.refresh_token);
      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        router.navigate("/");
      }, 1500);
    } catch (error) {
      console.error(error);
      router.navigate("/auth");
    } finally {
      hideLoading();
    }
  });
}
