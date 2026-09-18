import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** Background band. Alternating bands create the editorial rhythm. */
  tone?: "paper" | "muted" | "navy";
  className?: string;
  id?: string;
  ocid?: string;
  "aria-labelledby"?: string;
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  paper: "bg-background text-foreground",
  muted: "bg-muted text-foreground",
  navy: "bg-primary text-primary-foreground",
};

/**
 * Full-bleed section band with a centered content container. Keeps vertical
 * rhythm and zone separation consistent across every page.
 */
export function Section({
  children,
  tone = "paper",
  className,
  id,
  ocid,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  return (
    <section
      id={id}
      data-ocid={ocid}
      aria-labelledby={ariaLabelledBy}
      className={cn("w-full", toneClasses[tone], className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        {children}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  /** Departure-board micro-label rendered above the heading. */
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <p className="label-board text-accent">{eyebrow}</p> : null}
      <h2
        id={id}
        className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
