let toastRoot = null;

function ensureToastRoot() {
  if (toastRoot) return;

  toastRoot = document.createElement("div");
  toastRoot.id = "toast-root";
  toastRoot.className = `
    fixed bottom-6 right-6 z-50
    flex flex-col gap-3
    pointer-events-none
  `;
  document.body.appendChild(toastRoot);
}

function baseToast({ message, icon, bg, border }) {
  ensureToastRoot();

  const toast = document.createElement("div");
  toast.className = `
    pointer-events-auto
    flex items-center gap-3
    min-w-[260px] max-w-[360px]
    px-4 py-3
    rounded-xl
    ${bg}
    ${border}
    border
    shadow-xl
    text-white text-sm
    animate-toast-in
  `;

  toast.innerHTML = `
    <span class="material-symbols-outlined text-xl">${icon}</span>
    <span class="flex-1 leading-snug">${message}</span>
  `;

  toastRoot.appendChild(toast);

  setTimeout(() => {
    toast.classList.replace("animate-toast-in", "animate-toast-out");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export const toast = {
  success(message) {
    baseToast({
      message,
      icon: "check_circle",
      bg: "bg-emerald-600/90",
      border: "border-emerald-400/30",
    });
  },

  error(message) {
    baseToast({
      message,
      icon: "error",
      bg: "bg-red-600/90",
      border: "border-red-400/30",
    });
  },
};
