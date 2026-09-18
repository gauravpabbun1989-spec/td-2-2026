import { MobileCallBar } from "@/components/MobileCallBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

/**
 * Shared application shell: skip link, sticky header, main landmark, footer,
 * and the mobile call bar. Every route renders inside this shell.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main-content"
        data-ocid="site.skip_link"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-elevated"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main
        id="main-content"
        data-ocid="site.main"
        className="flex-1 pb-24 sm:pb-0"
      >
        {children}
      </main>

      <SiteFooter />
      <MobileCallBar />
    </div>
  );
}
