// Production-safe application bootstrap. Vite processes this file as an entrypoint,
// so the deployed HTML never tries to load raw TSX from /src/main.tsx at runtime.
export {};

declare global {
  interface Window {
    isKnownProbePath?: () => boolean;
  }
}

const root = document.getElementById("root");

if (window.isKnownProbePath?.()) {
  document.title = "404 — Page Not Found | TicketDepart";
  if (root) {
    root.innerHTML =
      '<main style="min-height:100vh;display:grid;place-content:center;padding:24px;box-sizing:border-box;font:16px Arial,sans-serif;color:#18233d;background:#fbfaf6"><h1 style="margin:0 0 12px">Page not found</h1><p style="margin:0">The requested page is unavailable.</p></main>';
  }
} else {
  // Dynamic import is compiled by Vite into a production asset chunk.
  void import("./main");
}
