export interface NavSection {
  id: string;
  path: string;
  label: string;
  aliases: string[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "prathama-prakasha",
    path: "/dakshinamurthy-darshini/prathama-prakasha",
    label: "Prathama Prakasa",
    aliases: ["prathama", "prathama-prakasa", "storytelling", "wisdom"],
  },
  {
    id: "tattva-darshana",
    path: "/dakshinamurthy-darshini/tattva-darshana",
    label: "Tattva Darśana",
    aliases: ["tattva", "tattva-darsana", "domains"],
  },
  {
    id: "innovation-timeline",
    path: "/dakshinamurthy-darshini/innovation-timeline",
    label: "Innovation Timeline",
    aliases: ["timeline", "chronology-timeline", "flow", "marga-darshana"],
  },
  {
    id: "notice-board",
    path: "/dakshinamurthy-darshini/notice-board",
    label: "Notice Board",
    aliases: ["notices", "notice-board", "sucana-patta"],
  },
  {
    id: "registration",
    path: "/dakshinamurthy-darshini/registration",
    label: "Registration",
    aliases: ["registration", "admin"],
  },
];

export const LANDING_PATH = "/dakshinamurthy-darshini";

export function normalizePathname(pathname: string): string {
  const clean = pathname.trim().replace(/\/+$/, "") || "/";
  return clean;
}

export function parsePath(pathname: string): { isLanding: boolean; activeSectionId: string } {
  const clean = normalizePathname(pathname);

  // Check if landing page
  if (
    clean === "/" ||
    clean === LANDING_PATH ||
    clean === "/home" ||
    clean === "/landing"
  ) {
    return { isLanding: true, activeSectionId: "prathama-prakasha" };
  }

  // Check exact section paths
  for (const sec of NAV_SECTIONS) {
    if (clean === sec.path) {
      return { isLanding: false, activeSectionId: sec.id };
    }
  }

  // Check aliases (e.g. /dakshinamurthy-darshini/tattva or /tattva or /domains)
  for (const sec of NAV_SECTIONS) {
    for (const alias of sec.aliases) {
      if (
        clean === `/${alias}` ||
        clean === `/dakshinamurthy-darshini/${alias}` ||
        clean.endsWith(`/${alias}`)
      ) {
        return { isLanding: false, activeSectionId: sec.id };
      }
    }
  }

  // If path starts with /dakshinamurthy-darshini/... but unknown subsection, treat as section page
  if (clean.startsWith("/dakshinamurthy-darshini")) {
    return { isLanding: false, activeSectionId: "prathama-prakasha" };
  }

  // Default to landing
  return { isLanding: true, activeSectionId: "prathama-prakasha" };
}

export function getSectionPath(sectionId: string): string {
  const found = NAV_SECTIONS.find(
    (s) => s.id === sectionId || s.aliases.includes(sectionId)
  );
  return found ? found.path : `/dakshinamurthy-darshini/${sectionId}`;
}
