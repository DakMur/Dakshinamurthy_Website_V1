export interface NavSection {
  id: string;
  path: string;
  label: string;
  aliases: string[];
}

export const BASE_DOMAIN = "https://vedanta-makeathon.vercel.app";

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "discover",
    path: "/discover",
    label: "Discover",
    aliases: ["prathama-prakasha", "prathama", "prathama-prakasa", "storytelling", "wisdom", "discover"],
  },
  {
    id: "themes",
    path: "/themes",
    label: "Themes",
    aliases: ["theme", "makeathon-themes", "themes"],
  },
  {
    id: "technical-workshop",
    path: "/technical-workshop",
    label: "Technical Workshop",
    aliases: ["workshop", "param-workshop", "technical-workshop"],
  },
  {
    id: "tattva-darshana",
    path: "/tattva-darshana",
    label: "Tattva Darśana",
    aliases: ["tattva", "tattva-darsana", "domains"],
  },
  {
    id: "timeline",
    path: "/timeline",
    label: "Timeline",
    aliases: ["innovation-timeline", "chronology-timeline", "flow", "marga-darshana"],
  },
  {
    id: "notice-board",
    path: "/notice-board",
    label: "Notice Board",
    aliases: ["notices", "notice-board", "sucana-patta"],
  },
  {
    id: "registration",
    path: "/registrations",
    label: "Registration",
    aliases: ["registrations", "registration", "register", "login"],
  },
  {
    id: "workspace",
    path: "/workspace",
    label: "Team Workspace",
    aliases: ["workspace", "team-workspace", "dashboard"],
  },
  {
    id: "admin",
    path: "/admin",
    label: "Admin Panel",
    aliases: ["admin", "control-panel"],
  },
];

export const LANDING_PATH = "/";

export function normalizePathname(pathname: string): string {
  const clean = pathname.trim().replace(/\/+$/, "") || "/";
  return clean;
}

export function parsePath(pathname: string): { isLanding: boolean; activeSectionId: string } {
  let clean = normalizePathname(pathname);

  // Strip legacy subpath prefix if present (e.g. /dakshinamurthy-darshini/...)
  if (clean.startsWith("/dakshinamurthy-darshini")) {
    clean = clean.replace(/^\/dakshinamurthy-darshini/, "") || "/";
  }

  // Check if landing page
  if (
    clean === "/" ||
    clean === LANDING_PATH ||
    clean === "/home" ||
    clean === "/landing"
  ) {
    return { isLanding: true, activeSectionId: "discover" };
  }

  // Check exact section paths
  for (const sec of NAV_SECTIONS) {
    if (clean === sec.path) {
      return { isLanding: false, activeSectionId: sec.id };
    }
  }

  // Check aliases (e.g. /tattva or /domains)
  for (const sec of NAV_SECTIONS) {
    for (const alias of sec.aliases) {
      if (
        clean === `/${alias}` ||
        clean.endsWith(`/${alias}`)
      ) {
        return { isLanding: false, activeSectionId: sec.id };
      }
    }
  }

  // Default to landing
  return { isLanding: true, activeSectionId: "discover" };
}

export function getSectionPath(sectionId: string): string {
  if (sectionId === "landing" || sectionId === "home" || sectionId === "") {
    return LANDING_PATH;
  }
  const found = NAV_SECTIONS.find(
    (s) => s.id === sectionId || s.aliases.includes(sectionId)
  );
  return found ? found.path : `/${sectionId}`;
}

export function getFullUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_DOMAIN}${cleanPath === "/" ? "" : cleanPath}`;
}
