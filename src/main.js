import { router } from "./router/router.js";

import "./styles/style.css";
import "./styles/base.css";
import "./styles/animation.css";
import { HomePage, initHomePage } from "./pages/Home.js";
import { AuthPage, initAuthPage } from "./pages/Auth.js";
import { ExplorePage, initExplorePage } from "./pages/explore.js";
import { initLibraryPage, LibraryPage } from "./pages/library.js";
import { initProfilePage, ProfilePage } from "./pages/profile.js";
import { initUpgrade, Upgrade } from "./pages/upgrade.js";
import { ChartsPage, initChartsPage } from "./pages/charts.js";
import { MoodsPage, initMoodsPage } from "./pages/moods.js";
import { NewsReleasePage, initNewsReleasePage } from "./pages/news-release.js";

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
import {
  SongDetailPage,
  initSongDetailPage,
  initSongDetailContent,
} from "./pages/song-detail";

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
    initProfilePage;
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
  .on("/songs/details/:id", (match) => {
    const songId = decodeURIComponent(match?.data?.id || "");

    //  lấy album slug từ query
    const queryRaw = match?.queryString || "";
    const query = queryRaw.startsWith("?") ? queryRaw.slice(1) : queryRaw;
    const params = new URLSearchParams(query);
    const albumSlug = params.get("album");

    render(SongDetailPage());
    initSongDetailPage({ songId, albumSlug });

    initSongDetailContent({ songId, albumSlug });
  })
  .on("/charts", () => {
    render(ChartsPage(), initChartsPage);
  })
  .on("/news-release", () => {
    render(NewsReleasePage(), initNewsReleasePage);
  })
  .on("/moods", () => {
    render(MoodsPage(), initMoodsPage);
  })
  .notFound(() => {
    app.innerHTML = "<h1>404</h1>";
  });

router.resolve();
