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

import {
  CategoryPage,
  initCategoryPage,
  initCategoryContent,
} from "./pages/categories";
import {
  AlbumsDetails,
  initAlbumsDetails,
  initAlbumsContent,
} from "./pages/album-detail";
import {
  VideosDetails,
  initVideosDetails,
  initVideosContent,
} from "./pages/video-detail";

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
  .on("/categories/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(CategoryPage());
    initCategoryPage();
    initCategoryContent(slug);
  })
  .on("/albums/details/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(AlbumsDetails());
    initAlbumsDetails();
    initAlbumsContent(slug);
  })
  .on("/videos/details/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(VideosDetails());
    initVideosDetails();
    initVideosContent(slug);
  })
  .notFound(() => {
    app.innerHTML = "<h1>404</h1>";
  });

router.resolve();
