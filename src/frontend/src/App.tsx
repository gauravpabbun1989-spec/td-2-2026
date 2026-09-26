import { Layout } from "@/components/Layout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const lazyPage = (loader: () => Promise<{ default: React.ComponentType }>) => lazy(loader);

const AdminLeadsPage = lazyPage(() => import("@/pages/AdminLeadsPage").then(({ AdminLeadsPage }) => ({ default: AdminLeadsPage })));
const BookAFlightByPhonePage = lazyPage(() => import("@/pages/BookAFlightByPhonePage").then(({ BookAFlightByPhonePage }) => ({ default: BookAFlightByPhonePage })));
const ContactPage = lazyPage(() => import("@/pages/ContactPage").then(({ ContactPage }) => ({ default: ContactPage })));
const FlightBookingPage = lazyPage(() => import("@/pages/FlightBookingPage").then(({ FlightBookingPage }) => ({ default: FlightBookingPage })));
const FlightSearchPage = lazyPage(() => import("@/pages/FlightSearchPage").then(({ FlightSearchPage }) => ({ default: FlightSearchPage })));
const FlightSearchResultsPage = lazyPage(() => import("@/pages/FlightSearchResultsPage").then(({ FlightSearchResultsPage }) => ({ default: FlightSearchResultsPage })));
const HomePage = lazyPage(() => import("@/pages/HomePage").then(({ HomePage }) => ({ default: HomePage })));
const HowToBookFlightByPhonePage = lazyPage(() => import("@/pages/HowToBookFlightByPhonePage").then(({ HowToBookFlightByPhonePage }) => ({ default: HowToBookFlightByPhonePage })));

const AdditionalBookingPages = import("@/pages/AdditionalBookingPages");
const CheapFlightBookingByPhonePage = lazyPage(() => AdditionalBookingPages.then(({ CheapFlightBookingByPhonePage }) => ({ default: CheapFlightBookingByPhonePage })));
const BusinessClassFlightBookingPage = lazyPage(() => AdditionalBookingPages.then(({ BusinessClassFlightBookingPage }) => ({ default: BusinessClassFlightBookingPage })));
const FamilyFlightBookingPage = lazyPage(() => AdditionalBookingPages.then(({ FamilyFlightBookingPage }) => ({ default: FamilyFlightBookingPage })));
const FlightBookingAssistancePage = lazyPage(() => AdditionalBookingPages.then(({ FlightBookingAssistancePage }) => ({ default: FlightBookingAssistancePage })));
const FlightCancellationAssistancePage = lazyPage(() => AdditionalBookingPages.then(({ FlightCancellationAssistancePage }) => ({ default: FlightCancellationAssistancePage })));
const UsaToCanadaFlightsPage = lazyPage(() => AdditionalBookingPages.then(({ UsaToCanadaFlightsPage }) => ({ default: UsaToCanadaFlightsPage })));
const UsaToUkFlightsPage = lazyPage(() => AdditionalBookingPages.then(({ UsaToUkFlightsPage }) => ({ default: UsaToUkFlightsPage })));
const UsaToEuropeFlightsPage = lazyPage(() => AdditionalBookingPages.then(({ UsaToEuropeFlightsPage }) => ({ default: UsaToEuropeFlightsPage })));
const UsaToMexicoFlightsPage = lazyPage(() => AdditionalBookingPages.then(({ UsaToMexicoFlightsPage }) => ({ default: UsaToMexicoFlightsPage })));
const FlightChangeAssistancePage = lazyPage(() => AdditionalBookingPages.then(({ FlightChangeAssistancePage }) => ({ default: FlightChangeAssistancePage })));
const SameDayFlightBookingPage = lazyPage(() => AdditionalBookingPages.then(({ SameDayFlightBookingPage }) => ({ default: SameDayFlightBookingPage })));
const AirlineReservationAssistancePage = lazyPage(() => AdditionalBookingPages.then(({ AirlineReservationAssistancePage }) => ({ default: AirlineReservationAssistancePage })));

const BookingIntentPages = import("@/pages/BookingIntentPages");
const GroupFlightBookingPage = lazyPage(() => BookingIntentPages.then(({ GroupFlightBookingPage }) => ({ default: GroupFlightBookingPage })));
const InternationalFlightBookingPage = lazyPage(() => BookingIntentPages.then(({ InternationalFlightBookingPage }) => ({ default: InternationalFlightBookingPage })));
const LastMinuteFlightBookingPage = lazyPage(() => BookingIntentPages.then(({ LastMinuteFlightBookingPage }) => ({ default: LastMinuteFlightBookingPage })));
const MultiCityFlightBookingPage = lazyPage(() => BookingIntentPages.then(({ MultiCityFlightBookingPage }) => ({ default: MultiCityFlightBookingPage })));

const UsGatewayFlightPages = import("@/pages/UsGatewayFlightPages");
const FlightsFromNewYorkPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromNewYorkPage }) => ({ default: FlightsFromNewYorkPage })));
const FlightsFromLosAngelesPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromLosAngelesPage }) => ({ default: FlightsFromLosAngelesPage })));
const FlightsFromChicagoPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromChicagoPage }) => ({ default: FlightsFromChicagoPage })));
const FlightsFromMiamiPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromMiamiPage }) => ({ default: FlightsFromMiamiPage })));
const FlightsFromAtlantaPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromAtlantaPage }) => ({ default: FlightsFromAtlantaPage })));
const FlightsFromDallasPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromDallasPage }) => ({ default: FlightsFromDallasPage })));
const FlightsFromOrlandoPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromOrlandoPage }) => ({ default: FlightsFromOrlandoPage })));
const FlightsFromSanFranciscoPage = lazyPage(() => UsGatewayFlightPages.then(({ FlightsFromSanFranciscoPage }) => ({ default: FlightsFromSanFranciscoPage })));

const RouteFlightPages = import("@/pages/RouteFlightPages");
const FlightsNewYorkToLondonPage = lazyPage(() => RouteFlightPages.then(({ FlightsNewYorkToLondonPage }) => ({ default: FlightsNewYorkToLondonPage })));
const FlightsNewYorkToParisPage = lazyPage(() => RouteFlightPages.then(({ FlightsNewYorkToParisPage }) => ({ default: FlightsNewYorkToParisPage })));
const FlightsNewYorkToDubaiPage = lazyPage(() => RouteFlightPages.then(({ FlightsNewYorkToDubaiPage }) => ({ default: FlightsNewYorkToDubaiPage })));
const FlightsLosAngelesToTokyoPage = lazyPage(() => RouteFlightPages.then(({ FlightsLosAngelesToTokyoPage }) => ({ default: FlightsLosAngelesToTokyoPage })));
const FlightsLosAngelesToLondonPage = lazyPage(() => RouteFlightPages.then(({ FlightsLosAngelesToLondonPage }) => ({ default: FlightsLosAngelesToLondonPage })));
const FlightsMiamiToCancunPage = lazyPage(() => RouteFlightPages.then(({ FlightsMiamiToCancunPage }) => ({ default: FlightsMiamiToCancunPage })));
const FlightsChicagoToLondonPage = lazyPage(() => RouteFlightPages.then(({ FlightsChicagoToLondonPage }) => ({ default: FlightsChicagoToLondonPage })));
const FlightsSanFranciscoToTokyoPage = lazyPage(() => RouteFlightPages.then(({ FlightsSanFranciscoToTokyoPage }) => ({ default: FlightsSanFranciscoToTokyoPage })));

const AmericanAirlinesPage = lazyPage(() => import("@/pages/airlines/AmericanAirlinesPage").then(({ AmericanAirlinesPage }) => ({ default: AmericanAirlinesPage })));
const AdditionalAirlinePages = import("@/pages/airlines/AdditionalAirlinePages");
const AirCanadaPage = lazyPage(() => AdditionalAirlinePages.then(({ AirCanadaPage }) => ({ default: AirCanadaPage })));
const AlaskaAirlinesPage = lazyPage(() => AdditionalAirlinePages.then(({ AlaskaAirlinesPage }) => ({ default: AlaskaAirlinesPage })));
const BritishAirwaysPage = lazyPage(() => AdditionalAirlinePages.then(({ BritishAirwaysPage }) => ({ default: BritishAirwaysPage })));
const JetBlueAirwaysPage = lazyPage(() => AdditionalAirlinePages.then(({ JetBlueAirwaysPage }) => ({ default: JetBlueAirwaysPage })));
const LufthansaPage = lazyPage(() => AdditionalAirlinePages.then(({ LufthansaPage }) => ({ default: LufthansaPage })));
const SouthwestAirlinesPage = lazyPage(() => AdditionalAirlinePages.then(({ SouthwestAirlinesPage }) => ({ default: SouthwestAirlinesPage })));
const SwissAirPage = lazyPage(() => AdditionalAirlinePages.then(({ SwissAirPage }) => ({ default: SwissAirPage })));
const QatarAirwaysPage = lazyPage(() => AdditionalAirlinePages.then(({ QatarAirwaysPage }) => ({ default: QatarAirwaysPage })));
const EmiratesPage = lazyPage(() => AdditionalAirlinePages.then(({ EmiratesPage }) => ({ default: EmiratesPage })));
const LotPolishAirlinesPage = lazyPage(() => AdditionalAirlinePages.then(({ LotPolishAirlinesPage }) => ({ default: LotPolishAirlinesPage })));
const NorseAtlanticAirwaysPage = lazyPage(() => AdditionalAirlinePages.then(({ NorseAtlanticAirwaysPage }) => ({ default: NorseAtlanticAirwaysPage })));

const DeltaPage = lazyPage(() => import("@/pages/airlines/DeltaPage").then(({ DeltaPage }) => ({ default: DeltaPage })));
const UnitedPage = lazyPage(() => import("@/pages/airlines/UnitedPage").then(({ UnitedPage }) => ({ default: UnitedPage })));
const PrivacyPage = lazyPage(() => import("@/pages/PrivacyPage").then(({ PrivacyPage }) => ({ default: PrivacyPage })));
const TermsPage = lazyPage(() => import("@/pages/TermsPage").then(({ TermsPage }) => ({ default: TermsPage })));


const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<div className="min-h-[60vh] grid place-items-center text-sm text-muted-foreground">Loading…</div>}>
        <Outlet />
      </Suspense>
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

const airlineReservationAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/airline-reservation-assistance",
  component: AirlineReservationAssistancePage,
});

const flightBookingAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking-assistance",
  component: FlightBookingAssistancePage,
});


const usaToCanadaFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-canada",
  component: UsaToCanadaFlightsPage,
});

const usaToUkFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-uk",
  component: UsaToUkFlightsPage,
});

const usaToEuropeFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-europe",
  component: UsaToEuropeFlightsPage,
});

const usaToMexicoFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-mexico",
  component: UsaToMexicoFlightsPage,
});

const flightsFromNewYorkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-new-york",
  component: FlightsFromNewYorkPage,
});

const flightsFromLosAngelesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-los-angeles",
  component: FlightsFromLosAngelesPage,
});

const flightsFromChicagoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-chicago",
  component: FlightsFromChicagoPage,
});

const flightsFromMiamiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-miami",
  component: FlightsFromMiamiPage,
});

const flightsFromAtlantaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-atlanta",
  component: FlightsFromAtlantaPage,
});

const flightsFromDallasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-dallas",
  component: FlightsFromDallasPage,
});

const flightsFromOrlandoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-orlando",
  component: FlightsFromOrlandoPage,
});

const flightsFromSanFranciscoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-san-francisco",
  component: FlightsFromSanFranciscoPage,
});

const flightsNewYorkToLondonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-new-york-to-london",
  component: FlightsNewYorkToLondonPage,
});

const flightsNewYorkToParisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-new-york-to-paris",
  component: FlightsNewYorkToParisPage,
});

const flightsNewYorkToDubaiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-new-york-to-dubai",
  component: FlightsNewYorkToDubaiPage,
});

const flightsLosAngelesToTokyoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-los-angeles-to-tokyo",
  component: FlightsLosAngelesToTokyoPage,
});

const flightsLosAngelesToLondonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-los-angeles-to-london",
  component: FlightsLosAngelesToLondonPage,
});

const flightsMiamiToCancunRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-miami-to-cancun",
  component: FlightsMiamiToCancunPage,
});

const flightsChicagoToLondonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-chicago-to-london",
  component: FlightsChicagoToLondonPage,
});

const flightsSanFranciscoToTokyoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-san-francisco-to-tokyo",
  component: FlightsSanFranciscoToTokyoPage,
});

const flightSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-search",
  component: FlightSearchPage,
});

const flightSearchResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-search-results",
  component: FlightSearchResultsPage,
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

export const routeTree = rootRoute.addChildren([
  indexRoute,
  flightsFromNewYorkRoute,
  flightsFromLosAngelesRoute,
  flightsFromChicagoRoute,
  flightsFromMiamiRoute,
  flightsFromAtlantaRoute,
  flightsFromDallasRoute,
  flightsFromOrlandoRoute,
  flightsFromSanFranciscoRoute,
  flightsNewYorkToLondonRoute,
  flightsNewYorkToParisRoute,
  flightsNewYorkToDubaiRoute,
  flightsLosAngelesToTokyoRoute,
  flightsLosAngelesToLondonRoute,
  flightsMiamiToCancunRoute,
  flightsChicagoToLondonRoute,
  flightsSanFranciscoToTokyoRoute,
  flightBookingRoute,
  flightSearchRoute,
  flightSearchResultsRoute,
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
  airlineReservationAssistanceRoute,
  flightBookingAssistanceRoute,
  usaToCanadaFlightsRoute,
  usaToUkFlightsRoute,
  usaToEuropeFlightsRoute,
  usaToMexicoFlightsRoute,
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
