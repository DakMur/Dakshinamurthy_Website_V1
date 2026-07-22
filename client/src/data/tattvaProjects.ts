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
        projectTitle: "Infinity Mirror",
        subtitle: "An optical illusion of infinite depth representing the vast canvas of human consciousness.",
        videoId: "8nAHk_PTWhY",
        projectOverview: "This installation uses two mirrors—one fully reflective and one partially silvered—aligned parallel to each other with a border of LED lights in between. Light bounces repeatedly between the reflective surfaces, creating an optical illusion of an endless tunnel. Each successive bounce transmits a fraction of light while reflecting the rest, resulting in a series of increasingly faint images that recede into apparent infinity. This setup demonstrates fundamental principles of geometric optics, partial transmission, and light attenuation, illustrating how physical boundaries can construct the perception of boundless space.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "In Advaita Vedanta, the universe is understood to arise and exist entirely within the light of awareness. Just as the parallel mirrors construct an illusion of endless physical depth from a finite source of light, consciousness projects the vastness of the external world from within itself. The mirror symbolizes the changeless Self (Ātman), and the receding reflections represent the multitude of name and form. Rather than being distracted by the illusion of external infinity, the viewer is invited to realize the singular source that illumines the entire display.",
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
        projectTitle: "Layered Silicon Wafer",
        subtitle: "A multi-layered semiconductor structure illustrating the emergence of complexity from a blank substrate.",
        videoId: "6wmPi3IVPJ8",
        projectOverview: "This demonstration explores the design and fabrication of a modern microchip from a single, highly purified silicon wafer. The process begins with a blank substrate of crystalline silicon, onto which multiple layers—insulators, semiconductor channels, and metallic interconnects—are systematically grown, etched, and doped. Through precise photolithography, a complex network of millions of transistors is constructed on what was originally an inert, featureless base. The final integrated circuit showcases how immense functional diversity and logical complexity are systematically generated from a single, uniform material source.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "Just as a featureless silicon substrate contains the latent potential to manifest a complex microchip, Shloka 2 teaches that the entire cosmos exists in an unmanifest state within the Divine before creation. The blank silicon wafer acts as the unmanifest source, while the lithographic patterns represent the cosmic projections of Māyā. The manifest layers of transistors and gates do not add any new material but merely reorganize the latent potential of the base silicon. This demonstrates that the manifold universe is not a separate creation, but the unmanifest essence unfolding into diverse forms.",
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
        projectTitle: "EEG Mosaic",
        subtitle: "A brainwave-driven digital mosaic demonstrating the singular essence behind diverse mental expressions.",
        videoId: "VqJvI-nBYW4",
        projectOverview: "This project translates real-time electroencephalogram (EEG) signals from a user into a dynamic digital mosaic. By processing brainwaves, the system classifies the user's current cognitive state—such as tranquility, focus, or agitation—and generates a corresponding mosaic image. From a standard viewing distance, the mosaic depicts a collective portrait representing that specific mental state. However, upon close magnification, the viewer discovers that every individual tile or superpixel of the mosaic is formed from the exact same image of the user's face, illustrating how macroscopic diversity is constructed from a singular, repeating element.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "Inspired by the teaching of Sarvātmabhāva in Shloka 3, the EEG Mosaic reveals that the apparent multiplicity of the world is comprised of a singular underlying reality. While the overall mosaic represents different emotional states and variations, closer inspection shows that every single tile is the observer's own face. Similarly, Advaita Vedanta teaches that the Ātman is the true, non-dual essence present within all beings and phenomena. By refining our vision (dṛṣṭi), we look past the surface-level differences of the manifest universe to recognize the single consciousness that constitutes all of existence.",
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
        projectTitle: "Viveka Vara",
        subtitle: "A real-time generative reality engine demonstrating how awareness illumines emotional states.",
        videoId: "fCTUpOQ4Lc4",
        projectOverview: "Viveka Vara is an interactive Generative Reality Engine that detects and responds to human emotional states in real time. Combining facial expression analysis, vocal tone tracking, and natural language input, the system utilizes DeepFace, OpenCV, and Gemini AI to dynamically alter a digital 2D environment. As the user transitions between joy, sorrow, anger, and tranquility, the environment shifts visually and acoustically. Meanwhile, an AI companion named Viveka offers philosophical guidance, providing an objective space for users to observe and reflect on the transient nature of their own feelings.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "Corresponding to Shloka 4, Viveka Vara serves as a model for how consciousness acts as the singular light that illumines all human experience. Just as the generative engine detects, enlivens, and renders various emotional landscapes on screen, pure awareness (Caitanyamātmā) is the constant light that makes joy, sorrow, and anger cognizable. The changing digital graphics represent the temporary states of the mind, whereas the underlying engine represents the unchanging witness. The project demonstrates that all mental states are ultimately revealed and known only by the light of consciousness.",
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
        projectTitle: "Phantom Hand Illusion",
        subtitle: "A sensory realignment experiment demonstrating the mind's tendency to misidentify physical form.",
        videoId: "dlvdApjJy0w",
        projectOverview: "This neuroscience demonstration replicates the classic rubber hand illusion to explore the limits of body ownership. A participant's real hand is hidden behind a vertical divider while a realistic rubber hand is placed in full view. By simultaneously stroking both the hidden real hand and the visible artificial hand, the brain receives matching visual and tactile feedback. Within minutes, the subject's brain reconciles this sensory input by adopting the rubber hand as its own. When the rubber hand is suddenly struck with a hammer, the subject experiences an automatic, visceral threat response and localized pain, illustrating the malleability of somatic identity.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "Shloka 5 addresses the error of mistaking the physical body, vital energy, and mind for the real Self. In the Phantom Hand Illusion, the brain extends its sense of identity to an inert, artificial object due to coordinated sensory feedback, suffering genuine distress when that object is threatened. Similarly, the pure Ātman falsely identifies with the non-sentient physical body, experiencing the body's pain and limitations as its own. By applying discrimination (viveka), one can de-identify from these external instruments, recognizing that the true Self is completely untouched by physical modifications.",
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
        projectTitle: "Vanishing Dots Illusion",
        subtitle: "A visual trick demonstrating the brain's habit of filtering out static, unchanging information.",
        videoId: "JWkZhLMmwFc",
        projectOverview: "This demonstration showcases Troxler’s fading and the Ganzfeld effect through a simple visual field. When a viewer focuses steadily on a central blinking point, three peripheral, static yellow dots gradually disappear from conscious awareness. This occurs because the human sensory system is tuned to detect changes rather than constant stimuli. When eye movement is minimized, the brain filters out the non-varying sensory inputs as background noise, rendering the dots invisible until a saccadic eye movement introduces variation. This reveals how cognitive processes actively select for movement, leaving the changeless elements unperceived.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "In Shloka 6, the stotram explains that the ever-present, unchanging Self is filtered out of daily awareness because the mind is conditioned to perceive only transient experiences. Just as the brain ceases to register the static yellow dots to focus on the active blinking center, the intellect ignores the constant light of the Ātman to follow changing thoughts and sensations. In deep sleep, where all external variations cease, the Self continues to shine, yet goes unrecognized due to this cognitive habit. Yoga trains the mind to overcome this outward bias, revealing the ever-present ground of awareness.",
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
        projectTitle: "Noise Removal",
        subtitle: "A digital signal processing demonstration isolating a constant signal from chaotic external noise.",
        videoId: "II67XklUm2E",
        projectOverview: "This demonstration exhibits how digital signal processing algorithms isolate a static background from a noisy video stream. By analyzing successive frames, the algorithm identifies pixels that remain constant and filters out transient perturbations, such as static white noise or moving pedestrians. Unlike optical flow which highlights motion, this technique tracks temporal invariance to reconstruct a pristine image of the background. By adjusting the filter's mathematical parameters, viewers can witness how a clean, unchanging signal can be extracted from a highly disrupted and dynamically changing input stream.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "Just as the noise removal algorithm filters out transient movements to reveal the static background, Shloka 7 teaches us to discover the changeless Self underlying the fluctuations of life. Our body, thoughts, and environment are the continuous noise, while the quiet sense of 'I'—which persists from childhood to old age and across waking, dreaming, and deep sleep—is the static background. Through quiet reflection and meditation, one learns to look past the chaotic noise of daily experiences, isolating and resting in the pure, silent awareness that witnesses all changes without being altered by them.",
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
        projectTitle: "Stroboscopic Water Droplets",
        subtitle: "An optical illusion using flashing light to manipulate the perceived direction of falling water.",
        videoId: "K4YhKj1pt3o",
        projectOverview: "This exhibit demonstrates the stroboscopic effect using falling water droplets illuminated by a high-frequency flickering LED light source. When the strobe frequency is tuned to match the frequency of the falling droplets, the droplets appear completely suspended in mid-air. Adjusting the light's flash rate slightly faster or slower creates the vivid illusion that the water is moving upward or falling in slow motion. This phenomenon arises from optical aliasing, where the human brain stitches discrete, illuminated snapshots of different droplets into a single, continuous trajectory of motion that does not physically exist.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "Corresponding to Shloka 8, the stroboscopic effect illustrates that our perceptions of causality and temporal progression can be entirely illusory. In this demonstration, a viewer perceives a single droplet rising upward, attributing a cause-and-effect relationship to a sequence of unrelated droplets frozen in light. Advaita Vedanta asserts that the concept of time and the linear sequence of cause and effect in the universe are similarly superimposed. The universe is a series of discrete appearances enlivened by the light of consciousness, which the mind mistakenly connects into a continuous, causal reality.",
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
        projectTitle: "Layered Silicon Wafer",
        subtitle: "A study of integrated semiconductor layers symbolizing the interconnected elements of the cosmos.",
        videoId: "vD5EM8gUFMs",
        projectOverview: "This demonstration showcases the layered architecture of a silicon wafer chip, composed of a base substrate, thermally grown silicon dioxide insulation, photoresist patterning, doped active regions, polysilicon gates, and metallic interconnects. Together, these distinct layers form a unified, functional integrated circuit. By mapping the layout of these individual layers, the project demonstrates how each stratum—while chemically and physically distinct—must integrate seamlessly to facilitate electron mobility and logic gates, illustrating the precise engineering behind modern microprocessors.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "The multi-layered chip reflects the Aṣṭamūrti teaching of Shloka 9, which views the macrocosm as composed of eight interconnected layers: earth, water, fire, air, space, sun, moon, and living beings. In this analogy, the individual layers of the silicon chip represent these cosmic elements. Just as no single layer can function in isolation to form a working circuit, the eight elements are interconnected facets of a single divine presence. The electric current flowing through the chip symbolizes the singular consciousness that pervades and enlivens all eight layers of the cosmos.",
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
        projectTitle: "Magnetization of Iron",
        subtitle: "A physics demonstration showing how external influence aligns latent magnetic dipoles in iron.",
        videoId: "vD5EM8gUFMs", // or ojifd_owbpc as specified for Shloka 10
        projectOverview: "This demonstration illustrates the process of ferromagnetism using an ordinary piece of iron and a permanent magnet. Initially, the iron exhibits no external attraction because its microscopic magnetic dipoles are randomly oriented, canceling each other out. By repeatedly stroking the iron with the permanent magnet in a uniform direction, these atomic moments align, creating organized magnetic domains. The iron becomes magnetized, acquiring the capacity to attract other metal objects. This exhibit demonstrates magnetic induction, domain alignment, and the thermodynamic factors like heat that can disorganize domains and demagnetize the material.",
        scientificPrinciple: "The scientific principle demonstrated by this project will be added.",
        tattvaConnection: "According to Shloka 10, spiritual capabilities and the realization of non-dual consciousness are already present within every individual in a latent form. The unmagnetized iron represents the spiritual seeker, whose innate potential is scattered. The repeated stroking by a permanent magnet is analogous to the consistent practice (sādhanā) of contemplation and the guidance of a Guru. Just as the external magnet aligns the latent dipoles of the iron to manifest its magnetism, systematic spiritual practice aligns the mind and intellect, manifesting the inherent divine nature and inner potential already present within.",
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
