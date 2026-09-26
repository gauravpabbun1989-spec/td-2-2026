import { Layout } from "@/components/Layout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: lazyRouteComponent(() => import("./pages/NotFoundPage"), "NotFoundPage"),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./pages/HomePage"), "HomePage"),
});

const howToBookFlightByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/how-to-book-a-flight-by-phone",
  component: lazyRouteComponent(() => import("./pages/HowToBookFlightByPhonePage"), "HowToBookFlightByPhonePage"),
});

const bookAFlightByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book-a-flight-by-phone",
  component: lazyRouteComponent(() => import("./pages/BookAFlightByPhonePage"), "BookAFlightByPhonePage"),
});

const internationalFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/international-flight-booking",
  component: lazyRouteComponent(() => import("./pages/BookingIntentPages"), "InternationalFlightBookingPage"),
});

const lastMinuteFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/last-minute-flight-booking",
  component: lazyRouteComponent(() => import("./pages/BookingIntentPages"), "LastMinuteFlightBookingPage"),
});

const multiCityFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/multi-city-flight-booking",
  component: lazyRouteComponent(() => import("./pages/BookingIntentPages"), "MultiCityFlightBookingPage"),
});

const groupFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group-flight-booking",
  component: lazyRouteComponent(() => import("./pages/BookingIntentPages"), "GroupFlightBookingPage"),
});

const cheapFlightBookingByPhoneRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cheap-flight-booking-by-phone",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "CheapFlightBookingByPhonePage"),
});

const businessClassFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business-class-flight-booking",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "BusinessClassFlightBookingPage"),
});

const sameDayFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/same-day-flight-booking",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "SameDayFlightBookingPage"),
});

const familyFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/family-flight-booking",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "FamilyFlightBookingPage"),
});

const flightChangeAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-change-assistance",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "FlightChangeAssistancePage"),
});

const flightCancellationAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-cancellation-assistance",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "FlightCancellationAssistancePage"),
});

const airlineReservationAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/airline-reservation-assistance",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "AirlineReservationAssistancePage"),
});

const flightBookingAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking-assistance",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "FlightBookingAssistancePage"),
});


const usaToCanadaFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-canada",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "UsaToCanadaFlightsPage"),
});

const usaToUkFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-uk",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "UsaToUkFlightsPage"),
});

const usaToEuropeFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-europe",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "UsaToEuropeFlightsPage"),
});

const usaToMexicoFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-mexico",
  component: lazyRouteComponent(() => import("./pages/AdditionalBookingPages"), "UsaToMexicoFlightsPage"),
});

const flightsFromNewYorkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-new-york",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromNewYorkPage"),
});

const flightsFromLosAngelesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-los-angeles",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromLosAngelesPage"),
});

const flightsFromChicagoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-chicago",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromChicagoPage"),
});

const flightsFromMiamiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-miami",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromMiamiPage"),
});

const flightsFromAtlantaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-atlanta",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromAtlantaPage"),
});

const flightsFromDallasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-dallas",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromDallasPage"),
});

const flightsFromOrlandoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-orlando",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromOrlandoPage"),
});

const flightsFromSanFranciscoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-from-san-francisco",
  component: lazyRouteComponent(() => import("./pages/UsGatewayFlightPages"), "FlightsFromSanFranciscoPage"),
});

const flightsNewYorkToLondonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-new-york-to-london",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsNewYorkToLondonPage"),
});

const flightsNewYorkToParisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-new-york-to-paris",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsNewYorkToParisPage"),
});

const flightsNewYorkToDubaiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-new-york-to-dubai",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsNewYorkToDubaiPage"),
});

const flightsLosAngelesToTokyoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-los-angeles-to-tokyo",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsLosAngelesToTokyoPage"),
});

const flightsLosAngelesToLondonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-los-angeles-to-london",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsLosAngelesToLondonPage"),
});

const flightsMiamiToCancunRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-miami-to-cancun",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsMiamiToCancunPage"),
});

const flightsChicagoToLondonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-chicago-to-london",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsChicagoToLondonPage"),
});

const flightsSanFranciscoToTokyoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-san-francisco-to-tokyo",
  component: lazyRouteComponent(() => import("./pages/RouteFlightPages"), "FlightsSanFranciscoToTokyoPage"),
});

const flightSearchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-search",
  component: lazyRouteComponent(() => import("./pages/FlightSearchPage"), "FlightSearchPage"),
});

const flightSearchResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-search-results",
  component: lazyRouteComponent(() => import("./pages/FlightSearchResultsPage"), "FlightSearchResultsPage"),
});

const flightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking",
  component: lazyRouteComponent(() => import("./pages/FlightBookingPage"), "FlightBookingPage"),
});

const deltaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/delta-airlines",
  component: lazyRouteComponent(() => import("./pages/airlines/DeltaPage"), "DeltaPage"),
});

const unitedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/united-airlines",
  component: lazyRouteComponent(() => import("./pages/airlines/UnitedPage"), "UnitedPage"),
});

const americanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/american-airlines",
  component: lazyRouteComponent(() => import("./pages/airlines/AmericanAirlinesPage"), "AmericanAirlinesPage"),
});

const southwestAirlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/southwest-airlines",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "SouthwestAirlinesPage"),
});

const jetBlueAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jetblue-airways",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "JetBlueAirwaysPage"),
});

const alaskaAirlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alaska-airlines",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "AlaskaAirlinesPage"),
});

const britishAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/british-airways",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "BritishAirwaysPage"),
});

const lufthansaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lufthansa",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "LufthansaPage"),
});

const airCanadaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/air-canada",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "AirCanadaPage"),
});

const swissAirRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/swiss-air",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "SwissAirPage"),
});

const qatarAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/qatar-airways",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "QatarAirwaysPage"),
});

const emiratesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emirates",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "EmiratesPage"),
});

const lotPolishAirlinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lot-polish-airlines",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "LotPolishAirlinesPage"),
});

const norseAtlanticAirwaysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/norse-atlantic-airways",
  component: lazyRouteComponent(() => import("./pages/airlines/AdditionalAirlinePages"), "NorseAtlanticAirwaysPage"),
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: lazyRouteComponent(() => import("./pages/ContactPage"), "ContactPage"),
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: lazyRouteComponent(() => import("./pages/PrivacyPage"), "PrivacyPage"),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: lazyRouteComponent(() => import("./pages/TermsPage"), "TermsPage"),
});

const adminLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/leads",
  component: lazyRouteComponent(() => import("./pages/AdminLeadsPage"), "AdminLeadsPage"),
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
