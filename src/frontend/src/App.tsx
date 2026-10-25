import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";

const lazyPage = (loader: () => Promise<{ default: ComponentType }>) => lazy(loader);

const AdminLeadsPage = lazyPage(() => import("@/pages/AdminLeadsPage").then(({ AdminLeadsPage }) => ({ default: AdminLeadsPage })));
const BookAFlightByPhonePage = lazyPage(() => import("@/pages/BookAFlightByPhonePage").then(({ BookAFlightByPhonePage }) => ({ default: BookAFlightByPhonePage })));
const ContactPage = lazyPage(() => import("@/pages/ContactPage").then(({ ContactPage }) => ({ default: ContactPage })));
const FlightBookingPage = lazyPage(() => import("@/pages/FlightBookingPage").then(({ FlightBookingPage }) => ({ default: FlightBookingPage })));
const FlightSearchPage = lazyPage(() => import("@/pages/FlightSearchPage").then(({ FlightSearchPage }) => ({ default: FlightSearchPage })));
const FlightSearchResultsPage = lazyPage(() => import("@/pages/FlightSearchResultsPage").then(({ FlightSearchResultsPage }) => ({ default: FlightSearchResultsPage })));
const HowToBookFlightByPhonePage = lazyPage(() => import("@/pages/HowToBookFlightByPhonePage").then(({ HowToBookFlightByPhonePage }) => ({ default: HowToBookFlightByPhonePage })));

const UsaToMexicoFlightsPage = lazyPage(() => import("@/pages/UsaWorldCountryPages").then(({ UsaToMexicoFlightsPage }) => ({ default: UsaToMexicoFlightsPage })));
const UsaToCanadaFlightsPage = lazyPage(() => import("@/pages/UsaWorldCountryPages").then(({ UsaToCanadaFlightsPage }) => ({ default: UsaToCanadaFlightsPage })));
const UsaToUKFlightsPage = lazyPage(() => import("@/pages/UsaWorldCountryPages").then(({ UsaToUKFlightsPage }) => ({ default: UsaToUKFlightsPage })));

const CheapFlightBookingByPhonePage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ CheapFlightBookingByPhonePage }) => ({ default: CheapFlightBookingByPhonePage })));
const BusinessClassFlightBookingPage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ BusinessClassFlightBookingPage }) => ({ default: BusinessClassFlightBookingPage })));
const CorporateFlightBookingPage = lazyPage(() => import("@/pages/CorporateFlightBookingPage").then(({ CorporateFlightBookingPage }) => ({ default: CorporateFlightBookingPage })));
const FamilyFlightBookingPage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ FamilyFlightBookingPage }) => ({ default: FamilyFlightBookingPage })));
const FlightCancellationAssistancePage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ FlightCancellationAssistancePage }) => ({ default: FlightCancellationAssistancePage })));
const UsaToEuropeFlightsPage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ UsaToEuropeFlightsPage }) => ({ default: UsaToEuropeFlightsPage })));
const PetFlightBookingPage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ PetFlightBookingPage }) => ({ default: PetFlightBookingPage })));
const BaggageAssistancePage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ BaggageAssistancePage }) => ({ default: BaggageAssistancePage })));
const FlightChangeAssistancePage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ FlightChangeAssistancePage }) => ({ default: FlightChangeAssistancePage })));
const SameDayFlightBookingPage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ SameDayFlightBookingPage }) => ({ default: SameDayFlightBookingPage })));
const AirlineReservationAssistancePage = lazyPage(() => import("@/pages/AdditionalBookingPages").then(({ AirlineReservationAssistancePage }) => ({ default: AirlineReservationAssistancePage })));

const GroupFlightBookingPage = lazyPage(() => import("@/pages/BookingIntentPages").then(({ GroupFlightBookingPage }) => ({ default: GroupFlightBookingPage })));
const InternationalFlightBookingPage = lazyPage(() => import("@/pages/BookingIntentPages").then(({ InternationalFlightBookingPage }) => ({ default: InternationalFlightBookingPage })));
const LastMinuteFlightBookingPage = lazyPage(() => import("@/pages/BookingIntentPages").then(({ LastMinuteFlightBookingPage }) => ({ default: LastMinuteFlightBookingPage })));
const MultiCityFlightBookingPage = lazyPage(() => import("@/pages/BookingIntentPages").then(({ MultiCityFlightBookingPage }) => ({ default: MultiCityFlightBookingPage })));

const FlightsFromNewYorkPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromNewYorkPage }) => ({ default: FlightsFromNewYorkPage })));
const FlightsFromLosAngelesPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromLosAngelesPage }) => ({ default: FlightsFromLosAngelesPage })));
const FlightsFromChicagoPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromChicagoPage }) => ({ default: FlightsFromChicagoPage })));
const FlightsFromMiamiPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromMiamiPage }) => ({ default: FlightsFromMiamiPage })));
const FlightsFromAtlantaPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromAtlantaPage }) => ({ default: FlightsFromAtlantaPage })));
const FlightsFromDallasPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromDallasPage }) => ({ default: FlightsFromDallasPage })));
const FlightsFromOrlandoPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromOrlandoPage }) => ({ default: FlightsFromOrlandoPage })));
const FlightsFromSanFranciscoPage = lazyPage(() => import("@/pages/UsGatewayFlightPages").then(({ FlightsFromSanFranciscoPage }) => ({ default: FlightsFromSanFranciscoPage })));

const FlightsNewYorkToLondonPage = lazyPage(() => import("@/pages/RouteFlightPages").then(({ FlightsNewYorkToLondonPage }) => ({ default: FlightsNewYorkToLondonPage })));
const FlightsLosAngelesToTokyoPage = lazyPage(() => import("@/pages/RouteFlightPages").then(({ FlightsLosAngelesToTokyoPage }) => ({ default: FlightsLosAngelesToTokyoPage })));
const FlightsLosAngelesToLondonPage = lazyPage(() => import("@/pages/RouteFlightPages").then(({ FlightsLosAngelesToLondonPage }) => ({ default: FlightsLosAngelesToLondonPage })));
const FlightsSanFranciscoToTokyoPage = lazyPage(() => import("@/pages/RouteFlightPages").then(({ FlightsSanFranciscoToTokyoPage }) => ({ default: FlightsSanFranciscoToTokyoPage })));

import { AmericanAirlinesPage } from "@/pages/airlines/AmericanAirlinesPage";
const AirCanadaPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ AirCanadaPage }) => ({ default: AirCanadaPage })));
const AlaskaAirlinesPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ AlaskaAirlinesPage }) => ({ default: AlaskaAirlinesPage })));
const BritishAirwaysPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ BritishAirwaysPage }) => ({ default: BritishAirwaysPage })));
const JetBlueAirwaysPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ JetBlueAirwaysPage }) => ({ default: JetBlueAirwaysPage })));
const LufthansaPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ LufthansaPage }) => ({ default: LufthansaPage })));
const SouthwestAirlinesPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ SouthwestAirlinesPage }) => ({ default: SouthwestAirlinesPage })));
const SwissAirPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ SwissAirPage }) => ({ default: SwissAirPage })));
const QatarAirwaysPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ QatarAirwaysPage }) => ({ default: QatarAirwaysPage })));
const EmiratesPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ EmiratesPage }) => ({ default: EmiratesPage })));
const NorseAtlanticAirwaysPage = lazyPage(() => import("@/pages/airlines/AdditionalAirlinePages").then(({ NorseAtlanticAirwaysPage }) => ({ default: NorseAtlanticAirwaysPage })));

const DeltaPage = lazyPage(() => import("@/pages/airlines/DeltaPage").then(({ DeltaPage }) => ({ default: DeltaPage })));
const UnitedPage = lazyPage(() => import("@/pages/airlines/UnitedPage").then(({ UnitedPage }) => ({ default: UnitedPage })));
const PrivacyPage = lazyPage(() => import("@/pages/PrivacyPage").then(({ PrivacyPage }) => ({ default: PrivacyPage })));
const TermsPage = lazyPage(() => import("@/pages/TermsPage").then(({ TermsPage }) => ({ default: TermsPage })));
const DisclaimerPage = lazyPage(() => import("@/pages/DisclaimerPage").then(({ DisclaimerPage }) => ({ default: DisclaimerPage })));


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

const petFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pet-flight-booking",
  component: PetFlightBookingPage,
});



const baggageAssistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/baggage-assistance",
  component: BaggageAssistancePage,
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

const corporateFlightBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/corporate-flight-booking",
  component: CorporateFlightBookingPage,
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




const usaToCanadaFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-canada",
  component: UsaToCanadaFlightsPage,
});

const usaToUKFlightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flights-usa-to-uk",
  component: UsaToUKFlightsPage,
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

// Preserve the legacy assistance URL while giving it the correct booking-page metadata.
const flightBookingAssistanceAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/flight-booking-assistance",
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

const disclaimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/disclaimer",
  component: DisclaimerPage,
});

const adminLeadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/leads",
  component: AdminLeadsPage,
});

export const routeTree = rootRoute.addChildren([
  petFlightBookingRoute,

  baggageAssistanceRoute,

  indexRoute,

  usaToMexicoFlightsRoute,
  usaToCanadaFlightsRoute,
  usaToUKFlightsRoute,
  flightsFromNewYorkRoute,
  flightsFromLosAngelesRoute,
  flightsFromChicagoRoute,
  flightsFromMiamiRoute,
  flightsFromAtlantaRoute,
  flightsFromDallasRoute,
  flightsFromOrlandoRoute,
  flightsFromSanFranciscoRoute,
  flightsNewYorkToLondonRoute,


  flightsLosAngelesToTokyoRoute,
  flightsLosAngelesToLondonRoute,


  flightsSanFranciscoToTokyoRoute,
  flightBookingRoute,
  flightBookingAssistanceAliasRoute,
  flightSearchRoute,
  flightSearchResultsRoute,
  internationalFlightBookingRoute,
  lastMinuteFlightBookingRoute,
  multiCityFlightBookingRoute,
  groupFlightBookingRoute,
  cheapFlightBookingByPhoneRoute,
  businessClassFlightBookingRoute,
  corporateFlightBookingRoute,
  sameDayFlightBookingRoute,
  familyFlightBookingRoute,
  flightChangeAssistanceRoute,
  flightCancellationAssistanceRoute,
  airlineReservationAssistanceRoute,

  usaToEuropeFlightsRoute,










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


  norseAtlanticAirwaysRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  disclaimerRoute,
  adminLeadsRoute,
]);

const router = createRouter({
  routeTree,
  // Match the trailing-slash canonicals emitted by static SEO HTML and sitemap.xml.
  trailingSlash: "always",
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
