export type PlantCategory = "tropical" | "succulent" | "aromatic" | "floral" | "tree";
export type PlantDifficulty = "easy" | "intermediate" | "expert";

export interface EncyclopediaPlant {
  id: string;
  name: string;
  latinName: string;
  family: string;
  origin: string;
  category: PlantCategory;
  difficulty: PlantDifficulty;
  emoji: string;
  description: string;
  humidity: number;    // 0-100
  light: number;       // 0-100
  wateringsPerMonth: number; // 0-10
  care: {
    watering: string;
    light: string;
    humidity: string;
    temperature: string;
    soil: string;
    fertilizer: string;
    repotting: string;
  };
  didYouKnow: string[];
  commonProblems: { problem: string; solution: string }[];
}

export const encyclopediaPlants: EncyclopediaPlant[] = [
  {
    id: "enc-1",
    name: "Monstera Deliciosa",
    latinName: "Monstera deliciosa",
    family: "Araceae",
    origin: "Central America",
    category: "tropical",
    difficulty: "easy",
    emoji: "🌿",
    description: "The Swiss Cheese Plant is one of the most iconic tropical houseplants. Its large split and perforated leaves give it a sculptural, architectural quality that transforms any interior space.",
    humidity: 75,
    light: 65,
    wateringsPerMonth: 4,
    care: {
      watering: "Once per week",
      light: "Bright indirect light",
      humidity: "High (>60%)",
      temperature: "18–27°C",
      soil: "Rich well-draining mix",
      fertilizer: "Monthly in spring–summer",
      repotting: "Every 2 years",
    },
    didYouKnow: [
      "The natural perforations in the leaves are called 'fenestrations' and help the plant withstand tropical winds.",
      "In ideal conditions outdoors, Monstera can grow leaves up to 90cm wide.",
      "The name 'deliciosa' refers to its edible fruit which tastes like a mix of banana and pineapple.",
    ],
    commonProblems: [
      { problem: "Yellow leaves", solution: "Usually overwatering. Let soil dry out between waterings and ensure good drainage." },
      { problem: "Brown leaf tips", solution: "Low humidity. Mist regularly or place a humidifier nearby." },
      { problem: "No new leaves", solution: "Insufficient light. Move closer to a window with bright indirect light." },
    ],
  },
  {
    id: "enc-2",
    name: "Aloe Vera",
    latinName: "Aloe barbadensis miller",
    family: "Asphodelaceae",
    origin: "Arabian Peninsula",
    category: "succulent",
    difficulty: "easy",
    emoji: "🌵",
    description: "Aloe Vera is one of the world's most useful plants, combining striking geometric beauty with powerful medicinal properties. Its thick gel-filled leaves have been used for thousands of years to soothe burns and skin conditions.",
    humidity: 30,
    light: 85,
    wateringsPerMonth: 2,
    care: {
      watering: "Every 2–3 weeks",
      light: "Full sun to bright indirect",
      humidity: "Low (20–40%)",
      temperature: "13–27°C",
      soil: "Cactus/succulent mix",
      fertilizer: "Twice per year in spring",
      repotting: "Every 2–3 years",
    },
    didYouKnow: [
      "Aloe Vera was called the 'plant of immortality' by ancient Egyptians and was buried with pharaohs.",
      "A single Aloe leaf contains over 75 active compounds including vitamins, minerals, and enzymes.",
      "The plant produces a yellow latex just under the skin which is different from the clear inner gel.",
    ],
    commonProblems: [
      { problem: "Mushy brown leaves", solution: "Root rot from overwatering. Remove damaged roots and repot in dry soil." },
      { problem: "Pale or bleached leaves", solution: "Too much direct harsh sun. Provide filtered bright light instead." },
      { problem: "Thin wrinkled leaves", solution: "Underwatering. Give a deep soak and ensure water drains fully." },
    ],
  },
  {
    id: "enc-3",
    name: "Fiddle Leaf Fig",
    latinName: "Ficus lyrata",
    family: "Moraceae",
    origin: "West Africa",
    category: "tropical",
    difficulty: "intermediate",
    emoji: "🌳",
    description: "The Fiddle Leaf Fig has become the defining houseplant of contemporary interior design. Its large violin-shaped glossy leaves make a bold vertical statement, growing into a dramatic indoor tree with proper care.",
    humidity: 55,
    light: 80,
    wateringsPerMonth: 4,
    care: {
      watering: "Once per week",
      light: "Bright indirect light",
      humidity: "Medium (40–60%)",
      temperature: "15–24°C",
      soil: "Well-aerated universal mix",
      fertilizer: "Monthly March–September",
      repotting: "Every 2 years",
    },
    didYouKnow: [
      "The Fiddle Leaf Fig can live over 50 years indoors with proper care.",
      "In its native West African habitat, it grows as an epiphyte — starting life on another tree.",
      "It communicates stress by dropping leaves when moved to a new location — always rotate, never relocate.",
    ],
    commonProblems: [
      { problem: "Brown spots on leaves", solution: "Usually root rot or bacterial infection. Improve drainage and avoid overwatering." },
      { problem: "Leaf drop", solution: "Environmental stress from moving or drafts. Keep in stable conditions and avoid cold air." },
      { problem: "Dusty leaves", solution: "Wipe leaves with damp cloth monthly to keep them photosynthesizing efficiently." },
    ],
  },
  {
    id: "enc-4",
    name: "Sweet Basil",
    latinName: "Ocimum basilicum",
    family: "Lamiaceae",
    origin: "South Asia",
    category: "aromatic",
    difficulty: "intermediate",
    emoji: "🌱",
    description: "Sweet Basil is the most popular culinary herb in the Mediterranean world. Its tender bright-green leaves release an intoxicating aroma of anise and cloves. Perfect for fresh cooking and hydroponic cultivation.",
    humidity: 55,
    light: 90,
    wateringsPerMonth: 8,
    care: {
      watering: "Daily in summer",
      light: "Full sun (5–6h min)",
      humidity: "Medium (50–60%)",
      temperature: "18–30°C (frost sensitive below 10°C)",
      soil: "Rich moist soil",
      fertilizer: "Weekly during growth",
      repotting: "Annual (annual plant)",
    },
    didYouKnow: [
      "The word 'basil' comes from the Greek 'basilikon' meaning 'royal plant' — it was considered a royal herb.",
      "Basil has over 60 documented varieties, from lemon basil to Thai basil to purple basil.",
      "Pinching off flower buds extends the harvest season and keeps leaves more flavorful.",
    ],
    commonProblems: [
      { problem: "Wilting leaves", solution: "Usually underwatering or root-bound. Water deeply and consider upsizing the pot." },
      { problem: "Black/brown leaf edges", solution: "Cold damage or overwatering. Keep above 15°C and improve drainage." },
      { problem: "Leggy growth", solution: "Insufficient light. Provide at least 6 hours of direct sun or use a grow light." },
    ],
  },
  {
    id: "enc-5",
    name: "True Lavender",
    latinName: "Lavandula angustifolia",
    family: "Lamiaceae",
    origin: "Mediterranean Basin",
    category: "aromatic",
    difficulty: "easy",
    emoji: "💜",
    description: "True Lavender is the most beloved aromatic plant in the world. Its silvery-grey foliage and purple flower spikes produce an incomparable calming fragrance. A symbol of Provençal elegance and Mediterranean living.",
    humidity: 35,
    light: 90,
    wateringsPerMonth: 3,
    care: {
      watering: "Every 10 days",
      light: "Full direct sun (6h+)",
      humidity: "Low (30–40%)",
      temperature: "10–30°C",
      soil: "Sandy well-draining alkaline",
      fertilizer: "Twice per year",
      repotting: "Every 2–3 years",
    },
    didYouKnow: [
      "Lavender has been used for over 2,500 years — Romans added it to their bath water, giving the name from Latin 'lavare' (to wash).",
      "A single lavender plant can produce over 1,000 tiny flowers on one stem.",
      "Lavender oil is one of the few essential oils considered safe to apply directly to skin without dilution.",
    ],
    commonProblems: [
      { problem: "Woody leggy plant", solution: "Prune back by one-third after flowering each year to encourage bushy growth." },
      { problem: "Root rot", solution: "Lavender hates wet feet. Ensure excellent drainage and reduce watering frequency." },
      { problem: "No flowers", solution: "Needs full sun. Move to a sunnier location and reduce nitrogen fertilizer." },
    ],
  },
  {
    id: "enc-6",
    name: "Echeveria",
    latinName: "Echeveria elegans",
    family: "Crassulaceae",
    origin: "Mexico",
    category: "succulent",
    difficulty: "easy",
    emoji: "🌸",
    description: "Echeveria is the jewel of the succulent world. Its perfect geometric rosette of fleshy leaves arranged in fractal spirals creates a living sculpture. Available in hundreds of color forms from silver to deep purple-red.",
    humidity: 25,
    light: 80,
    wateringsPerMonth: 2,
    care: {
      watering: "Every 2 weeks",
      light: "Bright direct light",
      humidity: "Very low (<30%)",
      temperature: "10–32°C",
      soil: "Gritty cactus mix",
      fertilizer: "Twice per year in spring",
      repotting: "Every 2 years or when rootbound",
    },
    didYouKnow: [
      "Echeveria is named after Atanasio Echeverría, an 18th-century Mexican botanical artist.",
      "The powdery coating on Echeveria leaves called 'farina' is a natural sunscreen — avoid touching it.",
      "Echeveria leaves can be propagated into new plants by laying them flat on soil — each leaf becomes a rosette.",
    ],
    commonProblems: [
      { problem: "Stretched elongated leaves (etiolation)", solution: "Needs more light. Move to brightest spot or use a grow light." },
      { problem: "Mushy center", solution: "Overwatering or crown rot. Remove damaged parts and water only when fully dry." },
      { problem: "Leaf drop", solution: "Normal for lower leaves. If upper leaves drop, check for pests or overwatering." },
    ],
  },
  {
    id: "enc-7",
    name: "Phalaenopsis Orchid",
    latinName: "Phalaenopsis amabilis",
    family: "Orchidaceae",
    origin: "Southeast Asia",
    category: "floral",
    difficulty: "intermediate",
    emoji: "🌺",
    description: "The Moth Orchid is the most elegant of all houseplants. Its arching sprays of large butterfly-like flowers can last for 3–6 months, and with proper care the plant will rebloom year after year in a stunning display.",
    humidity: 65,
    light: 55,
    wateringsPerMonth: 4,
    care: {
      watering: "Once per week (soak method)",
      light: "Bright indirect only",
      humidity: "Medium-high (50–70%)",
      temperature: "18–28°C",
      soil: "Bark-based orchid mix",
      fertilizer: "Every 2 weeks when growing",
      repotting: "Every 2 years when roots overflow",
    },
    didYouKnow: [
      "Phalaenopsis orchids have no dormant period — they can bloom multiple times per year with proper care.",
      "The name 'Phalaenopsis' means 'moth-like' in Greek, describing the appearance of the flowers in flight.",
      "Orchids absorb water and nutrients through their aerial roots, which turn green when they absorb moisture.",
    ],
    commonProblems: [
      { problem: "Yellow leaves", solution: "Too much direct sun. Move to a bright spot with no direct rays." },
      { problem: "No reblooming", solution: "Needs a 2-week cool night period (15–16°C) to trigger a new flower spike." },
      { problem: "Wrinkled leaves", solution: "Underwatering or root problems. Check roots and water more frequently." },
    ],
  },
  {
    id: "enc-8",
    name: "Olive Tree",
    latinName: "Olea europaea",
    family: "Oleaceae",
    origin: "Mediterranean Basin",
    category: "tree",
    difficulty: "expert",
    emoji: "🫒",
    description: "The Olive Tree is a living symbol of Mediterranean civilization, peace, and longevity. With twisted silver-green foliage and the ability to live for thousands of years, it brings timeless character to any space or garden.",
    humidity: 30,
    light: 95,
    wateringsPerMonth: 3,
    care: {
      watering: "Every 10–14 days",
      light: "Full sun (8h+)",
      humidity: "Low (20–35%)",
      temperature: "10–38°C (survives brief frost)",
      soil: "Sandy loamy well-draining",
      fertilizer: "Twice per year with low nitrogen",
      repotting: "Every 3–5 years",
    },
    didYouKnow: [
      "Some olive trees in the Mediterranean are over 3,000 years old and still produce fruit.",
      "The olive branch has been a symbol of peace since ancient Greece — Zeus planted one on the Acropolis.",
      "An olive tree begins to produce fruit after 3–5 years, and production improves for centuries.",
    ],
    commonProblems: [
      { problem: "Leaf drop indoors", solution: "Insufficient light. Olive trees need 8+ hours of direct sun — best kept outdoors or in a very bright conservatory." },
      { problem: "No fruiting", solution: "Needs a cold winter period below 10°C for 2 months to initiate flowering." },
      { problem: "Scale insects", solution: "Wipe leaves with neem oil solution. Prune heavily infested branches." },
    ],
  },
];

export const categoryColors: Record<PlantCategory, string> = {
  tropical: "#16a34a",
  succulent: "#d97706",
  aromatic: "#7c3aed",
  floral: "#db2777",
  tree: "#b45309",
};

export const difficultyColors: Record<PlantDifficulty, string> = {
  easy: "#16a34a",
  intermediate: "#d97706",
  expert: "#dc2626",
};
