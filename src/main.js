import { router } from "./router/router";

import "./styles/style.css";
import "./styles/base.css";
import "./styles/animation.css";
import { HomePage, initHomePage } from "./pages/home";
import { AuthPage, initAuthPage } from "./pages/auth";
import { ExplorePage, initExplorePage } from "./pages/explore";
import { initLibraryPage, LibraryPage } from "./pages/library";
import { initProfilePage, ProfilePage } from "./pages/profile";
import { initUpgrade, Upgrade } from "./pages/upgrade";
const app = document.querySelector("#app");

function render(html, init) {
  app.innerHTML = html;
  if (init) init();

  router.updatePageLinks();
}

// Routers
router
  .on("/", () => {
    render(HomePage(), initHomePage);
  })
  .on("/auth", () => {
    render(AuthPage(), initAuthPage);
  })
  .on("/explore", () => {
    render(ExplorePage(), initExplorePage);
  })
  .on("/library", () => {
    render(LibraryPage(), initLibraryPage);
  })
  .on("/profile", () => {
    render(ProfilePage(), initProfilePage);
  })
  .on("/upgrade", () => {
    render(Upgrade(), initUpgrade);
  })
  .notFound(() => {
    app.innerHTML = "<h1>404</h1>";
  });

router.resolve();
