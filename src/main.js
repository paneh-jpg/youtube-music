import { router } from "./router/router.js";

import "./styles/style.css";
import "./styles/base.css";
import "./styles/animation.css";
import { PlayerControl } from "./components/layout/PlayerControl.js";
import { HomePage, initHomePage } from "./pages/Home.js";
import { AuthPage, initAuthPage } from "./pages/Auth.js";
import { ExplorePage, initExplorePage } from "./pages/explore.js";
import { initLibraryPage, LibraryPage } from "./pages/library.js";
import { initProfilePage, ProfilePage } from "./pages/profile.js";
import { initUpgrade, Upgrade } from "./pages/upgrade.js";
import { ChartsPage, initChartsPage } from "./pages/charts.js";
import {
  MoodsAndGenresPage,
  initMoodsAndGenresPage,
} from "./pages/moods-and-genres.js";
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
import {
  PlaylistDetails,
  initPlaylistDetails,
  initPlaylistsContent,
} from "./pages/playlist-detail.js";
import { initLineContent, initLinePage, LinePage } from "./pages/lines.js";
import { initMoodContent, initMoodsPage, MoodsPage } from "./pages/moods.js";
const app = document.querySelector("#app");
app.classList.add("bg-black");

// Player control
const playerRoot = document.querySelector("#player-root");
if (playerRoot) playerRoot.innerHTML = PlayerControl();

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
  .on("/lines/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(LinePage());
    initLinePage();
    initLineContent(slug);
    window.scrollTo({ top: 0, behavior: "instant" });
  })
  .on("/albums/details/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(AlbumsDetails());
    initAlbumsDetails();
    initAlbumsContent(slug);
  })
  .on("/playlists/details/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(PlaylistDetails());
    initPlaylistDetails();
    initPlaylistsContent(slug);
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
    const contextSlug = params.get("album");
    const type = params.get("type");
    render(SongDetailPage());
    initSongDetailPage({ songId, contextSlug, type });

    initSongDetailContent({ songId, contextSlug, type });
  })
  .on("/charts", () => {
    render(ChartsPage(), initChartsPage);
  })
  .on("/news-release", () => {
    render(NewsReleasePage(), initNewsReleasePage);
  })
  .on("/moods", () => {
    render(MoodsAndGenresPage(), initMoodsAndGenresPage);
  })
  .on("/moods/:slug", (match) => {
    const slug = decodeURIComponent(match?.data?.slug || "");
    render(MoodsPage()), initMoodsPage(), initMoodContent(slug);
  })
  .notFound(() => {
    app.innerHTML = "<h1>404</h1>";
  });

router.resolve();
