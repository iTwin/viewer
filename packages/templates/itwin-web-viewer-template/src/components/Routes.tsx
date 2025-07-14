import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { SignInRedirect } from "../Authorization";
import { App } from "./App";
import { RootLayout } from "./RootLayout";

const rootRoute = createRootRoute({
  component: RootLayout,
});

interface IndexSearchParams {
  iTwinId: string;
  iModelId: string;
  changesetId?: string;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  validateSearch: (search: Record<string, unknown>): IndexSearchParams => {
    const iTwinId =
      (search.iTwinId as string | undefined) ?? import.meta.env.IMJS_ITWIN_ID;
    const iModelId =
      (search.iModelId as string | undefined) ?? import.meta.env.IMJS_IMODEL_ID;
    const changesetId = search.changesetId as string | undefined;
    if (!iTwinId || !iModelId) {
      throw new Error(
        "Please add a valid iTwin ID and iModel ID in the .env file and restart the application or add it to the `iTwinId`/`iModelId` query parameter in the url and refresh the page. See the README for more information."
      );
    }
    return {
      iTwinId,
      iModelId,
      changesetId,
    };
  },
  path: "/",
  component: function Index() {
    const { iTwinId, iModelId } = indexRoute.useSearch();
    return <App iTwinId={iTwinId} iModelId={iModelId} />;
  },
});

const signinRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signin-callback",
  component: SignInRedirect,
});

const routeTree = rootRoute.addChildren([indexRoute, signinRedirectRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});