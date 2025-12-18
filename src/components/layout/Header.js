import { handleLogoutAPI } from "../../api/authApi.js";
import { getProfileApi } from "../../api/userApi.js";
import { hideLoading, showLoading } from "../../utils/loading.js";
import { generateAvatar } from "../../utils/utils.js";
import { toast } from "../common/Toast.js";
import { LoadingOverlay } from "../loading/LoadingOverlay.js";

export function Header() {
  return `
    <!-- Header (Sticky)-->
    <header class="fixed js-header top-0 left-0 right-0 z-40 flex h-16 items-center border-b border-white/10 bg-[rgba(0,0,0,0.1)] backdrop-blur-md px-4">
      <!-- Toggle sidebar -->
      <button id="headerToggle" class="p-2 mr-3 rounded-full hover:bg-white/10 flex items-center justify-center text-white" >
        <span class="material-symbols-outlined text-3xl">menu</span>
      </button>

      <!-- Logo -->
      <a href = "/" data-navigo>
        <div class="flex items-center gap-2 select-none">
          <div class="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#ff0033]" >
            <div class="flex h-4 w-4 items-center justify-center rounded-full border border-white/80" >
              <div class="ml-0.5 h-0 w-0 border-l-[7px] border-l-white border-y-4 border-y-transparent"></div>
            </div>
          </div>
          <span class="text-xl font-semibold tracking-tight">Music</span>
        </div>
      </a>

      <!-- Search Form -->
      <div class="hidden md:flex flex-1 items-center max-w-lg lg:max-w-xl mx-auto" >
        <div class="relative w-[90%] ml-5 xl:w-full js-search-wrapper">
          <!-- Search input box -->
          <div class="js-search-box flex items-center rounded-xl  focus:border-b-0 bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.15)] px-6 py-2.5 transition-all duration-150 focus-within:bg-[rgba(255,255,255,0.18)] focus-within:border-[rgba(255,255,255,0.25)]" >
            <i class="fa-solid fa-magnifying-glass text-white/70 mr-4 text-xl" ></i>

            <input type="text" autocomplete="off" name="search-input"  placeholder="Tìm kiếm bài hát, đĩa nhạc, nghệ sĩ, podcast"
              class="js-search-input flex-1 bg-transparent text-white placeholder:text-white/50 focus:placeholder:text-white/80 focus:outline-none text-[16px]" />

            <!-- Clear button -->
            <button type="button" class="js-search-clear hidden text-2xl leading-none text-white/60 hover:text-white pl-3" >
              &times;
            </button>
          </div>

          <!-- Dropdown results -->
          <div class="js-search-dropdown hidden absolute left-0 right-0 top-full border border-[rgba(255,255,255,0.15)] border-t-0 bg-[#121212] rounded-b-xl shadow-xl max-h-105 overflow-y-auto" >
            <ul class="js-search-list py-2"></ul>
          </div>
        </div>
      </div>

      <!-- Header Actions -->
      <div class="header-actions ml-auto flex items-center gap-2 xl:mr-10">
        <button class="hidden md:flex p-2 rounded-full hover:bg-white/10">
          <span class="material-symbols-outlined">cast</span>
        </button>
        <button class="hidden md:flex p-2 rounded-full hover:bg-white/10">
          <span class="material-symbols-outlined">settings</span>
        </button>

        <!-- Button Login -->
        <a href="/auth" data-navigo
          class="js-logged login-btn cursor-pointer rounded-full bg-white text-black px-4 py-1.5 text-sm font-semibold">
        Đăng nhập
        </a>

        <!-- Avatar -->
        <div id="userAvatar" class=" relative cursor-pointer select-none">
          <div id="avatarBox" class="h-7 w-7  cursor-pointer select-none rounded-full bg-gray-500 text-white hidden items-center justify-center font-semibold text-sm" >
            
          </div>

          <div id="userMenu" class="absolute right-0 mt-3 w-70 rounded-2xl bg-[#1f1f1f] text-white shadow-xl border border-white/10 hidden" >
            <!-- User Info -->
            <div class="p-4">
              <p class="cursor-default font-semibold text-lg">
                Xin chào <span id="userFullName" >User Name</span>
              </p>
              <p class="cursor-default text-sm text-gray-300" id="userEmail">
                Gmail:
              </p>

              <button class="cursor-pointer text-blue-400 text-sm mt-1 hover:underline" >
                Quản lý tài khoản của bạn
              </button>
            </div>

            <div class="border-t border-white/10"></div>

            <!-- Menu -->
            <div class="p-2 flex flex-col items-start gap-3 mb-2">
              <a href="/profile" data-navigo class="cursor-pointer text-sm flex gap-1.5 items-center menu-item" >
                <span class="material-symbols-outlined">account_circle</span>
                Hồ sơ cá nhân
              </a>

              <button class="cursor-pointer text-sm flex gap-1.5 items-center menu-item" id="logoutBtn" >
                <span class="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

      ${LoadingOverlay()}
  `;
}

export function initHeader() {
  headerBg();
  initMobileSearch();
  initSearchSuggestions();
  updateHeaderAuthUI();
  handleLogout();
}

function initMobileSearch() {
  const openSearchBtn = document.getElementById("openSearchMobile");
  const closeSearchBtn = document.getElementById("closeSearchMobile");
  const mobileSearchBar = document.getElementById("mobileSearchBar");
  const mobileSearchInput = document.getElementById("mobileSearchInput");

  openSearchBtn?.addEventListener("click", () => {
    mobileSearchBar?.classList.remove("-translate-y-full");
    mobileSearchInput?.focus();
  });

  closeSearchBtn?.addEventListener("click", () => {
    mobileSearchBar?.classList.add("-translate-y-full");
    mobileSearchInput?.blur();
  });
}

function initSearchSuggestions() {
  const wrapper = document.querySelector(".js-search-wrapper");
  if (!wrapper) return;

  const input = wrapper.querySelector(".js-search-input");
  const clearBtn = wrapper.querySelector(".js-search-clear");
  const dropdown = wrapper.querySelector(".js-search-dropdown");
  const list = wrapper.querySelector(".js-search-list");

  if (!input || !clearBtn || !dropdown || !list) return;

  const suggestions = [
    "test loa",
    "test bass",
    "test loa bass",
    "test loa treble bass hay",
    "test drive",
    "test loa sự kiện",
    "Bass Test",
    "Nhạc Test Loa Sự Kiện 1 || Bass Gọn",
  ];

  function openDropdown() {
    dropdown.classList.remove("hidden");
    const box = wrapper.querySelector(".js-search-box");
    box?.classList.replace("rounded-xl", "rounded-t-xl");
  }

  function closeDropdown() {
    dropdown.classList.add("hidden");
    const box = wrapper.querySelector(".js-search-box");
    box?.classList.replace("rounded-t-xl", "rounded-xl");
  }

  function renderSuggestions(keyword) {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      list.innerHTML = "";
      closeDropdown();
      return;
    }

    const filtered = suggestions.filter((item) =>
      item.toLowerCase().includes(q)
    );

    if (!filtered.length) {
      list.innerHTML =
        "<li class='px-4 py-2 text-sm text-white/60'>Không tìm thấy kết quả</li>";
      openDropdown();
      return;
    }

    list.innerHTML = filtered
      .map(
        (item) =>
          `<li class="px-4 py-2 text-sm hover:bg-white/10 cursor-pointer">${item}</li>`
      )
      .join("");

    openDropdown();

    list.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        input.value = li.textContent || "";
        clearBtn.classList.remove("hidden");
        closeDropdown();
      });
    });
  }

  input.addEventListener("input", () => {
    const hasValue = input.value.trim().length > 0;
    clearBtn.classList.toggle("hidden", !hasValue);
    renderSuggestions(input.value);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) renderSuggestions(input.value);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.classList.add("hidden");
    closeDropdown();
    input.focus();
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) closeDropdown();
  });
}

async function updateHeaderAuthUI() {
  const token = localStorage.getItem("access_token");

  const loginBtn = document.querySelector(".login-btn");
  const userAvatar = document.getElementById("avatarBox");
  const userMenu = document.getElementById("userMenu");
  const username = document.querySelector("#userFullName");
  const userEmail = document.querySelector("#userEmail");

  if (!loginBtn || !userAvatar || !userMenu || !username || !userEmail) return;

  if (token) {
    loginBtn.classList.add("hidden");
    userAvatar.classList.remove("hidden");
    userAvatar.classList.add("flex");
    userAvatar.textContent = userAvatar.textContent || "";
  } else {
    loginBtn.classList.remove("hidden");
    userAvatar.classList.add("hidden");
    userAvatar.classList.remove("flex");
    userMenu.classList.add("hidden");
    return;
  }

  try {
    showLoading();
    const response = await getProfileApi();
    const user = response.data;

    const avt = generateAvatar(user.name);

    username.textContent = user.name;
    userEmail.textContent = user.email;
    userAvatar.textContent = avt.char;
    userAvatar.style.color = avt.text;
    userAvatar.style.backgroundColor = avt.bg;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error.message || "Có lỗi xảy ra"
    );

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    loginBtn.classList.remove("hidden");
    userAvatar.classList.add("hidden");
    userAvatar.classList.remove("flex");
    userMenu.classList.add("hidden");
  } finally {
    setTimeout(() => {
      hideLoading();
    }, 300);
  }

  userAvatar.onclick = null;
  document.onclick = null;

  userAvatar.addEventListener("click", function handleAvatarClick(e) {
    e.stopPropagation();
    userMenu.classList.toggle("hidden");
  });

  userMenu.addEventListener("click", function handleMenuClick(e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function handleDocumentClick() {
    userMenu.classList.add("hidden");
  });
}

const handleLogout = () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.onclick = () => {
    handleLogoutAPI();
  };
};

function headerBg() {
  const header = document.querySelector(".js-header");
  if (!header) return;

  const topBg = "bg-[rgba(0,0,0,0.1)]";
  const scrollBg = "bg-black/90";

  const apply = () => {
    const scrolled = window.scrollY > 5;
    header.classList.toggle(scrollBg, scrolled);
    header.classList.toggle(topBg, !scrolled);
  };

  apply();

  window.addEventListener("scroll", () => {
    requestAnimationFrame(() => {
      apply();
    });
  });
}
