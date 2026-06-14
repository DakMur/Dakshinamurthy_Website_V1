import React from "react";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
import PageThree from "./PageThree";
import PageFour from "./PageFour";
import PageFive from "./PageFive";
import PageSix from "./PageSix";
import PageSeven from "./PageSeven";
import PageEight from "./PageEight";
import PageNine from "./PageNine";
import PageTen from "./PageTen";
import { DomainContent } from "../../../types/types";

/**
 * Central slug-to-component registry.
 * Maps each domain slug to its fully self-contained page component.
 */
export const INFO_CARD_REGISTRY: Record<string, React.ComponentType<{
  domain: DomainContent;
  allDomains?: DomainContent[];
  onNavigateToDomain?: (domain: DomainContent) => void;
  onReturn?: () => void;
}>> = {
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
