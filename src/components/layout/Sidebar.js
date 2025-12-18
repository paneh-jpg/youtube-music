export function Sidebar() {
  return `
   <!--  Sidebar (Left, Under header)  -->
    <aside id="sidebar" class="fixed top-16 bottom-0 left-0 bg-[#0f0f0f] border-r border-white/10 z-100 w-64 md:w-64 md:translate-x-0 -translate-x-full transform " >
      <div class="overflow-y-auto h-full no-scrollbar px-2 py-4">
        <nav class="flex flex-col mt-2">
          <!-- Trang chủ -->
          <a href="/" data-navigo class=" flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10" >
            <span class="material-symbols-outlined text-[24px]">home</span>
            <span class="text-[16px] font-semibold">Trang chủ</span>
          </a>

          <!-- Khám phá -->
          <a href="/explore" data-navigo class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10" >
            <span class="material-symbols-outlined text-[24px]">travel_explore</span>
            <span class="text-[16px] font-semibold">Khám phá</span>
          </a>

          <!-- Thư viện -->
          <a href="/library" data-navigo class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10">
            <span class="material-symbols-outlined text-[24px]">bookmark</span>
            <span class="text-[16px] font-semibold">Thư viện</span>
          </a>

          <!-- Nâng cấp ứng dụng -->
          <a href="/upgrade" data-navigo class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10">
            <span class="material-symbols-outlined text-[24px]">open_in_new</span>
            <span class="text-[16px] font-semibold">Nâng cấp</span>
          </a>
        </nav>

        <!-- Login section -->
        <div class="login-section mt-5 border-t border-white/10 pt-5 px-3">
          <!-- Nút full dùng khi sidebar mở -->
          <button data-navigo href="/auth" id="loginFull"
            class=" login-btn w-full  cursor-pointer bg-[#484848] text-white py-2 rounded-full font-medium">
            Đăng nhập
          </button>

          <!-- Nút compact dùng khi sidebar thu gọn -->
          <a data-navigo href="/auth" id="loginCompact"
            class="flex flex-col justify-center items-center cursor-pointer gap-2 text-white py-2 px-2 rounded-lg hover:bg-white/10">
            <span class="material-symbols-outlined text-[20px]">account_circle</span>
            <span class="login-btn text-[13px] text-center">Đăng nhập</span>
          </a>

          <p id="loginDesc" class="text-[13px] text-white/70 mt-3 leading-relaxed">
            Đăng nhập để tạo và chia sẻ danh sách phát, nhận nội dung đề xuất
            dành riêng cho bạn và hơn thế nữa.
          </p>
        </div>
      </div>
    </aside>
  `;
}

const MD_BREAKPOINT = 768;
const SIDEBAR_STATE_KEY = "sidebar_state";

function updateSidebarAuthUI() {
  const token = localStorage.getItem("access_token");
  const loginBtn = document.querySelector(".login-section ");

  if (token) {
    loginBtn.classList.add("hidden");
  } else {
    loginBtn.classList.remove("hidden");

    return;
  }
}

export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const mainContentWrapper = document.getElementById("mainContentWrapper");

  const headerToggleBtn = document.getElementById("headerToggle");
  const sidebarToggleBtn = document.getElementById("sidebarToggle");

  // Login section trong sidebar
  const loginFull = document.getElementById("loginFull");
  const loginCompact = document.getElementById("loginCompact");
  const loginDesc = document.getElementById("loginDesc");

  function updateLoginButtonUI() {
    if (!loginFull || !loginCompact || !loginDesc) return;

    const isSidebarCollapsed = sidebar.classList.contains("sidebar-collapsed");

    if (window.innerWidth >= MD_BREAKPOINT) {
      // DESKTOP MODE
      if (isSidebarCollapsed) {
        // Sidebar thu gọn -> nút compact
        loginFull.classList.add("hidden");
        loginDesc.classList.add("hidden");
        loginCompact.classList.remove("hidden");
      } else {
        // Sidebar mở -> nút full
        loginFull.classList.remove("hidden");
        loginDesc.classList.remove("hidden");
        loginCompact.classList.add("hidden");
      }
    } else {
      // MOBILE – luôn dùng nút full
      loginFull.classList.remove("hidden");
      loginDesc.classList.remove("hidden");
      loginCompact.classList.add("hidden");
    }
  }

  function toggleSidebar() {
    const isDesktop = window.innerWidth >= MD_BREAKPOINT;

    if (isDesktop) {
      sidebar.classList.toggle("md:w-64");
      sidebar.classList.toggle("md:w-24");

      mainContentWrapper.classList.toggle("md:ml-64");
      mainContentWrapper.classList.toggle("md:ml-24");

      sidebar.classList.toggle("sidebar-collapsed");

      const isCollapsed = sidebar.classList.contains("sidebar-collapsed");

      localStorage.setItem(
        SIDEBAR_STATE_KEY,
        JSON.stringify({ desktop: isCollapsed ? "collapsed" : "expanded" })
      );

      updateLoginButtonUI();
    } else {
      sidebar.classList.toggle("-translate-x-full");
      sidebar.classList.toggle("translate-x-0");

      const isClosed = sidebar.classList.contains("-translate-x-full");

      localStorage.setItem(
        SIDEBAR_STATE_KEY,
        JSON.stringify({ mobile: isClosed ? "closed" : "open" })
      );

      if (isClosed) {
        overlay.classList.add("opacity-0", "invisible");
        overlay.classList.remove("opacity-100", "visible");
        document.body.classList.remove("overflow-hidden");
      } else {
        overlay.classList.remove("opacity-0", "invisible");
        overlay.classList.add("opacity-100", "visible");
        document.body.classList.add("overflow-hidden");
      }
    }
  }

  headerToggleBtn?.addEventListener("click", toggleSidebar);
  sidebarToggleBtn?.addEventListener("click", toggleSidebar);

  overlay?.addEventListener("click", () => {
    if (window.innerWidth < MD_BREAKPOINT) {
      toggleSidebar();
    }
  });

  window.addEventListener("resize", () => {
    // Khi resize giữa mobile/desktop, đảm bảo UI nút login đúng trạng thái
    updateLoginButtonUI();
  });

  function restoreSidebarState() {
    const saved = JSON.parse(localStorage.getItem(SIDEBAR_STATE_KEY) || "{}");

    if (window.innerWidth >= MD_BREAKPOINT) {
      if (saved.desktop === "collapsed") {
        sidebar.classList.remove("md:w-64");
        sidebar.classList.add("md:w-24");
        sidebar.classList.add("sidebar-collapsed");

        mainContentWrapper.classList.remove("md:ml-64");
        mainContentWrapper.classList.add("md:ml-24");
      }
    } else {
      if (saved.mobile === "open") {
        sidebar.classList.remove("-translate-x-full");
        sidebar.classList.add("translate-x-0");

        overlay.classList.remove("opacity-0", "invisible");
        overlay.classList.add("opacity-100", "visible");
        document.body.classList.add("overflow-hidden");
      }
    }
  }

  restoreSidebarState();
  // Khởi tạo trạng thái đúng ngay từ đầu
  updateLoginButtonUI();
  updateSidebarAuthUI();
}
