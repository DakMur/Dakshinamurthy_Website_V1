import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSchema } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../data/database.json');

// Default seed data matching the original monolithic server.ts
const DEFAULT_DATABASE: DatabaseSchema = {
  users: [
    {
      id: "u1",
      name: "Sovereign Admin",
      email: "falconace81@gmail.com",
      password: "dakshinaasya2026",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    }
  ],
  domains: [
    {
      "id": "d1",
      "slug": "meditation",
      "title": "Meditation & Dhyana",
      "subtitle": "The silence that speaks louder than words",
      "icon": "Compass",
      "summary": "Explore the depths of meditation through ancient Vedantic practices and modern neuroscience discoveries.",
      "description": "Meditation is the cornerstone of spiritual practice in the Advaita Vedanta tradition. Through disciplined dhyana (meditation), the practitioner learns to quiet the fluctuations of the mind (chitta vritti nirodha) and rest in the pure awareness that is their true nature. Sri Adi Shankaracharya taught that through consistent meditation practice, one can directly experience the non-dual nature of reality — that Brahman (the ultimate reality) and Atman (the individual self) are one and the same.",
      "quote": "The mind is everything. What you think, you become.",
      "quoteAuthor": "Adi Shankaracharya",
      "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Box Breathing Simulator",
      "practiceSteps": [
        "Find a comfortable seated position with spine erect",
        "Close your eyes and take three deep cleansing breaths",
        "Begin the 4-second box pattern: Inhale for 4 counts",
        "Hold the breath gently for 4 counts",
        "Exhale slowly and completely for 4 counts",
        "Hold empty for 4 counts, then repeat the cycle"
      ],
      "energyIndicator": "High Harmonic",
      "relatedSlugs": [
        "sacred-geometry",
        "cosmic-philosophy"
      ]
    },
    {
      "id": "d2",
      "slug": "sacred-geometry",
      "title": "Sacred Geometry",
      "subtitle": "The mathematical language of the cosmos",
      "icon": "Star",
      "summary": "Discover how geometric patterns form the invisible architecture of consciousness and creation.",
      "description": "Sacred Geometry reveals the hidden mathematical order underlying all of creation. From the spiral of galaxies to the structure of DNA, from the petals of a flower to the vibrations of sound — geometric patterns form the invisible architecture of the universe. In the Vedic tradition, these patterns are understood as the visual language through which Brahman manifests the physical world.",
      "quote": "Geometry is the archetype of the beauty of the world.",
      "quoteAuthor": "Johannes Kepler",
      "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Mandala Visualization",
      "practiceSteps": [
        "Sit comfortably and gaze at a geometric mandala pattern",
        "Allow your eyes to soften and your vision to become peripheral",
        "Notice the patterns emerging and dissolving",
        "Feel the geometric harmony resonating within your body"
      ],
      "energyIndicator": "Crystalline Matrix",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d3",
      "slug": "cosmic-philosophy",
      "title": "Cosmic Philosophy",
      "subtitle": "Understanding the fabric of reality itself",
      "icon": "Flame",
      "summary": "Journey through the philosophical frameworks that explain consciousness, reality, and the nature of existence.",
      "description": "Cosmic Philosophy encompasses the grand frameworks of understanding that humanity has developed to explain the nature of reality, consciousness, and existence. At its heart lies the Advaita Vedanta teaching that the universe is not separate from the observer — that the cosmic dance of creation, preservation, and dissolution is happening within the field of pure awareness that is our deepest nature.",
      "quote": "Brahman alone is real, the world is appearance, and the individual self is none other than Brahman.",
      "quoteAuthor": "Adi Shankaracharya",
      "image": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Self-Inquiry Practice",
      "practiceSteps": [
        "Sit quietly and ask yourself: Who am I?",
        "Notice the thoughts that arise without identifying with them",
        "Trace each thought back to its source",
        "Rest in the silent awareness that remains"
      ],
      "energyIndicator": "Transcendent Flux",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d4",
      "slug": "ancient-wisdom",
      "title": "Ancient Wisdom Texts",
      "subtitle": "The eternal scriptures that light the path",
      "icon": "BookOpen",
      "summary": "Study the timeless teachings of the Upanishads, Bhagavad Gita, and Brahma Sutras.",
      "description": "The ancient wisdom texts of India represent humanity's most profound exploration of consciousness and reality. The Prasthanatrayi — the triple canon of Vedanta consisting of the Upanishads, the Bhagavad Gita, and the Brahma Sutras — forms the philosophical foundation upon which Sri Adi Shankaracharya built his revolutionary commentary.",
      "quote": "Tat Tvam Asi — Thou Art That.",
      "quoteAuthor": "Chandogya Upanishad",
      "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Scriptural Contemplation",
      "practiceSteps": [
        "Choose a single verse from the Upanishads",
        "Read it slowly three times, absorbing each word",
        "Close your eyes and contemplate its meaning",
        "Journal any insights that arise from the contemplation"
      ],
      "energyIndicator": "Eternal Resonance",
      "relatedSlugs": [
        "cosmic-philosophy",
        "meditation"
      ]
    },
    {
      "id": "d5",
      "slug": "yoga",
      "title": "Yoga & Union",
      "subtitle": "Path of connection",
      "icon": "Activity",
      "summary": "Explore the profound depths of Yoga & Union and its role in the cosmic journey.",
      "description": "Yoga & Union is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d6",
      "slug": "mindfulness",
      "title": "Mindfulness",
      "subtitle": "Present moment awareness",
      "icon": "Eye",
      "summary": "Explore the profound depths of Mindfulness and its role in the cosmic journey.",
      "description": "Mindfulness is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d7",
      "slug": "spiritual-science",
      "title": "Spiritual Science",
      "subtitle": "Where science meets spirit",
      "icon": "Microscope",
      "summary": "Explore the profound depths of Spiritual Science and its role in the cosmic journey.",
      "description": "Spiritual Science is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d8",
      "slug": "conscious-living",
      "title": "Conscious Living",
      "subtitle": "Living with intention",
      "icon": "Heart",
      "summary": "Explore the profound depths of Conscious Living and its role in the cosmic journey.",
      "description": "Conscious Living is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d9",
      "slug": "divine-energy",
      "title": "Divine Energy",
      "subtitle": "The flow of prana",
      "icon": "Zap",
      "summary": "Explore the profound depths of Divine Energy and its role in the cosmic journey.",
      "description": "Divine Energy is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d10",
      "slug": "sacred-scriptures",
      "title": "Sacred Scriptures",
      "subtitle": "Words of the masters",
      "icon": "Book",
      "summary": "Explore the profound depths of Sacred Scriptures and its role in the cosmic journey.",
      "description": "Sacred Scriptures is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d11",
      "slug": "universal-consciousness",
      "title": "Universal Consciousness",
      "subtitle": "The one mind",
      "icon": "Globe",
      "summary": "Explore the profound depths of Universal Consciousness and its role in the cosmic journey.",
      "description": "Universal Consciousness is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    },
    {
      "id": "d12",
      "slug": "astral-awareness",
      "title": "Astral Awareness",
      "subtitle": "Beyond the physical",
      "icon": "Moon",
      "summary": "Explore the profound depths of Astral Awareness and its role in the cosmic journey.",
      "description": "Astral Awareness is an integral part of the spiritual path. It teaches us to align our physical and energetic bodies with the universal frequencies.",
      "quote": "The journey of a thousand miles begins with a single step.",
      "quoteAuthor": "Lao Tzu",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      "practiceTitle": "Centering Practice",
      "practiceSteps": [
        "Find a quiet place",
        "Focus on your breath",
        "Allow your thoughts to pass like clouds",
        "Return to the present moment"
      ],
      "energyIndicator": "Resonant Field",
      "relatedSlugs": [
        "meditation",
        "ancient-wisdom"
      ]
    }
  ],

  articles: [
    {
      id: "a1", domainSlug: "introduction", title: "Dakshinamurthy Stotram", subtitle: "The Hymn of the South-Facing Teacher",
      content: "The Dakshinamurthy Stotram, composed by Sri Adi Shankaracharya, is one of the most profound philosophical hymns in the entire corpus of Sanskrit literature. It presents the image of Lord Shiva as Dakshinamurthy — the supreme teacher who sits facing south beneath the banyan tree, imparting the highest wisdom through silence.\n\nThe word 'Dakshinamurthy' is rich with meaning: 'Dakshina' means 'south' and also 'grace' or 'competence', while 'Murthy' means 'form' or 'embodiment'. Thus, Dakshinamurthy is the embodiment of grace, the form of supreme competence in teaching.\n\nWhat makes this teaching unique in all of world philosophy is the method: the teacher teaches through silence. The young students (sanakadi rishis) approach the ancient-looking teacher with their doubts, and through the mere power of His silence — His chin-mudra gesture — all doubts are resolved. This is the teaching of Advaita Vedanta in its most pristine form.\n\nThe stotram consists of 10 verses, each revealing a different aspect of how the non-dual reality manifests as the apparently dual world we perceive. Shankaracharya uses stunning metaphors — a mirror, a dream, a magic show, a city reflected in a crystal — to explain how the one consciousness appears as the many.",
      author: "Sri Adi Shankaracharya", readTime: "Sacred Text", image: "/ArticleImages/dakshinamurthy-a1.jpg",
      date: "Timeless", likes: 108, views: 1008,
      quote: "विश्वं दर्पणदृश्यमाननगरीतुल्यं निजान्तर्गतं", translation: "To Him who sees the universe existing within Himself, like a city reflected in a mirror, yet appearing outside through Maya"
    },
    {
      id: "a2", domainSlug: "meditation", title: "The Science of Inner Silence", subtitle: "Where neuroscience meets ancient meditation practice",
      content: "Modern neuroscience is only beginning to understand what the ancient rishis discovered thousands of years ago through direct experience: that the practice of sustained inner silence fundamentally transforms the architecture of the brain and the nature of consciousness itself.\n\nRecent studies using fMRI and EEG technology have revealed that experienced meditators show dramatically different brain patterns compared to non-meditators. The default mode network (DMN) — the brain network responsible for self-referential thinking and mind-wandering — shows reduced activity during meditation, while connectivity between different brain regions increases.\n\nThis correlates precisely with what the Yoga Sutras of Patanjali described as 'chitta vritti nirodha' — the cessation of the fluctuations of the mind. When these fluctuations cease, what remains is pure awareness — the 'drashtuh svarupe avasthanam' or the abiding in the true nature of the seer.",
      author: "Research Director", readTime: "8 min read", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      date: "2026-01-15", likes: 42, views: 156
    },
    {
      id: "a3", domainSlug: "sacred-geometry", title: "The Golden Ratio in Temple Architecture", subtitle: "How ancient builders encoded cosmic proportions in stone",
      content: "The great temples of India are not merely places of worship — they are three-dimensional mandalas, cosmic diagrams rendered in stone that encode the mathematical principles governing the universe itself.\n\nThe Vastu Shastra and Shilpa Shastra — the ancient Indian sciences of architecture and sculpture — prescribe precise mathematical ratios for every aspect of temple construction. These ratios, when analyzed through modern mathematics, reveal a sophisticated understanding of the golden ratio (phi = 1.618), Fibonacci sequences, and fractal geometry.\n\nThe Brihadeeswara Temple in Thanjavur, built by Raja Raja Chola I in 1010 CE, provides a stunning example. Its vimana (tower) rises 216 feet — a number that is 6 cubed (6×6×6), reflecting the cosmic significance of the number 6 in Hindu cosmology. The shadow of the tower never falls on its base, demonstrating an advanced understanding of solar geometry.",
      author: "Architecture Scholar", readTime: "10 min read", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800",
      date: "2026-02-20", likes: 67, views: 203
    },
    {
      id: "a4", domainSlug: "cosmic-philosophy", title: "Maya: The Grand Illusion of Duality", subtitle: "Understanding why the one appears as many",
      content: "Perhaps no concept in Indian philosophy is as misunderstood — and as profoundly revolutionary — as Maya. Often simplistically translated as 'illusion', Maya in Advaita Vedanta refers to something far more nuanced: it is the inexplicable power by which the non-dual Brahman appears as the dual world of name and form.\n\nSri Adi Shankaracharya described Maya as 'anirvachaniya' — literally 'that which cannot be categorized'. Maya is neither real (sat) in the absolute sense, nor unreal (asat) like a square circle. It is a third category — 'mithya' — that which has a dependent, provisional reality.\n\nConsider the classic metaphor: a rope in dim light appears as a snake. The snake is neither absolutely real (it disappears upon investigation) nor absolutely unreal (it produces real fear and real physiological responses). The snake is mithya — it has a practical reality that dissolves upon the dawn of true knowledge.",
      author: "Philosophy Scholar", readTime: "12 min read", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
      date: "2026-03-08", likes: 89, views: 312
    }
  ],
  timeline: [
    {
      id: "t1", order: 1, stage: "Awakening", title: "The First Stirring of Self-Inquiry",
      subtitle: "When the eternal question arises within", description: "Every spiritual journey begins with a moment of awakening — a sudden or gradual realization that there is more to existence than meets the eye. This is the moment when the question 'Who am I?' first arises with genuine intensity.",
      quote: "The unexamined life is not worth living.", quoteAuthor: "Socrates",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format", milestone: "Recognition of the seeking impulse within consciousness"
    },
    {
      id: "t2", order: 2, stage: "Seeking Knowledge", title: "Approaching the Sacred Texts",
      subtitle: "Shravana — the disciplined art of listening", description: "Having recognized the call of the inner self, the seeker turns to the ancient wisdom texts and qualified teachers. In the Vedantic tradition, this is called Shravana — systematic and sustained listening to the teachings of the scriptures under the guidance of a realized master.",
      quote: "Let the wise teach the wise.", quoteAuthor: "Mundaka Upanishad",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format", milestone: "Systematic study of Prasthanatrayi under a qualified Guru"
    },
    {
      id: "t3", order: 3, stage: "Meditation", title: "Establishing the Practice of Dhyana",
      subtitle: "Nididhyasana — deep contemplative meditation", description: "Knowledge gained through study must be internalized through sustained meditation practice. Nididhyasana — the third pillar of Vedantic practice — involves deep, prolonged contemplation on the truths revealed through Shravana and Manana.",
      quote: "Meditation is the dissolution of thoughts in eternal awareness.", quoteAuthor: "Swami Sivananda",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format", milestone: "Established daily meditation practice of 1+ hours"
    },
    {
      id: "t4", order: 4, stage: "Spiritual Practice", title: "Integration of Knowledge and Practice",
      subtitle: "Sadhana — the daily discipline of transformation", description: "True spiritual practice is not confined to the meditation cushion. It extends into every moment of daily life. The practitioner learns to see the non-dual reality in all interactions, all experiences, and all beings.",
      quote: "Practice alone is the means to success.", quoteAuthor: "Hatha Yoga Pradipika",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format", milestone: "Seamless integration of spiritual awareness into daily activities"
    },
    {
      id: "t5", order: 5, stage: "Transformation", title: "The Dissolution of the Ego Boundary",
      subtitle: "Aham Brahmasmi — I am Brahman", description: "Through sustained practice, a profound transformation occurs. The rigid boundary between 'self' and 'other' begins to dissolve. The practitioner directly experiences what the Upanishads declare: 'Aham Brahmasmi' — I am Brahman.",
      quote: "When the mind is silent, the Self shines forth.", quoteAuthor: "Ramana Maharshi",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format", milestone: "Direct experiential glimpse of non-dual awareness (Savikalpa Samadhi)"
    },
    {
      id: "t6", order: 6, stage: "Service", title: "Compassionate Action in the World",
      subtitle: "Seva — selfless service as spiritual expression", description: "True realization naturally expresses itself as compassionate action. The realized being, seeing the Self in all beings, spontaneously acts for the welfare of all without any sense of personal doership.",
      quote: "The hands that serve are holier than the lips that pray.", quoteAuthor: "Sai Baba",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format", milestone: "Establishment of regular selfless service (Nishkama Karma)"
    },
    {
      id: "t7", order: 7, stage: "Enlightenment", title: "Abiding in the Natural State",
      subtitle: "Sahaja Sthiti — the effortless state of being", description: "The culmination of the spiritual journey is not an achievement but a recognition — the recognition that what was being sought was never lost. The seeker discovers that they have always been the Self, that the journey was the Self knowing itself.",
      quote: "Brahma Satyam Jagan Mithya Jivo Brahmaiva Naparah.", quoteAuthor: "Adi Shankaracharya",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format", milestone: "Stable abidance in non-dual awareness (Nirvikalpa Samadhi → Sahaja Samadhi)"
    }
  ],
  comments: [],
  quotes: [
    { id: "q1", text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi", category: "Meditation" },
    { id: "q2", text: "Brahman alone is real. The world is appearance. The individual self is none other than Brahman.", author: "Adi Shankaracharya", category: "Wisdom" },
    { id: "q3", text: "The measure of intelligence is the ability to change.", author: "Albert Einstein", category: "Science" },
    { id: "q4", text: "As above, so below. As within, so without.", author: "Hermes Trismegistus", category: "Geometry" },
    { id: "q5", text: "Be still and know that I am God.", author: "Psalm 46:10", category: "Meditation" },
    { id: "q6", text: "The Atman is the light of all lights.", author: "Brihadaranyaka Upanishad", category: "Wisdom" }
  ],
  analytics: {
    pageViews: { home: 10, storytelling: 10, domains: 10, flow: 10, admin: 10 },
    totalInteractions: 650,
    totalComments: 0,
    activeSessions: 3,
    usersByRole: { admin: 1, user: 2 }
  },
  registrationConfig: {
    phase: 1,
    countdownTarget: "",
    minMembers: 2,
    maxMembers: 4
  },
  teams: [],
  members: []
};

export function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Ensure directory exists
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATABASE, null, 2));
      return DEFAULT_DATABASE;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;

    // Ensure all required fields exist
    let updated = false;
    if (!parsed.users) {
      parsed.users = DEFAULT_DATABASE.users;
      updated = true;
    }
    if (!parsed.teams) {
      parsed.teams = [];
      updated = true;
    }
    if (!parsed.members) {
      parsed.members = [];
      updated = true;
    }
    if (!parsed.comments) {
      parsed.comments = [];
      updated = true;
    }
    if (!parsed.quotes) {
      parsed.quotes = DEFAULT_DATABASE.quotes;
      updated = true;
    }
    if (!parsed.registrationConfig) {
      parsed.registrationConfig = DEFAULT_DATABASE.registrationConfig;
      updated = true;
    }
    if (updated) {
      writeDB(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('[Database] Error reading database, returning defaults:', err);
    return DEFAULT_DATABASE;
  }
}

export function writeDB(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Database] Error writing database:', err);
  }
}
