import { Layout } from "@/components/Layout";
import { AdminLeadsPage } from "@/pages/AdminLeadsPage";
import { BookAFlightByPhonePage } from "@/pages/BookAFlightByPhonePage";
import { ContactPage } from "@/pages/ContactPage";
import { FlightBookingPage } from "@/pages/FlightBookingPage";
import { HomePage } from "@/pages/HomePage";
import { HowToBookFlightByPhonePage } from "@/pages/HowToBookFlightByPhonePage";
import {
  BusinessClassFlightBookingPage,
  CheapFlightBookingByPhonePage,
  FamilyFlightBookingPage,
  FlightCancellationAssistancePage,
  FlightChangeAssistancePage,
  SameDayFlightBookingPage,
} from "@/pages/AdditionalBookingPages";
import {
  GroupFlightBookingPage,
  InternationalFlightBookingPage,
  LastMinuteFlightBookingPage,
  MultiCityFlightBookingPage,
} from "@/pages/BookingIntentPages";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { AmericanAirlinesPage } from "@/pages/airlines/AmericanAirlinesPage";
import {
  AirCanadaPage,
  AlaskaAirlinesPage,
  BritishAirwaysPage,
  JetBlueAirwaysPage,
  LufthansaPage,
  SouthwestAirlinesPage,
  SwissAirPage,
  QatarAirwaysPage,
  EmiratesPage,
  LotPolishAirlinesPage,
  NorseAtlanticAirwaysPage,
} from "@/pages/airlines/AdditionalAirlinePages";
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

const howToBookFlightByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/how-to-book-a-flight-by-phone",
  component: HowToBookFlightByPhonePage,
});

const bookAFlightByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book-a-flight-by-phone",
  component: BookAFlightByPhonePage,
});

const internationalFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/international-flight-booking",
  component: InternationalFlightBookingPage,
});

const lastMinuteFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/last-minute-flight-booking",
  component: LastMinuteFlightBookingPage,
});

const multiCityFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/multi-city-flight-booking",
  component: MultiCityFlightBookingPage,
});

const groupFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group-flight-booking",
  component: GroupFlightBookingPage,
});

const cheapFlightBookingByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cheap-flight-booking-by-phone",
  component: CheapFlightBookingByPhonePage,
});

const businessClassFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-class-flight-booking",
  component: BusinessClassFlightBookingPage,
});

const sameDayFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/same-day-flight-booking",
  component: SameDayFlightBookingPage,
});

const familyFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/family-flight-booking",
  component: FamilyFlightBookingPage,
});

const flightChangeAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-change-assistance",
  component: FlightChangeAssistancePage,
});

const flightCancellationAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-cancellation-assistance",
  component: FlightCancellationAssistancePage,
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

const southwestAirlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/southwest-airlines",
  component: SouthwestAirlinesPage,
});

const jetBlueAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jetblue-airways",
  component: JetBlueAirwaysPage,
});

const alaskaAirlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alaska-airlines",
  component: AlaskaAirlinesPage,
});

const britishAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/british-airways",
  component: BritishAirwaysPage,
});

const lufthansaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lufthansa",
  component: LufthansaPage,
});

const airCanadaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/air-canada",
  component: AirCanadaPage,
});

const swissAirRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/swiss-air",
  component: SwissAirPage,
});

const qatarAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/qatar-airways",
  component: QatarAirwaysPage,
});

const emiratesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emirates",
  component: EmiratesPage,
});

const lotPolishAirlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lot-polish-airlines",
  component: LotPolishAirlinesPage,
});

const norseAtlanticAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/norse-atlantic-airways",
  component: NorseAtlanticAirwaysPage,
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

const adminLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/leads",
  component: AdminLeadsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  flightBookingRoute,
  internationalFlightBookingRoute,
  lastMinuteFlightBookingRoute,
  multiCityFlightBookingRoute,
  groupFlightBookingRoute,
  cheapFlightBookingByPhoneRoute,
  businessClassFlightBookingRoute,
  sameDayFlightBookingRoute,
  familyFlightBookingRoute,
  flightChangeAssistanceRoute,
  flightCancellationAssistanceRoute,
  bookAFlightByPhoneRoute,
  howToBookFlightByPhoneRoute,
  deltaRoute,
  unitedRoute,
  americanRoute,
  southwestAirlinesRoute,
  jetBlueAirwaysRoute,
  alaskaAirlinesRoute,
  britishAirwaysRoute,
  lufthansaRoute,
  airCanadaRoute,
  swissAirRoute,
  qatarAirwaysRoute,
  emiratesRoute,
  lotPolishAirlinesRoute,
  norseAtlanticAirwaysRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  adminLeadsRoute,
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
