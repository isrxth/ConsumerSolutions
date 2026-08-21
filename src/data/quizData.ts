export interface QuizQuestion {
  id: number;
  unit: number;
  unitTitle: string;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- UNIT 1 ---
  {
    id: 1,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "What is the core focus of Consumer Solution Designing?",
    options: [
      { key: 'A', text: "Establishing standardized database architectures and server configurations." },
      { key: 'B', text: "Bridging behavioral science, cognitive neuroscience, and technology solution architecting." },
      { key: 'C', text: "Developing traditional physical product logistics and supply chain systems." },
      { key: 'D', text: "Generating mass demographic surveys to segment populations geographically." }
    ],
    correctAnswer: 'B',
    explanation: "As highlighted in Unit 1, this discipline functions as a bridge, moving beyond raw technical coding to understand, model, and architect software and hardware systems that match human cognitive and behavioral cycles."
  },
  {
    id: 2,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "What is Consumer Solution Designing NOT about?",
    options: [
      { key: 'A', text: "Modeling human consumption behavior." },
      { key: 'B', text: "Mapping and building solution spaces to resolve user pains." },
      { key: 'C', text: "Understanding consumer pains that exist inside their minds." },
      { key: 'D', text: "Writing code and making engineering assumptions without understanding the consumer." }
    ],
    correctAnswer: 'D',
    explanation: "The course stresses that solution designing is NOT blindly writing code or assuming user needs. It is a structured process of identifying customer mental pains, modeling consumption, and mapping corresponding solutions."
  },
  {
    id: 3,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "In the PMCS Triangle framework, what does the Consumer (\"Who\") represent?",
    options: [
      { key: 'A', text: "The medium or \"container of signals\" that delivers value." },
      { key: 'B', text: "The developer who writes the software code." },
      { key: 'C', text: "The individual with multifaceted, dynamic psychological and physical pains." },
      { key: 'D', text: "The transactional endpoint of a goods-dominant transaction." }
    ],
    correctAnswer: 'C',
    explanation: "In the PMCS Triangle, the Consumer is the \"Who\" characterized by complex, constantly shifting pains (such as anxiety, friction, or status needs) that trigger the goal-oriented consumption cycle."
  },
  {
    id: 4,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "In the PMCS Triangle framework, how is the Product (\"Through\") defined?",
    options: [
      { key: 'A', text: "The ultimate interactive experience that resolves the customer's pain." },
      { key: 'B', text: "The medium, vessel, or \"container of signals\" through which a solution is delivered." },
      { key: 'C', text: "The financial transaction that exchanges goods for currency." },
      { key: 'D', text: "The demographic group targeted by the business." }
    ],
    correctAnswer: 'B',
    explanation: "In the PMCS Triangle, the Product is the \"Through\"—the vessel (software application or physical item) containing aesthetic and functional attributes that send sensory signals to the consumer."
  },
  {
    id: 5,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "Which of the 7 Dimensions of Solution Thinking focuses primarily on understanding why, what, and how people consume?",
    options: [
      { key: 'A', text: "Abstract-Concrete Existence" },
      { key: 'B', text: "Consumptions" },
      { key: 'C', text: "Multi-Level Interaction" },
      { key: 'D', text: "Realizations" }
    ],
    correctAnswer: 'B',
    explanation: "The \"Consumptions\" dimension of the 7 Dimensions of Solution Thinking focuses on understanding why, what, and how people interact with and consume products to resolve their problems."
  },
  {
    id: 6,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "In the Uber case study, which specific consumer pain is resolved by the visual signal of the real-time moving car icon on the map?",
    options: [
      { key: 'A', text: "The high financial transaction cost of credit card use." },
      { key: 'B', text: "The physical exhaustion of walking to a taxi stand." },
      { key: 'C', text: "Unconscious psychological anxiety of not knowing when a ride will arrive." },
      { key: 'D', text: "The sensory overload caused by busy urban traffic environments." }
    ],
    correctAnswer: 'C',
    explanation: "The product is a GPS ride-tracking app, but the solution (experience) Uber delivers is anxiety-reduction. The moving car icon acts as a strong visual signal that restores the user's feeling of \"being in control\"."
  },
  {
    id: 7,
    unit: 1,
    unitTitle: "Unit 1: Introduction to Consumer Solutions",
    question: "According to cognitive neuroscience references in the course, approximately what percentage of consumer decisions are made unconsciously (System 1 processing)?",
    options: [
      { key: 'A', text: "10%" },
      { key: 'B', text: "50%" },
      { key: 'C', text: "75%" },
      { key: 'D', text: "95%" }
    ],
    correctAnswer: 'D',
    explanation: "Cognitive neuroscience shows that about 95% of consumer decisions are processed unconsciously (System 1), which means products must act as effective sensory and emotional signal generators to satisfy these automatic mechanisms."
  },

  // --- UNIT 2 ---
  {
    id: 8,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "Under Service-Dominant (S-D) Logic, how are physical goods viewed?",
    options: [
      { key: 'A', text: "As the sole repository where value is permanently embedded." },
      { key: 'B', text: "As facilitators of intangible services." },
      { key: 'C', text: "As standardized transactional endpoints." },
      { key: 'D', text: "As proprietary assets owned solely by the firm." }
    ],
    correctAnswer: 'B',
    explanation: "In Service-Dominant (S-D) Logic, physical goods are not the final source of value. Instead, they act as vehicles or facilitators that deliver intangible value, specialized knowledge, and experiential services."
  },
  {
    id: 9,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "Which term represents the actual value realized and felt during consumption and active interaction with a product?",
    options: [
      { key: 'A', text: "Value-in-Exchange" },
      { key: 'B', text: "Value-in-Use" },
      { key: 'C', text: "Expected Value" },
      { key: 'D', text: "Sacrifice Value" }
    ],
    correctAnswer: 'B',
    explanation: "\"Value-in-Use\" represents the actual value realized and felt dynamically during the consumer's active interaction and consumption of the product, as opposed to \"Value-in-Exchange,\" which is the transaction price."
  },
  {
    id: 10,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "Under Service-Dominant (S-D) logic, who creates value and how?",
    options: [
      { key: 'A', text: "It is created solely by the firm during manufacturing." },
      { key: 'B', text: "It is co-created dynamically through active interaction with the consumer." },
      { key: 'C', text: "It is created by the marketing department during advertising." },
      { key: 'D', text: "It is embedded directly in the raw materials of the product." }
    ],
    correctAnswer: 'B',
    explanation: "S-D Logic states that a firm cannot unilaterally embed value. The firm is only an enabler and resource provider; value is dynamically co-created during the consumer's actual usage and engagement."
  },
  {
    id: 11,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "In the value co-creation process, what do consumers typically excel at?",
    options: [
      { key: 'A', text: "Inventing completely brand new technologies from scratch." },
      { key: 'B', text: "Standardizing industrial assembly lines for mass manufacturing." },
      { key: 'C', text: "Developing and customizing existing ideas further rather than inventing from scratch." },
      { key: 'D', text: "Formatting corporate financial reports and legal contracts." }
    ],
    correctAnswer: 'C',
    explanation: "Co-creation research highlights that consumers find it difficult to invent entirely new, abstract systems from nothing. Instead, they excel at building upon, modifying, or customizing existing structures (like Lego Ideas)."
  },
  {
    id: 12,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "Why are consumers often unable to tell developers what they want or need in advance?",
    options: [
      { key: 'A', text: "They do not care about solving their pains." },
      { key: 'B', text: "Value realization is incremental and experience-bound." },
      { key: 'C', text: "Consumers completely lack cognitive decision-making capabilities." },
      { key: 'D', text: "They are only motivated by goods-dominant transactions." }
    ],
    correctAnswer: 'B',
    explanation: "Realizing value occurs in steps—users must experience initial stages of value to form mental schemas that help them realize subsequent levels of value. This is why they often cannot specify future needs in advance."
  },
  {
    id: 13,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "Complete the core marketing philosophy quote: \"What we manage is not the relationship, but the consumer's...\"",
    options: [
      { key: 'A', text: "Bank accounts and transaction sizes." },
      { key: 'B', text: "Technical configurations and codebases." },
      { key: 'C', text: "Expectations and feelings." },
      { key: 'D', text: "Demographic classifications." }
    ],
    correctAnswer: 'C',
    explanation: "In contemporary marketing, organizations manage expectations (cognitive predictions) and feelings (emotional states) rather than merely superficial client relationships."
  },
  {
    id: 14,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "Through platforms like Lego Ideas, Lego acts as a(n) ________, turning physical plastic bricks into an active service ecosystem.",
    options: [
      { key: 'A', text: "Proprietary value-creator" },
      { key: 'B', text: "Enabler and resource provider" },
      { key: 'C', text: "Transactional middleman" },
      { key: 'D', text: "Traditional G-D manufacturer" }
    ],
    correctAnswer: 'B',
    explanation: "Under S-D Logic, Lego provides the online platform and brick ecosystems, acting as an enabler and resource provider while consumers actively co-create their own play experiences."
  },
  {
    id: 15,
    unit: 2,
    unitTitle: "Unit 2: Philosophy of Marketing & Co-Creation",
    question: "In cognitive neuroscience, if a software application crashes or fails to deliver on expectations, it triggers a:",
    options: [
      { key: 'A', text: "Dopamine spike" },
      { key: 'B', text: "Negative prediction error" },
      { key: 'C', text: "State of homeostasis" },
      { key: 'D', text: "Positive affect state" }
    ],
    correctAnswer: 'B',
    explanation: "The brain is a prediction engine. When a system falls short of expectation (e.g., crashes), it registers a negative prediction error, triggering cortisol release and causing a spike in psychic pain (sacrifice)."
  },

  // --- UNIT 3 ---
  {
    id: 16,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "What is defined as the \"hypothetical point of perfect cognitive balance and comfort in a consumer's mind\"?",
    options: [
      { key: 'A', text: "Psychological Equilibrium" },
      { key: 'B', text: "Satisfaction" },
      { key: 'C', text: "Dissonance Reduction" },
      { key: 'D', text: "Value-in-Use" }
    ],
    correctAnswer: 'A',
    explanation: "Psychological equilibrium represents perfect cognitive balance and comfort. Deviations from this baseline trigger the sensation of deprivation, driving the goal-oriented consumption cycle."
  },
  {
    id: 17,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "How is Value defined under consumption psychology?",
    options: [
      { key: 'A', text: "The absolute monetary price on the physical container." },
      { key: 'B', text: "The reduction in mental tension achieved by addressing a deprivation." },
      { key: 'C', text: "The demographic profile of a targeted consumer segment." },
      { key: 'D', text: "The technical complexity of a system's feature set." }
    ],
    correctAnswer: 'B',
    explanation: "In consumption psychology, value is not a pricing attribute; it is the measurable relief and reduction of mental or psychic tension felt when a deprivation is resolved."
  },
  {
    id: 18,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "In the S-O-R (Stimulus-Organism-Response) Model, what does the Organism (O) represent?",
    options: [
      { key: 'A', text: "The physical product vessel and its raw components." },
      { key: 'B', text: "The external sensory stimuli like sound, taste, or colors." },
      { key: 'C', text: "The internal consumer state, comprising psychological conditions, schemas, and emotions." },
      { key: 'D', text: "The immediate behavioral action to purchase." }
    ],
    correctAnswer: 'C',
    explanation: "In the Stimulus-Organism-Response (S-O-R) framework, the Organism (O) is the active internal mental state of the consumer that receives and processes sensory inputs (Stimuli) to produce reactions (Response)."
  },
  {
    id: 19,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "Which of the following is NOT one of the three core subconscious drivers in the Tri-Core of Consumption?",
    options: [
      { key: 'A', text: "Self-Worth" },
      { key: 'B', text: "Being in Control" },
      { key: 'C', text: "Dissonance Reduction" },
      { key: 'D', text: "Pure Financial Maximization" }
    ],
    correctAnswer: 'D',
    explanation: "The Tri-Core of Consumption comprises: 1) Self-Worth (desire for prestige), 2) Being in Control (predictability and safety), and 3) Dissonance Reduction (resolving internal conflict). Financial maximization is not a core subconscious psychological driver."
  },
  {
    id: 20,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "Under the dynamic perspective of modern marketing, what is a Market?",
    options: [
      { key: 'A', text: "A geographic retail location or zip code." },
      { key: 'B', text: "A static demographic box based on age and income." },
      { key: 'C', text: "A collection of similar cognitive and emotional states." },
      { key: 'D', text: "A set of competitive pricing matrices." }
    ],
    correctAnswer: 'C',
    explanation: "Modern consumption psychology redefines \"markets\" as internal psychological states. A market is constructed in the mind when a specific cognitive and emotional tension is activated."
  },
  {
    id: 21,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "What does the concept of the consumer acting as a \"Docker\" container imply?",
    options: [
      { key: 'A', text: "A single human can host multiple different cognitive markets dynamically." },
      { key: 'B', text: "Consumers are permanently locked into one single market state." },
      { key: 'C', text: "Brand loyalty is static and predictable over time." },
      { key: 'D', text: "Consumers make purely rational choices during goods-dominant exchanges." }
    ],
    correctAnswer: 'A',
    explanation: "The \"Docker\" container analogy illustrates how a single physical consumer dynamically hosts distinct cognitive market states throughout the day (e.g., productivity mode at work vs. relaxation mode at home)."
  },
  {
    id: 22,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "What does the \"Pizza Bite Principle\" illustrate about consumer markets?",
    options: [
      { key: 'A', text: "Pizza is consumed only during physiological hunger." },
      { key: 'B', text: "Past purchases are the strongest guarantee of future brand loyalty." },
      { key: 'C', text: "Markets are dynamically constructed and deconstructed with every single consumption cycle." },
      { key: 'D', text: "Consumers always seek to maximize utilitarian value over other types." }
    ],
    correctAnswer: 'C',
    explanation: "The \"Pizza Bite Principle\" shows that every bite is a micro-consumption cycle. Once satiated, the cognitive market deconstructs instantly, demonstrating why past consumer loyalty is volatile and never fully guaranteed."
  },
  {
    id: 23,
    unit: 3,
    unitTitle: "Unit 3: Market & Consumption Psychology",
    question: "Within the Tri-Core of Consumption, what does the drive for Dissonance Reduction represent?",
    options: [
      { key: 'A', text: "The conscious effort to minimize the financial and monetary costs of a transaction." },
      { key: 'B', text: "The subconscious drive to resolve internal conflicts, anxieties, or contradictory cognitions." },
      { key: 'C', text: "The physical need to maintain muscular and biological homeostasis through diet." },
      { key: 'D', text: "The social desire to display personal prestige, wealth, and status to others." }
    ],
    correctAnswer: 'B',
    explanation: "Dissonance Reduction is one of the three components of the Tri-Core of Consumption (alongside Self-Worth and Being in Control). It represents the psychological drive to resolve inner tensions, doubts, and conflicting thoughts (cognitive dissonance) to restore a state of mental balance and psychological equilibrium."
  },

  // --- UNIT 4 ---
  {
    id: 24,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "A physical or aesthetic characteristic of a product's form that acts as a signal source for sensory receptors is a(n):",
    options: [
      { key: 'A', text: "Attribute" },
      { key: 'B', text: "Value Element" },
      { key: 'C', text: "Enabler" },
      { key: 'D', text: "Predictor" }
    ],
    correctAnswer: 'A',
    explanation: "An attribute is a concrete physical or aesthetic element of a product's form (e.g., color, tactile feel, sound) that acts as a signal generator targeting the consumer's sensory receptors."
  },
  {
    id: 25,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "In the Value Hierarchy Framework, which layer represents extra configurations that exceed baseline expectations?",
    options: [
      { key: 'A', text: "Core Benefit" },
      { key: 'B', text: "Expected Product" },
      { key: 'C', text: "Augmented Product" },
      { key: 'D', text: "Potential Product" }
    ],
    correctAnswer: 'C',
    explanation: "The Augmented Product represents extra configurations, services, or features (like free premium support or additional storage) that exceed baseline expectations to delight the consumer."
  },
  {
    id: 26,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "Which of the following is an Enabler in the Associated Value Profile (AVP) of a Rolex Watch?",
    options: [
      { key: 'A', text: "Status signaling and luxury prestige." },
      { key: 'B', text: "Flawless, accurate mechanical timekeeping." },
      { key: 'C', text: "Solid 18k gold casing." },
      { key: 'D', text: "Limited production and exclusivity." }
    ],
    correctAnswer: 'B',
    explanation: "Enablers are the baseline functional requirements needed to simply enter the consideration set. For a luxury watch, keeping accurate time is a given—it is an enabler, not what drives the final luxury purchase."
  },
  {
    id: 27,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "What category of AVP is responsible for converting a consumer from \"considering\" a product to actually \"buying\" it?",
    options: [
      { key: 'A', text: "Enablers" },
      { key: 'B', text: "Differentiators" },
      { key: 'C', text: "Augmenters" },
      { key: 'D', text: "Attributes" }
    ],
    correctAnswer: 'B',
    explanation: "While enablers get a product considered, Differentiators are the specific high-impact values (like social prestige or unique capabilities) that convert consideration into an active purchase."
  },
  {
    id: 28,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "Under the Value Stack, the pleasant tactile click of a high-end mechanical keyboard represents which category of value?",
    options: [
      { key: 'A', text: "Utilitarian (Instrumental)" },
      { key: 'B', text: "Hedonic" },
      { key: 'C', text: "Symbolic (Psychological)" },
      { key: 'D', text: "Social" }
    ],
    correctAnswer: 'B',
    explanation: "Hedonic value concerns sensory emotions, immediate pleasure, and feelings. The satisfying tactile \"click\" of a keycap targets sensory touch and sound, creating immediate aesthetic pleasure."
  },
  {
    id: 29,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "What are the four components of Sacrifice Value (Cost) that designers must minimize?",
    options: [
      { key: 'A', text: "Monetary, Energy, Psychic, and Time costs." },
      { key: 'B', text: "Material, Software, Hardware, and Marketing costs." },
      { key: 'C', text: "Transactional, Production, Distribution, and Logistics costs." },
      { key: 'D', text: "Logical, Emotional, Cognitive, and Relational costs." }
    ],
    correctAnswer: 'A',
    explanation: "Under the Value Stack framework, Sacrifice Value (total cost) is minimized across four key categories: Monetary expense, physical Energy, Psychic anxiety/risk, and Time spent acquiring or learning the system."
  },
  {
    id: 30,
    unit: 4,
    unitTitle: "Unit 4: Solution Composition & AVP",
    question: "According to the MSE Framework introduced in Unit 4, what three integrated components must a solution developer coordinate to deliver a successful product?",
    options: [
      { key: 'A', text: "Monetary, Software, and Engineering." },
      { key: 'B', text: "Market, Solution, and Experience." },
      { key: 'C', text: "Maintenance, Specifications, and Execution." },
      { key: 'D', text: "Management, Strategy, and Evaluation." }
    ],
    correctAnswer: 'B',
    explanation: "The MSE Framework stands for Market (target cognitive and emotional states), Solution (functional configuration and technology), and Experience (resulting emotional affect state). A successful solution design must coordinate all three components to deliver a unified, pain-relieving experience."
  }
];
