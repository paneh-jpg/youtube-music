import { router } from "./router/router";

import "./styles/style.css";
import { HomePage } from "./pages/home";
import { AuthPage, initAuthPage } from "./pages/auth";
const app = document.querySelector("#app");

function render(html, init) {
  app.innerHTML = html;
  if (init) init();

  router.updatePageLinks();
}

// Routers
router
  .on("/", () => {
    render(HomePage(), 0);
  })
  .on("/auth", () => {
    render(AuthPage(), initAuthPage);
  })
  .notFound(() => {
    app.innerHTML = "<h1>404</h1>";
  });

router.resolve();
