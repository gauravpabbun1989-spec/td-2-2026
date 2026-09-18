import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";

import { Layout } from "@/components/Layout";
import { ContactPage } from "@/pages/ContactPage";
import { FlightBookingPage } from "@/pages/FlightBookingPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { AmericanAirlinesPage } from "@/pages/airlines/AmericanAirlinesPage";
import { DeltaPage } from "@/pages/airlines/DeltaPage";
import { UnitedPage } from "@/pages/airlines/UnitedPage";

/**
 * A test-only router mirroring the production route tree in `App.tsx`. The
 * production router is created at module scope with a browser history, so it
 * cannot be driven from a test; this rebuilds the same routes over an in-memory
 * history. Route paths and components are the real ones.
 */
function buildTestRouter(initialPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <Layout>
        <TestOutlet />
      </Layout>
    ),
    notFoundComponent: NotFoundPage,
  });

  const routes = [
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: HomePage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/flight-booking",
      component: FlightBookingPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/delta-airlines",
      component: DeltaPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/united-airlines",
      component: UnitedPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/american-airlines",
      component: AmericanAirlinesPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/contact",
      component: ContactPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/privacy",
      component: PrivacyPage,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/terms",
      component: TermsPage,
    }),
  ];

  const routeTree = rootRoute.addChildren(routes);
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

function TestOutlet() {
  return <Outlet />;
}

export type RenderRouteResult = RenderResult & {
  queryClient: QueryClient;
};

/**
 * Renders one route inside the real Layout, a fresh QueryClient, the
 * InternetIdentityProvider the app mounts in `main.tsx`, and an in-memory
 * router. The provider is required because the contact form's `useActor` reads
 * its context; tests that assert submission behavior mock `useActor` at the
 * module boundary instead.
 */
export function renderRoute(initialPath: string): RenderRouteResult {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const router = buildTestRouter(initialPath);

  const result = render(
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <RouterProvider router={router} />
      </InternetIdentityProvider>
    </QueryClientProvider>,
  );

  return Object.assign(result, { queryClient });
}

/** Wraps arbitrary children in the providers the app expects. */
export function renderWithProviders(children: ReactNode): RenderRouteResult {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>{children}</InternetIdentityProvider>
    </QueryClientProvider>,
  );
  return Object.assign(result, { queryClient });
}
