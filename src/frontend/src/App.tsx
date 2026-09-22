import { Layout } from "@/components/Layout";
import { AdminLeadsPage } from "@/pages/AdminLeadsPage";
import { ContactPage } from "@/pages/ContactPage";
import { FlightBookingPage } from "@/pages/FlightBookingPage";
import { HomePage } from "@/pages/HomePage";
import { HowToBookFlightByPhonePage } from "@/pages/HowToBookFlightByPhonePage";
import { BookAFlightByPhonePage } from "@/pages/BookAFlightByPhonePage";
import { InternationalFlightBookingPage, LastMinuteFlightBookingPage, MultiCityFlightBookingPage, GroupFlightBookingPage } from "@/pages/BookingIntentPages";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { FlightBookingPhoneNumberPage } from "@/pages/FlightBookingPhoneNumberPage";
import { FlightBookingAssistancePage, SameDayFlightBookingPage } from "@/pages/AdditionalBookingIntentPages";
import { TravelAgentByPhonePage, FlightChangeRebookingPage, BookFlightForSomeoneElsePage } from "@/pages/HighIntentSupportPages";
import { FlightCancellationAssistancePage, MissedFlightRebookingPage } from "@/pages/DisruptionSupportPages";
import { DomesticFlightBookingPage, BusinessClassFlightBookingPage, OneWayFlightBookingPage, FamilyFlightBookingPage } from "@/pages/TravelerIntentPages";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";
import { AmericanAirlinesPage } from "@/pages/airlines/AmericanAirlinesPage";
import { SouthwestAirlinesPage, BritishAirwaysPage, LufthansaPage } from "@/pages/airlines/AdditionalAirlinesPages";
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

const flightBookingAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking-assistance",
  component: FlightBookingAssistancePage,
});

const sameDayFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/same-day-flight-booking",
  component: SameDayFlightBookingPage,
});

const travelAgentByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/travel-agent-by-phone",
  component: TravelAgentByPhonePage,
});

const flightChangeRebookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-change-rebooking",
  component: FlightChangeRebookingPage,
});

const flightCancellationAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-cancellation-assistance",
  component: FlightCancellationAssistancePage,
});

const missedFlightRebookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/missed-flight-rebooking",
  component: MissedFlightRebookingPage,
});

const bookFlightForSomeoneElseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book-flight-for-someone-else",
  component: BookFlightForSomeoneElsePage,
});

const domesticFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domestic-flight-booking",
  component: DomesticFlightBookingPage,
});

const businessClassFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-class-flight-booking",
  component: BusinessClassFlightBookingPage,
});

const oneWayFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/one-way-flight-booking",
  component: OneWayFlightBookingPage,
});

const familyFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/family-flight-booking",
  component: FamilyFlightBookingPage,
});

const flightBookingPhoneNumberRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking-phone-number",
  component: FlightBookingPhoneNumberPage,
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

const southwestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/southwest-airlines",
  component: SouthwestAirlinesPage,
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

const adminLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/leads",
  component: AdminLeadsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  flightBookingRoute,
  flightBookingPhoneNumberRoute,
  domesticFlightBookingRoute,
  businessClassFlightBookingRoute,
  oneWayFlightBookingRoute,
  familyFlightBookingRoute,
  flightBookingAssistanceRoute,
  sameDayFlightBookingRoute,
  travelAgentByPhoneRoute,
  flightChangeRebookingRoute,
  bookFlightForSomeoneElseRoute,
  flightCancellationAssistanceRoute,
  missedFlightRebookingRoute,
  internationalFlightBookingRoute,
  lastMinuteFlightBookingRoute,
  multiCityFlightBookingRoute,
  groupFlightBookingRoute,
  bookAFlightByPhoneRoute,
  howToBookFlightByPhoneRoute,
  deltaRoute,
  unitedRoute,
  americanRoute,
  southwestRoute,
  britishAirwaysRoute,
  lufthansaRoute,
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
