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
      "title": "Ātma Pratibimba",
      "subtitle": "Who Am I? And What Is This World?",
      "icon": "Eye",
      "summary": "The world reflects consciousness, and liberation comes through realizing the Self alone is real.",
      "description": "Imagine putting on a virtual reality headset so immersive that you completely forget you are wearing it. The digital world feels external, independent, and real. Verse 1 suggests that ordinary experience operates in a similar way. The universe appears outside us, separate from who we are, yet every sight, sound, thought, and emotion is known only through consciousness. Just as a city reflected in a mirror seems distinct from the mirror itself, or a dream appears real until awakening, the world appears separate through the power of Māyā. The First Tattva invites us to investigate a profound question: Is consciousness inside the world, or is the world appearing within consciousness? True awakening begins when one recognizes the Self as the unchanging reality behind all experience.",
      "quote": "Viśvaṁ darpaṇa-dṛśyamāna-nagarī-tulyaṁ nijāntargataṁ paśyannātmani māyayā bahirivodbhūtaṁ yathā nidrayā; yaḥ sākṣāt kurute prabodha-samaye svātmānam evādvayaṁ tasmai śrī-gurumūrtaye nama idaṁ śrī-dakṣiṇāmūrtaye.",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Transcendental Breathing Loop",
      "practiceSteps": [
        "Find a comfortable posture, spine aligned like a lightning rod of energy.",
        "Inhale golden cosmic prana for 4 seconds, feeling it rise from your root.",
        "Hold the light at your crown chakra for 4 seconds, visualizing a lotus expanding.",
        "Exhale slowly for 4 seconds, releasing temporal anxieties into primeval space.",
        "Hold your lungs empty for 4 seconds, resting in pure unmanifested consciousness."
      ],
      "energyIndicator": "1st Tattva",
      "relatedSlugs": ["mindfulness", "divine-energy"]
    },
    {
      "id": "d2",
      "slug": "yoga",
      "title": "JAGAD BĪJĀṄKURA",
      "subtitle": "Like a Sprout Within a Seed, the Universe Unfolds",
      "icon": "Sprout",
      "summary": "The universe unfolds from blissful consciousness and appears diverse through māyā.",
      "description": "The whole universe emerged from Dakshinamurty i.e. consciousness, just as a large fig tree emerges from a small seed. Though the tree emerged from the seed, it can not be found in the seed in the variegated form of the tree. One therefore has to admit that the tree was in an unmanifest form in the seed, devoid of any characteristics such as branches, leaves etc.\n\nSimilarly, the world was initially in a state called 'nirvikalpa' or devoid of all characteristics, and was in a form of pure bliss that is not definable by words or thinkable by thought. Then, by the power of maaya, the illusory world of names and forms, and space-time diversity was concocted. This world was created by Dakshinamurty by his own will, similar to how a magician creates illusory objects, or how a great Yogi manifests objects using only the power of his own mind.",
      "quote": "Bījasya-antar-ivāṅkuro jagad-idaṁ prāṅ-nirvikalpaṁ punaḥ māyā-kalpita-deśa-kāla-kalanā-vaicitrya-citrī-kṛtam | māyāvīva vijṛmbhayaty-api mahā-yogīva yaḥ svecchayā tasmai śrī-gurumūrtaye nama idaṁ śrī-dakṣiṇāmūrtaye ||",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Bīja-Aṅkura Contemplation",
      "practiceSteps": [
        "Visualize a tiny, silent seed resting in the dark soil of pure consciousness, containing the potential of a massive, ancient tree.",
        "Observe how the sprout of the universe emerges, expanding into space, time, and varied forms through the power of illusion (Māyā).",
        "Recognize that the diverse world is but a projection of your own inner reality, like a magic show created by a master magician.",
        "Rest in the blissful, undifferentiated state of 'Nirvikalpa' prior to names and forms, identifying with the source rather than the projection."
      ],
      "energyIndicator": "2nd Tattva",
      "relatedSlugs": ["meditation", "divine-energy"]
    },
    {
      "id": "d3",
      "slug": "mindfulness",
      "title": "SPHURAṆA JYOTI",
      "subtitle": "The Light Behind Every Experience",
      "icon": "Sun",
      "summary": "Liberation arises by realizing the Self and bliss are one.",
      "description": "Imagine entering a dark room filled with objects. The moment a lamp is switched on, everything becomes visible—not because the lamp creates the objects, but because it illuminates them. Verse 3 suggests that consciousness functions in the same way. Every thought, emotion, memory, sensation, and perception appears only because it is illuminated by awareness. We spend our lives studying the contents of experience while overlooking the light that makes experience possible. Science can explain how the eyes receive light and how the brain processes information, yet a deeper mystery remains: what is it that knows these perceptions? The Third Tattva invites us to recognize consciousness as the silent illuminator behind every experience. Just as a holographic image depends on an unseen light source, the entire universe of experience depends on awareness, which reveals everything while remaining unchanged itself.",
      "quote": "yasyaiva sphuraṇaṁ sadātmakam asat-kalpārthakaṁ bhāsate sākṣāt tat tvam asīti veda-vacasā yo bodhayaty āśritān | yat-sākṣāt-karaṇād bhaven na punar āvṛttir bhavāmbhonidhau tasmai śrī-gurumūrtaye nama idaṁ śrī-dakṣiṇāmūrtaye ||",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Sphuraṇa Jyoti Contemplation",
      "practiceSteps": [
        "Reflect on the core insight: Consciousness is the light through which all experiences become known. Without awareness, no thought, sensation, or perception could ever arise.",
        "Contemplate the Mahāvākya 'Tat Tvam Asi' (Thou Art That). The light you seek outside is the very awareness by which you seek. The observer and the ultimate reality are not separate.",
        "Investigate the scientific question: Science explains how light enters the eyes and the brain processes information, yet what is it that knows these perceptions? Explore consciousness as the illuminating principle behind all experience.",
        "Rest with the reflection question: Can any experience be known without awareness? Before every thought, perception, or emotion, what is the light that makes it known?"
      ],
      "energyIndicator": "3rd Tattva",
      "relatedSlugs": ["meditation", "yoga"]
    },
    {
      "id": "d4",
      "slug": "consciousness-within",
      "title": "ANTAR JYOTI",
      "subtitle": "Discovering the Silent Power Within",
      "icon": "Lightbulb",
      "summary": "Consciousness, like light inside a pot, is the hidden force within the body that enables all perception and action.",
      "description": "This śloka beautifully compares the human body to a pot with many holes and the Self (Ātman) to a bright lamp burning inside it. Just as the lamp's light emerges through every opening of the pot, the light of pure Consciousness shines through our eyes, ears, nose, tongue, skin, and mind, enabling us to perceive the world. The senses themselves are not conscious; they function only because they are illuminated by the inner Self. When we say, \"I know,\" \"I see,\" or \"I hear,\" it is not the senses but the ever-present Consciousness that makes these experiences possible. Just as the world around the pot becomes visible because of the lamp within, the entire universe is experienced only because of the Self's light. Therefore, Ādi Śaṅkarācārya bows to Lord Śrī Dakṣiṇāmūrti, the Supreme Guru, who reveals this eternal truth that the Self alone is the source of all knowledge and awareness.",
      "quote": "Nānācchidra-ghaṭodara-sthita-mahā-dīpa-prabhā-bhāsvaraṃ jñānaṃ yasya tu cakṣur-ādi-karaṇa-dvārā bahiḥ spandate; jānāmīti tam eva bhāntam anubhāty etat samastaṃ jagat tasmai śrī-gurumūrtaye nama idaṃ śrī-dakṣiṇāmūrtaye.",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Contemplation of the Inner Light",
      "practiceSteps": [
        "Observe the activity of the senses as they engage with the external world.",
        "Reflect upon the silent awareness that illumines every perception and thought.",
        "Rest in the recognition that this inner consciousness is Dakshinamurty within."
      ],
      "energyIndicator": "4th Tattva",
      "relatedSlugs": ["self-inquiry", "silent-witness"]
    },
    {
      "id": "d5",
      "slug": "v-tattva",
      "title": "MĀYĀ ŚAKTI VILĀSA",
      "subtitle": "Why the Mind, the Breath, and the Void are Not You",
      "icon": "Atom",
      "summary": "Suffering arises from falsely identifying the Self with the body and mind, and true knowledge destroys this ignorance.",
      "description": "Put on a robotic exoskeleton long enough, and your brain starts believing the machine is part of you. Strike the robot's hand, and you instinctively flinch. Verse 5 says this is exactly what has happened with your body and mind. Pure consciousness has become so deeply identified with its biological suit that it mistakes the body's pain, the mind's fears, and the senses' limitations for its own. The body gets tired. The mind gets anxious. Thoughts come and go. Yet the awareness observing all of them remains unchanged. Suffering begins when the observer forgets itself and becomes the experience. The Fifth Tattva is the discovery that you are not the suit,you are the one wearing it.",
      "quote": "Dehaṁ prāṇamapīndriyāṇyapi calāṁ buddhiṁ ca śūnyaṁ viduḥ, strībālandhajaḍopamāstvahami-ti bhrāntā bhṛśaṁ vādinaḥ; Māyāśaktivilāsakalpitamahāvyāmohasaṁhāriṇe, tasmai śrīgurumūrtaye nama idaṁ śrīdakṣiṇāmūrtaye.",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "practiceSteps": [
        "Observe a physical sensation or emotional wave as it rises, treating it completely like an external notification on a device.",
        "Silently isolate the witness: strip away the labels 'I am in pain' or 'I am sad' and reframe it as 'The biological vehicle is experiencing this trajectory'.",
        "Retract your identity fully from the sensor feedback loop of the mind-body complex, anchoring back into the unchanging observer."
      ],
      "energyIndicator": "5th Tattva",
      "relatedSlugs": ["sacred-geometry", "cosmic-philosophy"]
    },
    {
      "id": "d6",
      "slug": "susupti-rahasya",
      "title": "MĀYĀ ĀVARAṆA VILĀSA",
      "subtitle": "The Mystery of Deep Sleep and Awareness",
      "icon": "Heart",
      "summary": "Deep sleep reveals the blissful Self hidden behind ignorance.",
      "description": "Every night, reality performs a strange experiment. The world disappears. Your ambitions disappear. Your fears disappear. Even the voice in your head falls silent. Yet when morning arrives, you do not say, 'I ceased to exist.' Instead, you say, 'I slept well.' Verse 6 invites us to investigate this overlooked miracle. If the mind was absent and the senses withdrawn, who knew the peace of sleep? The sages compare this mystery to a solar eclipse. The sun appears hidden, but it has not vanished. In the same way, consciousness seems absent in deep sleep only because it is veiled by māyā. The Sixth Tattva reveals that awareness is not dependent on thought, memory, or perception. It remains silently present through waking, dream, and deep sleep—the unchanging witness behind every experience.",
      "quote": "Rāhugrasta divākarendu sadṛśo māyā samācchādanāt sanmātraḥ karaṇopasaṃharaṇato yo'bhūtsuṣuptaḥ pumān | prāgasvāpsamiti prabodhasamaye yaḥ pratyabhijñāyate tasmai śrī gurumūrtaye nama idaṃ śrī dakṣiṇāmūrtaye",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Witnessing Deep Sleep",
      "practiceSteps": [
        "Before sleep, contemplate: What remains when the mind falls silent?",
        "Upon waking, reflect on the thought 'I slept well' and investigate who recognized that experience.",
        "Observe awareness as the constant presence that remains through waking, dream, and deep sleep."
      ],
      "energyIndicator": "6th Tattva",
      "relatedSlugs": ["mindfulness", "ancient-wisdom"]
    },
    {
      "id": "d7",
      "slug": "svatma-prakasha",
      "title": "SVĀTMĀ PRAKAṬĪKARAṆA",
      "subtitle": "The Self-Revealing Nature of Consciousness",
      "icon": "Sun",
      "summary": "The unchanging Self remains present through all states of experience.",
      "description": "You are Consciousness. There are various states of experience – Waking, dream, deep sleep etc. There are other experiences throughout life from childhood, youth to adulthood. The One who knows your mind now and when you were one month old is the same. Body is not the same, mind is not the same. But the Consciousness by which your one month old experience was known and the Consciousness by which todays experience is known, is exactly the same. In all these states there is something shining within that is always present. This Consciousness which is the real YOU persists through all stages – Pre natal, childhood, youth, adult and in all states of mind – waking, dreaming, deep sleep – how do we come to understand this?",
      "quote": "bālyādiṣvapi jāgradādiṣu tathā sarvāsvavasthāsvapi\nvyāvṛttā svanu vartamāna mahamityantaḥ sphurantaṃ sadā ।\nsvātmānaṃ prakaṭīkarōti bhajatāṃ yō mudrayā bhadrayā\ntasmai śrī gurumūrtayē nama idaṃ śrī dakṣiṇāmūrtayē ॥ 7 ॥",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "/tattva_7_chinmudra.png",
      "practiceTitle": "The Chinmudra Revelation",
      "practiceSteps": [
        "Observe that your consciousness is self-established and self-revealing; your existence is self-evident and not a product of logical thinking.",
        "Investigate the changeless witness that knows your mind now and when you were a child, recognizing that the observing Consciousness remains exactly the same.",
        "Contemplate the Chinmudra (the auspicious hand gesture) as the silent reveal of your non-separateness from the absolute Reality."
      ],
      "energyIndicator": "7th Tattva",
      "relatedSlugs": ["meditation", "ancient-wisdom"]
    },
    {
      "id": "d8",
      "slug": "karya-karana-sambandha",
      "title": "KĀRYAKĀRAṆA SAMBANDHA",
      "subtitle": "The Illusion of Cause, Effect, and Relational Diversity",
      "icon": "BookOpen",
      "summary": "Through māyā, the one Self appears as many forms and relations.",
      "description": "Just as the same person is a father to his son, son to his father, teacher to his student, student to his teacher, servant to his master and master to his servant, and just as the same entity is deemed to be the cause and the effect, the same Self is seen as many and relationships are superimposed due to the illusory power of maaya. This Self who is Dakshinamurty Himself, appears to be the deluded one going through various changes in the states of waking and dreaming. To that Dakshinamurty I offer my namaskara by means of this contemplation.",
      "quote": "Viśvaṁ paśyati kāryakāraṇatayā svasvāmisambandhataḥ śiṣyācāryatayā tathaiva pitṛputrādyātmanā bhedataḥ | svapne jāgṛti vā ya eṣa puruṣo māyāparibhrāmitaḥ tasmai śrīgurumūrtaye nama idaṁ śrīdakṣiṇāmūrtaye ||",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Contemplation of Relational Projection",
      "practiceSteps": [
        "Observe the relationships in your life—parent, child, teacher, student—and see how one entity takes on multiple reciprocal roles depending on context.",
        "Contemplate the nature of cause and effect: trace any physical object back to its cause, and notice that the cause and effect are ultimately the same substance (like clay and pot).",
        "Reflect on the waking and dreaming states, recognizing that the one who experiences both states remains the same, untouched by the shifting states of consciousness."
      ],
      "energyIndicator": "8th Tattva",
      "relatedSlugs": ["ancient-wisdom", "universal-consciousness"]
    },
    {
      "id": "d9",
      "slug": "bhuta-brahmanda-aikya",
      "title": "BHŪTA BRAHMĀṆḌA AIKYA",
      "subtitle": "The Body as a Reflection of the Cosmos",
      "icon": "Globe",
      "summary": "Meditation reveals the body, cosmos, and consciousness as one.",
      "description": "Astronauts looking at Earth from space often describe a profound shift in perception. National borders disappear, and what seemed separate from the ground is revealed as one interconnected system of oceans, mountains, atmosphere, and life. Verse 9 invites a similar transformation of vision. The earth beneath our feet, the water in rivers, the fire of the sun, the air we breathe, and the vastness of space are not merely outside us—they exist within us as the very elements of our body and experience. By contemplating these shared elements in both the cosmos and ourselves, we begin to see that the individual is not isolated from the universe but a living expression of it. The Ninth Tattva reveals that the same consciousness pervades both the body and the cosmos, appearing as many forms while remaining one reality.",
      "quote": "Bhūrambhāṁsyanalo'nilo'mbaramaharnātho himāṁśuḥ pumān, ityābhāti carācarātmakam idaṁ yasyaiva mūrtyaṣṭakam; nānyat kiñcana vidyate vimṛśatāṁ yasmāt parasmād vibhoḥ, tasmai śrīgurumūrtaye nama idaṁ śrīdakṣiṇāmūrtaye.",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Vibrational Shift Affirmation",
      "practiceSteps": [
        "Identify a negative or polarizing thought currently disturbing your mental axis.",
        "Find its exact positive polarization (e.g., Fear to Courage, Anger to Compassion).",
        "Focus exclusively on the highest pole, letting the lower one dissolve naturally."
      ],
      "energyIndicator": "9th Tattva",
      "relatedSlugs": ["scriptures", "cosmic-philosophy"]
    },
    {
      "id": "d10",
      "slug": "universal-consciousness",
      "title": "SARVĀTMATVA SPHUṬĪKARAṆA",
      "subtitle": "The State of Being the Self of All",
      "icon": "Globe",
      "summary": "Realizing all as the Self brings liberation and inherent powers.",
      "description": "This final verse functions as the Phala Śruti (description of the fruits of study). While likely appended to the stotram later—given its structural departure from the preceding nine verses—it holds profound pedagogical value. For seekers struggling with worldly affairs, the promise of the eight-fold occult powers (Ashta Siddhis) acts as a powerful catalyst—a divine 'bait-and-switch.' It meets seekers at the level of worldly aspiration. Yet, as the practice of listening (Shravaṇa), contemplation (Manana), and meditation (Dhyāna) deepens, we recognize that no amount of worldly power can ever bring complete completion. The true fruit of this stotram is not control over the external world, but the realization of Sarvātmatvam—the state of being the Self of all—which reveals the entire universe as your own luminous expansion.",
      "quote": "sarvātmatvamiti sphuṭīkṛtamidaṃ yasmādamuṣmin stavē\ntēnāsva śravaṇāttadartha mananāddhyānāchcha saṅkīrtanāt ।\nsarvātmatva mahāvibhūtisahitaṃ syādīśvaratvaṃ svataḥ\nsiddhyēttatpunaraṣṭdhā pariṇataṃ chaiśvarya-mavyāhatam ॥ 10 ॥",
      "quoteAuthor": "Dakṣiṇāmūrti Stotram",
      "image": "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&q=80&w=1200",
      "practiceTitle": "Sarvātmatva Contemplation",
      "practiceSteps": [
        "Reflect on the 'divine bait-and-switch': recognize that while worldly powers (Aishwarya) attract the mind, absolute happiness lies only in realizing your non-separateness from the whole.",
        "Practice the four-fold path of absorption: listen to the sacred teachings (Shravaṇa), logically contemplate their truth (Manana), meditate on the silent witness (Dhyāna), and express/recite the non-dual reality (Saṅkīrtana).",
        "Rest in the realization of Sarvātmatvam—the state of being the Self of all—where the boundary between the observer and the observed is completely dissolved."
      ],
      "energyIndicator": "10th Tattva",
      "relatedSlugs": ["scriptures", "meditation"]
    }
  ],

  articles: [
    {
      id: "a1", domainSlug: "meditation", title: "The Primordial Guru", subtitle: "Why do ancient sages sit before a youthful teacher?",
      content: "Beneath the shade of an ancient banyan tree sits a youthful teacher surrounded by seekers far older than himself. This is Sri Dakshinamurthy, the timeless form of Shiva as the supreme guru. Unlike ordinary teachers, he does not rely on lengthy discourses or debate. Facing the South, a direction traditionally associated with time, change, and mortality, he reveals knowledge through profound silence. For centuries, this image has inspired seekers to look beyond words and discover wisdom through direct understanding.",
      quote: "विश्वं दर्पणदृश्यमाननगरीतुल्यं निजान्तर्गतम्",
      translation: "The entire universe is like a city reflected in a mirror, appearing within oneself.",
      image: "/ArticleImages/dakshinamurthy-a1.jpg",
      headerLabel: "BEGIN HERE", actionText: "READ CHAPTER", hideMeta: true
    },
    {
      id: "a2", domainSlug: "science-and-spirituality", title: "What is Daakshinaasya Darshini?", subtitle: "Enlightenment via Scientific Thought",
      content: "Daakshinaasya Darshini is a science and technology exhibition inspired by Sri Dakshinamurthy, the timeless embodiment of knowledge, wisdom, and learning. Celebrating humanity's enduring quest to understand the universe, the exhibition brings together science, innovation, mathematics, and engineering under a common theme of discovery.\n\nThrough interactive exhibits, working models, and immersive visual experiences, visitors are encouraged to explore the principles that shape our world. More than a showcase of scientific ideas, Daakshinaasya Darshini invites participants to look beyond facts, ask meaningful questions, and cultivate a deeper appreciation for inquiry and understanding.\n\nRooted in the spirit of exploration that Dakshinamurthy symbolizes, the exhibition serves as a bridge between ancient wisdom and modern knowledge, inspiring minds to seek, discover, and learn.\n\nIt is a journey from curiosity to discovery, from discovery to understanding, and from understanding to wisdom.",
      image: "/ArticleImages/dakshinamurthy-a2.jpg",
      headerLabel: "SEEK WISDOM", actionText: "EXPLORE NOW", hideMeta: true
    },
    {
      id: "a3", domainSlug: "science-and-spirituality", title: "The 3-Day Exhibition", subtitle: "Curiosity to Discovery",
      content: "The 3-Day Exhibition was a unique celebration of science, technology, innovation, and the timeless wisdom embodied by Sri Dakshinamurthy. Bringing together 80+ schools, 43+ outstanding projects, and 30,000+ visitors, the event created a vibrant platform for exploration, learning, and discovery.\n\nThrough interactive exhibits, working models, multimedia experiences, and engaging demonstrations, visitors explored the fascinating intersection of scientific inquiry, creativity, and human understanding.\n\nInspired by the vision of connecting ancient wisdom with modern knowledge, the exhibition encouraged participants to think critically, ask meaningful questions, and experience learning beyond textbooks.\n\nMore than an exhibition, it was a journey that transformed curiosity into discovery, discovery into understanding, and understanding into wisdom.",
      image: "/3dayexhibition/image1.png",
      images: ["/3dayexhibition/image1.png","/3dayexhibition/image2.png","/3dayexhibition/image3.png","/3dayexhibition/image4.png","/3dayexhibition/image5.png","/3dayexhibition/image6.png","/3dayexhibition/image7.png","/3dayexhibition/image8.png","/3dayexhibition/image9.png"],
      headerLabel: "3-DAY MAKEATHON", actionText: "EXPLORE NOW", hideMeta: true
    },
    {
      id: "a4", domainSlug: "science-and-spirituality", title: "Why are we doing this?", subtitle: "Discover how awareness transforms information into wisdom",
      content: "In a world overflowing with information, knowledge alone is no longer enough. How we perceive, interpret, and respond to our experiences often shapes our understanding more than the experiences themselves. The same situation can inspire, challenge, or divide people depending on the perspective they bring to it.\n\nDakshinaasya Darshini was created to explore this fascinating relationship between knowledge, perception, and awareness. Through immersive exhibits, interactive experiences, and thought-provoking demonstrations, visitors are invited to examine not only the world around them but also the way they engage with it.\n\nInspired by the timeless teachings of Sri Dakshinamurthy, the exhibition encourages curiosity, critical thinking, and self-reflection—transforming learning into a journey from discovery to understanding, and from understanding to wisdom.",
      image: "/ArticleImages/dakshinamurthy-a4.jpg",
      actionText: "Step Inside", headerLabel: "WHY DO THIS?", hideMeta: true, views: 1
    },
    {
      id: "a5", domainSlug: "upcoming-events", title: "What's Next?", subtitle: "The journey continues—explore the upcoming Makeathon edition",
      content: "The journey continues. Building on the success of our exhibitions and immersive learning experiences, we are preparing the next edition of our Makeathon—an exciting platform where curiosity, creativity, and innovation come together. Staying true to the spirit of Dakshinaasya Darshini, the upcoming event will continue to explore the intersection of science, technology, and deeper understanding through engaging challenges, collaborative problem-solving, and hands-on experiences.\n\nAs plans evolve, new milestones, announcements, and event updates will be shared through the Timeline section of this website. We invite students, educators, innovators, and curious minds to follow the journey and be part of what comes next.",
      image: "/ArticleImages/dakshinamurthy-a5.jpg",
      actionText: "Explore Now", headerLabel: "UPCOMING EVENT", hideMeta: true
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
