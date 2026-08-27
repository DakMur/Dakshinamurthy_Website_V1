import { useState, useEffect, useCallback } from "react";
import { DomainContent, Article, TimelineStep, Quote, Comment, AnalyticsStats } from "../types/types";

export const FALLBACK_DOMAINS: DomainContent[] = [
  {
    id: "d1",
    slug: "meditation",
    title: "Ātma Pratibimba",
    subtitle: "Who Am I? And What Is This World?",
    icon: "Eye",
    summary: "The world reflects consciousness, and liberation comes through realizing the Self alone is real.",
    description: "The world appears vast and separate, yet it is known only because consciousness illumines it. Just as a city reflected in a mirror has no existence apart from the mirror, the universe is experienced only within the light of awareness.",
    quote: "Viśvaṁ darpaṇa-dṛśyamāna-nagarī-tulyaṁ nijāntargataṁ paśyannātmani māyayā bahirivodbhūtaṁ yathā nidrayā...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Transcendental Breathing Loop",
    practiceSteps: [
      "Find a comfortable posture, spine aligned like a lightning rod of energy.",
      "Inhale golden cosmic prana for 4 seconds, feeling it rise from your root.",
      "Hold the light at your crown chakra for 4 seconds, visualizing a lotus expanding.",
      "Exhale slowly for 4 seconds, releasing temporal anxieties into primeval space.",
      "Hold your lungs empty for 4 seconds, resting in pure unmanifested consciousness."
    ],
    energyIndicator: "1st Tattva",
    relatedSlugs: ["mindfulness", "divine-energy"],
    audioSrc: "/audio/tattva-01.mp3"
  },
  {
    id: "d2",
    slug: "yoga",
    title: "JAGAD BĪJĀṄKURA",
    subtitle: "Like a Sprout Within a Seed, the Universe Unfolds",
    icon: "Sprout",
    summary: "The universe unfolds from blissful consciousness and appears diverse through māyā.",
    description: "The entire universe emerges from Iswara, whose true nature is pure consciousness and bliss. Before creation, the world existed in an unmanifest state, just as a great tree exists in potential within a tiny seed.",
    quote: "Bījasya-antar-ivāṅkuro jagad-idaṁ prāṅ-nirvikalpaṁ punaḥ...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Bīja-Aṅkura Contemplation",
    practiceSteps: [
      "Visualize a tiny, silent seed resting in the dark soil of pure consciousness.",
      "Observe how the sprout of the universe emerges, expanding into space and time.",
      "Recognize that the diverse world is but a projection of your own inner reality.",
      "Rest in the blissful, undifferentiated state of 'Nirvikalpa'."
    ],
    energyIndicator: "2nd Tattva",
    relatedSlugs: ["meditation", "divine-energy"],
    audioSrc: "/audio/tattva-02.mp3"
  },
  {
    id: "d3",
    slug: "mindfulness",
    title: "SPHURAṆA JYOTI",
    subtitle: "The Light Behind Every Experience",
    icon: "Sun",
    summary: "Liberation arises by realizing the Self and bliss are one.",
    description: "The Self alone is eternal and unchanging. The world appears from it just as waves arise from the ocean—different in appearance, yet never separate from the water itself.",
    quote: "yasyaiva sphuraṇaṁ sadātmakam asat-kalpārthakaṁ bhāsate...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Sphuraṇa Jyoti Contemplation",
    practiceSteps: [
      "Reflect on the core insight: Consciousness is the light through which all experiences become known.",
      "Contemplate the Mahāvākya 'Tat Tvam Asi' (Thou Art That).",
      "Rest with the reflection question: Can any experience be known without awareness?"
    ],
    energyIndicator: "3rd Tattva",
    relatedSlugs: ["meditation", "yoga"],
    audioSrc: "/audio/tattva-03.mp3"
  },
  {
    id: "d4",
    slug: "consciousness-within",
    title: "ANTAR JYOTI",
    subtitle: "Discovering the Silent Power Within",
    icon: "Lightbulb",
    summary: "Consciousness, like light inside a pot, is the hidden force within the body.",
    description: "Imagine a lamp placed inside a pot with many small openings. Though the lamp itself cannot be seen, the light shining through the holes reveals its presence.",
    quote: "The senses shine because consciousness shines.",
    quoteAuthor: "Dakshinamurty Contemplation",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Contemplation of the Inner Light",
    practiceSteps: [
      "Observe the activity of the senses as they engage with the external world.",
      "Reflect upon the silent awareness that illumines every perception and thought.",
      "Rest in the recognition that this inner consciousness is Dakshinamurty within."
    ],
    energyIndicator: "4th Tattva",
    relatedSlugs: ["self-inquiry", "silent-witness"],
    audioSrc: "/audio/tattva-04.mp3"
  },
  {
    id: "d5",
    slug: "v-tattva",
    title: "MĀYĀ ŚAKTI VILĀSA",
    subtitle: "Why the Mind, the Breath, and the Void are Not You",
    icon: "Atom",
    summary: "Suffering arises from falsely identifying the Self with the body and mind.",
    description: "We often identify ourselves with the body, the senses, the mind, or our emotions. According to Vedanta, these are temporary conditions that belong to the body and mind, not to the true Self.",
    quote: "Dehaṁ prāṇamapīndriyāṇyapi calāṁ buddhiṁ ca śūnyaṁ viduḥ...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Identification Detachment",
    practiceSteps: [
      "Observe a physical sensation or emotional wave as it rises.",
      "Silently isolate the witness: strip away the labels 'I am in pain' or 'I am sad'.",
      "Retract your identity fully from the sensor feedback loop into the unchanging observer."
    ],
    energyIndicator: "5th Tattva",
    relatedSlugs: ["sacred-geometry", "cosmic-philosophy"],
    audioSrc: "/audio/tattva-05.mp3"
  },
  {
    id: "d6",
    slug: "susupti-rahasya",
    title: "MĀYĀ ĀVARAṆA VILĀSA",
    subtitle: "The Mystery of Deep Sleep and Awareness",
    icon: "Heart",
    summary: "Deep sleep reveals the blissful Self hidden behind ignorance.",
    description: "In deep sleep, the mind and senses become inactive, yet the Self continues to shine.",
    quote: "Rāhugrasta divākarendu sadṛśo māyā samācchādanāt...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Witnessing Deep Sleep",
    practiceSteps: [
      "Before sleep, contemplate: What remains when the mind falls silent?",
      "Upon waking, reflect on the thought 'I slept well' and investigate who recognized that experience.",
      "Observe awareness as the constant presence that remains through waking, dream, and deep sleep."
    ],
    energyIndicator: "6th Tattva",
    relatedSlugs: ["mindfulness", "ancient-wisdom"],
    audioSrc: "/audio/tattva-06.mp3"
  },
  {
    id: "d7",
    slug: "svatma-prakasha",
    title: "SVĀTMĀ PRAKAṬĪKARAṆA",
    subtitle: "The Self-Revealing Nature of Consciousness",
    icon: "Sun",
    summary: "The unchanging Self remains present through all states of experience.",
    description: "From childhood to old age, our body changes. Our thoughts, emotions, and experiences also come and go.",
    quote: "bālyādiṣvapi jāgradādiṣu tathā sarvāsvavasthāsvapi...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "/tattva_7_chinmudra.webp",
    practiceTitle: "The Chinmudra Revelation",
    practiceSteps: [
      "Observe that your consciousness is self-established and self-revealing.",
      "Investigate the changeless witness that knows your mind now and when you were a child.",
      "Contemplate the Chinmudra as the silent reveal of your non-separateness."
    ],
    energyIndicator: "7th Tattva",
    relatedSlugs: ["meditation", "ancient-wisdom"],
    audioSrc: "/audio/tattva-07.mp3"
  },
  {
    id: "d8",
    slug: "karya-karana-sambandha",
    title: "KĀRYAKĀRAṆA SAMBANDHA",
    subtitle: "The Illusion of Cause, Effect, and Relational Diversity",
    icon: "BookOpen",
    summary: "Through māyā, the one Self appears as many forms and relations.",
    description: "The world is filled with countless relationships—teacher and student, parent and child. Though they appear different, they all arise within the same consciousness.",
    quote: "Viśvaṁ paśyati kāryakāraṇatayā svasvāmisambandhataḥ...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Contemplation of Relational Projection",
    practiceSteps: [
      "Observe relationships in your life and see how one entity takes on multiple reciprocal roles.",
      "Contemplate the nature of cause and effect.",
      "Reflect on the waking and dreaming states."
    ],
    energyIndicator: "8th Tattva",
    relatedSlugs: ["ancient-wisdom", "universal-consciousness"],
    audioSrc: "/audio/tattva-08.mp3"
  },
  {
    id: "d9",
    slug: "bhuta-brahmanda-aikya",
    title: "BHŪTA BRAHMĀṆḌA AIKYA",
    subtitle: "The Body as a Reflection of the Cosmos",
    icon: "Globe",
    summary: "Meditation reveals the body, cosmos, and consciousness as one.",
    description: "Sri Dakshinamurthy teaches that the entire universe can be understood through eight manifestations of Iswara—earth, water, fire, air, space, the sun, the moon, and all living beings.",
    quote: "Bhūrambhāṁsyanalo'nilo'mbaramaharnātho himāṁśuḥ pumān...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Vibrational Shift Affirmation",
    practiceSteps: [
      "Identify a negative or polarizing thought currently disturbing your mental axis.",
      "Find its exact positive polarization (e.g., Fear to Courage).",
      "Focus exclusively on the highest pole."
    ],
    energyIndicator: "9th Tattva",
    relatedSlugs: ["scriptures", "cosmic-philosophy"],
    audioSrc: "/audio/tattva-09.mp3"
  },
  {
    id: "d10",
    slug: "universal-consciousness",
    title: "SARVĀTMATVA SPHUṬĪKARAṆA",
    subtitle: "The State of Being the Self of All",
    icon: "Globe",
    summary: "Realizing all as the Self brings liberation and inherent powers.",
    description: "The Dakshinamurthy Ashtakam is more than a hymn—it is a guide to recognizing the Self. Through listening, reflection, meditation, or even sincere chanting, one gradually discovers the truth.",
    quote: "sarvātmatvamiti sphuṭīkṛtamidaṃ yasmādamuṣmin stavē...",
    quoteAuthor: "Dakṣiṇāmūrti Stotram",
    image: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&q=80&w=1200",
    practiceTitle: "Sarvātmatva Contemplation",
    practiceSteps: [
      "Reflect on the divine bait-and-switch: absolute happiness lies in realizing non-separateness.",
      "Practice the four-fold path: Shravaṇa, Manana, Dhyāna, and Saṅkīrtana.",
      "Rest in the realization of Sarvātmatvam."
    ],
    energyIndicator: "10th Tattva",
    relatedSlugs: ["scriptures", "meditation"],
    audioSrc: "/audio/tattva-10.mp3"
  }
];

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: "a1",
    domainSlug: "meditation",
    title: "The Primordial Guru",
    subtitle: "Why do ancient sages sit before a youthful teacher?",
    content: "Beneath the shade of an ancient banyan tree sits a youthful teacher surrounded by seekers far older than himself. This is Sri Dakshinamurthy, the timeless form of Shiva as the supreme guru. Unlike ordinary teachers, he does not rely on lengthy discourses or debate. Facing the South, a direction traditionally associated with time, change, and mortality, he reveals knowledge through profound silence. For centuries, this image has inspired seekers to look beyond words and discover wisdom through direct understanding.",
    quote: "विश्वं दर्पणदृश्यमाननगरीतुल्यं निजान्तर्गतम्",
    translation: "The entire universe is like a city reflected in a mirror, appearing within oneself.",
    image: "/ArticleImages/dakshinamurthy-a1.webp",
    headerLabel: "BEGIN HERE",
    actionText: "READ CHAPTER",
    hideMeta: true
  },
  {
    id: "a2",
    domainSlug: "science-and-spirituality",
    title: "What is Daakshinaasya Darshini?",
    subtitle: "Enlightenment via Scientific Thought",
    content: "Daakshinaasya Darshini is a science and technology exhibition inspired by Sri Dakshinamurthy, the timeless embodiment of knowledge, wisdom, and learning. Celebrating humanity's enduring quest to understand the universe, the exhibition brings together science, innovation, mathematics, and engineering under a common theme of discovery.\n\nThrough interactive exhibits, working models, and immersive visual experiences, visitors are encouraged to explore the principles that shape our world.",
    image: "/What%20is%20Daakshinaasya/image1.webp",
    images: [
      "/What%20is%20Daakshinaasya/image1.webp",
      "/What%20is%20Daakshinaasya/image3.webp",
      "/What%20is%20Daakshinaasya/image4.webp",
      "/What%20is%20Daakshinaasya/image5.webp",
      "/What%20is%20Daakshinaasya/image6.webp"
    ],
    headerLabel: "SEEK WISDOM",
    actionText: "EXPLORE NOW",
    hideMeta: true
  },
  {
    id: "a3",
    domainSlug: "science-and-spirituality",
    title: "The 3-Day Exhibition",
    subtitle: "Curiosity to Discovery",
    content: "The 3-Day Exhibition was a unique celebration of science, technology, innovation, and the timeless wisdom embodied by Sri Dakshinamurthy. Bringing together 80+ schools, 43+ outstanding projects, and 30,000+ visitors, the event created a vibrant platform for exploration, learning, and discovery.",
    image: "/3dayexhibition/image1.webp",
    images: [
      "/3dayexhibition/image1.webp",
      "/3dayexhibition/image2.webp",
      "/3dayexhibition/image3.webp",
      "/3dayexhibition/image4.webp",
      "/3dayexhibition/image5.webp",
      "/3dayexhibition/image6.webp",
      "/3dayexhibition/image7.webp",
      "/3dayexhibition/image8.webp",
      "/3dayexhibition/image9.webp",
      "/3dayexhibition/image10.webp",
      "/3dayexhibition/image11.webp"
    ],
    headerLabel: "3-DAY MAKEATHON",
    actionText: "EXPLORE NOW",
    hideMeta: true,
    views: 1
  },
  {
    id: "why-are-we-doing-this",
    domainSlug: "science-and-spirituality",
    tag: "WHY DO THIS?",
    title: "WHY ARE WE DOING THIS?",
    subtitle: "Discover how awareness transforms information into wisdom",
    content: "",
    excerpt: "In a world overflowing with information, knowledge alone is no longer enough. How we perceive, interpret, and respond to our experiences often shapes our understanding more than the experiences themselves. The same situation can...",
    buttonText: "Step Inside",
    paragraphs: [
      "In a world overflowing with information, knowledge alone is no longer enough. How we perceive, interpret, and respond to our experiences often shapes our understanding more than the experiences themselves. The same situation can inspire, challenge, or divide people depending on the perspective they bring to it.",
      "Dakshinaasya Darshini was created to explore this fascinating relationship between knowledge, perception, and awareness. Through immersive exhibits, interactive experiences, and thought-provoking demonstrations, visitors are invited to examine not only the world around them but also the way they engage with it.",
      "Inspired by the timeless teachings of Sri Dakshinarnurthy, the exhibition encourages curiosity, critical thinking, and self-reflection—transforming learning into a journey from discovery to understanding, and from understanding to wisdom."
    ],
    image: "/ArticleImages/dakshinamurthy-a4.webp",
    hideMeta: true,
    views: 1
  }
];

export const FALLBACK_TIMELINE: TimelineStep[] = [
  {
    id: "t1",
    order: 0,
    stage: "Theme Announcement",
    title: "THEME ANNOUNCEMENT",
    subtitle: "",
    description: "Every edition of Dakshinaasya Darshini begins with a unique theme that inspires innovation and problem-solving. The official challenge statement and competition categories will be announced here. The announced theme will guide the workshops, judging criteria, and final Makeathon.",
    quote: "",
    quoteAuthor: "20 August",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format",
    milestone: ""
  },
  {
    id: "t2",
    order: 1,
    stage: "Registrations",
    title: "REGISTRATIONS",
    subtitle: "",
    description: "Registrations are open from 20 August to 20 September for interested students. Team size, eligibility criteria, registration process, and participation guidelines are available on the registration portal. Whether participating individually or as a team, this marks the beginning of your innovation journey.",
    quote: "",
    quoteAuthor: "20 August – 20 September",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format",
    milestone: ""
  },
  {
    id: "t3",
    order: 2,
    stage: "Ideathon",
    title: "IDEATHON",
    subtitle: "",
    description: "If the number of registered teams exceeds the available capacity, an Ideathon will be conducted as a preliminary selection round. Teams will present their ideas before a panel of mentors and judges. The most promising solutions will qualify for the Makeathon Finals.",
    quote: "",
    quoteAuthor: "25 – 27 September • Online",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format",
    milestone: ""
  },
  {
    id: "t4",
    order: 3,
    stage: "Expert Workshops",
    title: "EXPERT WORKSHOPS",
    subtitle: "",
    description: "Qualified participants will attend expert-led workshops designed around the officially announced theme. Industry professionals and domain experts will introduce the concepts, tools, technologies, and practical approaches required for the Makeathon. The workshop content will vary depending on the announced challenge.",
    quote: "",
    quoteAuthor: "First Week of October • Dates to be Confirmed",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format",
    milestone: ""
  },
  {
    id: "t5",
    order: 4,
    stage: "Makeathon Finals",
    title: "MAKEATHON FINALS",
    subtitle: "",
    description: "Over three exciting days, shortlisted teams will transform their ideas into working prototypes under the guidance of mentors and experts. Participants will collaborate, experiment, innovate, and present their solutions before the judging panel. The Makeathon is designed to be an immersive learning experience that encourages creativity, teamwork, and real-world problem solving.",
    quote: "",
    quoteAuthor: "7 • 8 • 9 October",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format",
    milestone: ""
  }
];

export const FALLBACK_QUOTES: Quote[] = [
  { id: "q1", text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi", category: "Meditation" },
  { id: "q2", text: "Brahman alone is real. The world is appearance. The individual self is none other than Brahman.", author: "Adi Shankaracharya", category: "Wisdom" },
  { id: "q3", text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", category: "Science" },
  { id: "q4", text: "As above, so below. As within, so without.", author: "Hermes Trismegistus", category: "Geometry" },
  { id: "q5", text: "Be still and know that I am God.", author: "Psalm 46:10", category: "Meditation" },
  { id: "q6", text: "The Atman is the light of all lights.", author: "Brihadaranyaka Upanishad", category: "Wisdom" }
];

/**
 * Custom hook encapsulating all database state fetching from the Express API with resilient static fallbacks.
 */
export function useDatabase(enabled = true) {
  const [domains, setDomains] = useState<DomainContent[]>(FALLBACK_DOMAINS);
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES);
  const [timeline, setTimeline] = useState<TimelineStep[]>(FALLBACK_TIMELINE);
  const [quotes, setQuotes] = useState<Quote[]>(FALLBACK_QUOTES);
  const [comments, setComments] = useState<Comment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats>({
    pageViews: { home: 0, storytelling: 0, domains: 0, flow: 0, admin: 0 },
    totalInteractions: 0,
    totalComments: 0,
    activeSessions: 0,
    usersByRole: { admin: 0, user: 0 },
  });

  const [dailyQuote, setDailyQuote] = useState<Quote | null>(FALLBACK_QUOTES[0]);

  const loadDatabase = useCallback(() => {
    Promise.all([
      fetch("/api/v1/domains").then((r) => r.json()).catch(() => null),
      fetch("/api/v1/articles").then((r) => r.json()).catch(() => null),
      fetch("/api/v1/timeline").then((r) => r.json()).catch(() => null),
      fetch("/api/v1/quotes").then((r) => r.json()).catch(() => null),
      fetch("/api/v1/comments").then((r) => r.json()).catch(() => null),
      fetch("/api/v1/analytics").then((r) => r.json()).catch(() => null),
    ])
      .then(([doms, arts, lines, qts, comms, stats]) => {
        if (Array.isArray(doms) && doms.length > 0) setDomains(doms);
        else setDomains(FALLBACK_DOMAINS);

        if (Array.isArray(arts) && arts.length > 0) setArticles(arts);
        else setArticles(FALLBACK_ARTICLES);

        if (Array.isArray(lines) && lines.length > 0) setTimeline(lines);
        else setTimeline(FALLBACK_TIMELINE);

        if (Array.isArray(qts) && qts.length > 0) {
          setQuotes(qts);
          setDailyQuote(qts[Math.floor(Math.random() * qts.length)]);
        } else {
          setQuotes(FALLBACK_QUOTES);
          setDailyQuote(FALLBACK_QUOTES[0]);
        }
        if (Array.isArray(comms)) setComments(comms);
        if (stats && stats.pageViews) setAnalytics(stats);
      })
      .catch((err) => {
        console.error("Error loading spiritual database:", err);
        setDomains(FALLBACK_DOMAINS);
        setArticles(FALLBACK_ARTICLES);
        setTimeline(FALLBACK_TIMELINE);
        setQuotes(FALLBACK_QUOTES);
      });
  }, []);

  const loadDomains = useCallback(async () => {
    try {
      const data = await fetch("/api/v1/domains").then((r) => r.json());
      if (Array.isArray(data) && data.length > 0) setDomains(data);
      else setDomains(FALLBACK_DOMAINS);
    } catch (err) {
      console.error("Error loading domains:", err);
      setDomains(FALLBACK_DOMAINS);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    try {
      const data = await fetch("/api/v1/articles").then((r) => r.json());
      if (Array.isArray(data) && data.length > 0) setArticles(data);
      else setArticles(FALLBACK_ARTICLES);
    } catch (err) {
      console.error("Error loading articles:", err);
      setArticles(FALLBACK_ARTICLES);
    }
  }, []);

  const loadTimeline = useCallback(async () => {
    try {
      const data = await fetch("/api/v1/timeline").then((r) => r.json());
      if (Array.isArray(data) && data.length > 0) setTimeline(data);
      else setTimeline(FALLBACK_TIMELINE);
    } catch (err) {
      console.error("Error loading timeline:", err);
      setTimeline(FALLBACK_TIMELINE);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    loadDatabase();
  }, [loadDatabase, enabled]);

  return {
    domains,
    articles,
    timeline,
    quotes,
    comments,
    analytics,
    dailyQuote,
    setArticles,
    setAnalytics,
    loadDatabase,
    loadDomains,
    loadArticles,
    loadTimeline,
  };
}

