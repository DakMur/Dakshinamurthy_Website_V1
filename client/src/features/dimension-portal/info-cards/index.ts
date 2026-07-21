import React, { lazy } from "react";
import { DomainContent } from "../../../types/types";

// ── Lazy info-card page registry ──────────────────────────────────────────
// Each page is split into its own async chunk. Only the page matching the
// active domain slug is ever fetched, on-demand when the modal opens.
const PageOne   = lazy(() => import("./PageOne"));
const PageTwo   = lazy(() => import("./PageTwo"));
const PageThree = lazy(() => import("./PageThree"));
const PageFour  = lazy(() => import("./PageFour"));
const PageFive  = lazy(() => import("./PageFive"));
const PageSix   = lazy(() => import("./PageSix"));
const PageSeven = lazy(() => import("./PageSeven"));
const PageEight = lazy(() => import("./PageEight"));
const PageNine  = lazy(() => import("./PageNine"));
const PageTen   = lazy(() => import("./PageTen"));
// ─────────────────────────────────────────────────────────────────────────

/**
 * Central slug-to-component registry.
 * Maps each domain slug to its fully self-contained lazy page component.
 */
export const INFO_CARD_REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType<{
  domain: DomainContent;
  allDomains?: DomainContent[];
  onNavigateToDomain?: (domain: DomainContent) => void;
  onReturn?: () => void;
}>>> = {
  "meditation": PageOne,
  "yoga": PageTwo,
  "mindfulness": PageThree,
  "sacred-geometry": PageFour,
  "spiritual-science": PageFive,
  "conscious-living": PageSix,
  "divine-energy": PageSeven,
  "sacred-scriptures": PageEight,
  "ancient-wisdom": PageNine,
  "universal-consciousness": PageTen,
};

