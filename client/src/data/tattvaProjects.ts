export interface TattvaProject {
  id: string;
  projectTitle: string;
  subtitle: string;
  videoId: string;
  youtubeUrl?: string;
  thumbnail?: string;
  duration?: string;
  projectOverview: string;
  scientificPrinciple: string;
  tattvaConnection: string;
  keyInsight: string;
}

export interface TattvaProjectsData {
  shloka: number;
  tattvaId?: string;
  title: string;
  projects: TattvaProject[];
}

export const TATTVA_PROJECTS: Record<number, TattvaProjectsData> = {
  1: {
    shloka: 1,
    tattvaId: "d1",
    title: "Ātma Pratibimba",
    projects: [
      {
        id: "proj-1-1",
        projectTitle: "Optics & Reflective Perception",
        subtitle: "Discover how light reflection and optics mirror inner consciousness.",
        videoId: "8nAHk_PTWhY",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  2: {
    shloka: 2,
    tattvaId: "d2",
    title: "Jagad Bījāṅkura",
    projects: [
      {
        id: "proj-2-1",
        projectTitle: "Unfolding Fractals & Seed Potential",
        subtitle: "Mathematical expansion of microscopic seed code into macro structures.",
        videoId: "6wmPi3IVPJ8",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  3: {
    shloka: 3,
    tattvaId: "d3",
    title: "Svapna Saṅkalpa",
    projects: [
      {
        id: "proj-3-1",
        projectTitle: "Neuroscience of Conscious States",
        subtitle: "Exploring neural dynamics between waking focus and unmanifest dream realms.",
        videoId: "VqJvI-nBYW4",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  4: {
    shloka: 4,
    tattvaId: "d4",
    title: "Jñāna Dīpa",
    projects: [
      {
        id: "proj-4-1",
        projectTitle: "Resonance & Wave Interference",
        subtitle: "Understanding coherent wave harmonics as metaphors for intuitive wisdom.",
        videoId: "fCTUpOQ4Lc4",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  5: {
    shloka: 5,
    tattvaId: "d5",
    title: "Māyā Tattva",
    projects: [
      {
        id: "proj-5-1",
        projectTitle: "Quantum Observer Phenomenon",
        subtitle: "How observation influences quantum states and physical measurement.",
        videoId: "dlvdApjJy0w",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  6: {
    shloka: 6,
    tattvaId: "d6",
    title: "Svapnāvasthā",
    projects: [
      {
        id: "proj-6-1",
        projectTitle: "Entropy & Time Asymmetry",
        subtitle: "Analyzing thermodynamic arrow of time and subjective temporal perception.",
        videoId: "JWkZhLMmwFc",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  7: {
    shloka: 7,
    tattvaId: "d7",
    title: "Satsaṅga Prakāśa",
    projects: [
      {
        id: "proj-7-1",
        projectTitle: "Field Interactions & Electromagnetism",
        subtitle: "Interconnected force fields demonstrating unified action across distances.",
        videoId: "II67XklUm2E",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  8: {
    shloka: 8,
    tattvaId: "d8",
    title: "Māyā Chakra",
    projects: [
      {
        id: "proj-8-1",
        projectTitle: "Non-Linear Dynamics & Chaos Theory",
        subtitle: "Complex system dynamics arising from underlying deterministic rules.",
        videoId: "K4YhKj1pt3o",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  9: {
    shloka: 9,
    tattvaId: "d9",
    title: "Saccidānanda",
    projects: [
      {
        id: "proj-9-1",
        projectTitle: "Cymatics & Acoustic Geometry",
        subtitle: "Sacred geometric patterns formed by sound frequency vibrations.",
        videoId: "vD5EM8gUFMs",
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  },
  10: {
    shloka: 10,
    tattvaId: "d10",
    title: "Pūrṇatā",
    projects: [
      {
        id: "proj-10-1",
        projectTitle: "Holographic Universe Model",
        subtitle: "Information encoding where every part contains the whole universe.",
        videoId: "vD5EM8gUFMs", // or ojifd_owbpc as specified for Shloka 10
        projectOverview: "This project overview will be added.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "This section will explain how this scientific demonstration reflects the philosophical teaching of this Tattva.",
        keyInsight: "The key insight will be added."
      }
    ]
  }
};

// Shloka 10 videoId correction to ojifd_owbpc
TATTVA_PROJECTS[10].projects[0].videoId = "ojifd_owbpc";

/**
 * Resolves the Tattva Projects for a given domain object or index.
 */
export function getProjectsForDomain(domainOrSlug?: any): TattvaProject[] {
  if (!domainOrSlug) return [];

  let shlokaNum: number | undefined;

  if (typeof domainOrSlug === "number") {
    shlokaNum = domainOrSlug;
  } else if (typeof domainOrSlug === "string") {
    const slugMap: Record<string, number> = {
      "meditation": 1,
      "yoga": 2,
      "mindfulness": 3,
      "sacred-geometry": 4,
      "spiritual-science": 5,
      "conscious-living": 6,
      "divine-energy": 7,
      "sacred-scriptures": 8,
      "ancient-wisdom": 9,
      "universal-consciousness": 10,
    };
    shlokaNum = slugMap[domainOrSlug];
  } else if (typeof domainOrSlug === "object") {
    // Try energyIndicator e.g. "1st Tattva"
    if (domainOrSlug.energyIndicator) {
      const match = domainOrSlug.energyIndicator.match(/(\d+)/);
      if (match) shlokaNum = parseInt(match[1], 10);
    }
    // Try id e.g. "d1"
    if (!shlokaNum && domainOrSlug.id) {
      const match = domainOrSlug.id.match(/d(\d+)/i);
      if (match) shlokaNum = parseInt(match[1], 10);
    }
    // Try slug
    if (!shlokaNum && domainOrSlug.slug) {
      const slugMap: Record<string, number> = {
        "meditation": 1,
        "yoga": 2,
        "mindfulness": 3,
        "sacred-geometry": 4,
        "spiritual-science": 5,
        "conscious-living": 6,
        "divine-energy": 7,
        "sacred-scriptures": 8,
        "ancient-wisdom": 9,
        "universal-consciousness": 10,
      };
      shlokaNum = slugMap[domainOrSlug.slug];
    }
  }

  if (shlokaNum && TATTVA_PROJECTS[shlokaNum]) {
    return TATTVA_PROJECTS[shlokaNum].projects;
  }

  return [];
}
