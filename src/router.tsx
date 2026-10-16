import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// After a new deploy, an open tab can hold an old entry file that points to
// route chunks which no longer exist. Reload once to pick up the fresh build.
if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", () => window.location.reload());
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
