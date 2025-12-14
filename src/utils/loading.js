export function showLoading() {
  const el = document.getElementById("global-loading");
  if (!el) return;
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
}

export function hideLoading() {
  const el = document.getElementById("global-loading");
  if (!el) return;
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
}
