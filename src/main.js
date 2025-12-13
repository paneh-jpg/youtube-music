import { router } from "./router/router";

import "./styles/style.css";
import "./styles/base.css";
import { HomePage, initHomePage } from "./pages/home";
import { AuthPage, initAuthPage } from "./pages/auth";
import { ExplorePage, initExplorePage } from "./pages/explore";
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
  .notFound(() => {
    app.innerHTML = "<h1>404</h1>";
  });

router.resolve();
