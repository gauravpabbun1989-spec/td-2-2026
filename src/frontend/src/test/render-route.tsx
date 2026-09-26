import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";

import { routeTree } from "@/App";

export type RenderRouteResult = RenderResult & {
  queryClient: QueryClient;
};

/**
 * Uses the exact production route tree from App.tsx with an in-memory history.
 * This keeps integration tests synchronized with every public route and the
 * private admin route instead of maintaining a stale second route list.
 */
export function renderRoute(initialPath: string): RenderRouteResult {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  const result = render(
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <RouterProvider router={router} />
      </InternetIdentityProvider>
    </QueryClientProvider>,
  );

  return Object.assign(result, { queryClient });
}

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
