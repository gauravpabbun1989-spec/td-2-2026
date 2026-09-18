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
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: NotFoundPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const flightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking",
  component: FlightBookingPage,
});

const deltaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/delta-airlines",
  component: DeltaPage,
});

const unitedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/united-airlines",
  component: UnitedPage,
});

const americanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/american-airlines",
  component: AmericanAirlinesPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  flightBookingRoute,
  deltaRoute,
  unitedRoute,
  americanRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
