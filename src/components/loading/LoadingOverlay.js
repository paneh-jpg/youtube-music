export function LoadingOverlay() {
  return `
    <div id="global-loading" class="fixed inset-0 z-[9999] hidden" aria-hidden="true">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-10 h-10 rounded-full border-4 border-white/20 border-t-[#ff0033] animate-spin"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    </div>
  `;
}
