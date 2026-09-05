import earlyBlight from "@/assets/early-blight.jpg";
import maizeBlight from "@/assets/maize-blight.jpg";
import riceBrownSpot from "@/assets/rice-brownspot.jpg";
import wheatRust from "@/assets/wheat-rust.jpg";

export type CropType = "Tomato" | "Maize" | "Rice" | "Wheat";

export type TreatmentStep = {
  title: string;
  detail: string;
};

export type Disease = {
  id: string;
  name: string;
  crop: CropType;
  pathogen: string;
  image: string;
  severity: "Low" | "Moderate" | "High";
  confidence: number;
  symptoms: string[];
  organic: TreatmentStep[];
  chemical: TreatmentStep[];
  prevention: string[];
};

export const diseases: Disease[] = [
  {
    id: "early-blight",
    name: "Early Blight",
    crop: "Tomato",
    pathogen: "Alternaria solani",
    image: earlyBlight,
    severity: "High",
    confidence: 94,
    symptoms: [
      "Concentric rings",
      "Leaf yellowing",
      "Dark brown lesions",
      "Lower-leaf drop",
    ],
    organic: [
      {
        title: "Remove infected foliage",
        detail:
          "Pick off and burn or bury all spotted leaves early in the morning. Never compost them — spores survive in plant debris.",
      },
      {
        title: "Spray neem oil solution",
        detail:
          "Mix 5 ml neem oil + 2 ml mild soap per litre of water. Spray both leaf surfaces every 7 days, in the evening, for 3 weeks.",
      },
      {
        title: "Apply cow-dung slurry / Trichoderma",
        detail:
          "Drench the soil with Trichoderma viride (5 g per litre) to suppress soil-borne spores around the root zone.",
      },
      {
        title: "Mulch the base",
        detail:
          "Lay 5 cm of dry straw around each plant so rain cannot splash spores from the soil onto lower leaves.",
      },
    ],
    chemical: [
      {
        title: "Protectant spray",
        detail:
          "Mancozeb 75% WP at 2 g per litre of water. Cover the whole canopy at first symptom.",
      },
      {
        title: "Systemic follow-up",
        detail:
          "After 10 days apply Azoxystrobin 23% SC at 1 ml per litre. Do not repeat the same molecule twice in a row.",
      },
      {
        title: "Observe pre-harvest interval",
        detail:
          "Wait at least 7 days after the last spray before harvesting fruit. Wear gloves and a cloth mask while mixing.",
      },
    ],
    prevention: [
      "Rotate tomato with cereals for 2 seasons",
      "Stake plants for airflow",
      "Water at the base, never overhead",
      "Use certified disease-free seed",
    ],
  },
  {
    id: "northern-leaf-blight",
    name: "Northern Leaf Blight",
    crop: "Maize",
    pathogen: "Exserohilum turcicum",
    image: maizeBlight,
    severity: "Moderate",
    confidence: 89,
    symptoms: ["Cigar-shaped lesions", "Grey-green streaks", "Dried leaf tips"],
    organic: [
      {
        title: "Strip lower infected leaves",
        detail:
          "Remove the bottom 2–3 affected leaves to slow spore movement up the plant.",
      },
      {
        title: "Garlic-chilli botanical spray",
        detail:
          "Steep 100 g crushed garlic and 50 g chilli in 1 litre water overnight, dilute 1:10, spray weekly.",
      },
      {
        title: "Deep-plough crop residue",
        detail:
          "Bury stubble after harvest so infected debris decomposes before the next planting.",
      },
    ],
    chemical: [
      {
        title: "Foliar fungicide",
        detail:
          "Propiconazole 25% EC at 1 ml per litre at early lesion stage, repeat once after 15 days.",
      },
      {
        title: "Seed treatment next season",
        detail: "Treat seed with Carbendazim at 2 g per kg before sowing.",
      },
    ],
    prevention: [
      "Plant resistant hybrids",
      "Avoid dense spacing",
      "Rotate with legumes",
    ],
  },
  {
    id: "brown-spot",
    name: "Brown Spot",
    crop: "Rice",
    pathogen: "Bipolaris oryzae",
    image: riceBrownSpot,
    severity: "Moderate",
    confidence: 91,
    symptoms: ["Oval brown lesions", "Grey centres", "Stunted tillers"],
    organic: [
      {
        title: "Correct potassium deficiency",
        detail:
          "Apply wood ash or compost rich in potash — brown spot is worst on nutrient-starved soils.",
      },
      {
        title: "Hot-water seed soak",
        detail:
          "Soak seed at 53–54 °C for 12 minutes before sowing to kill seed-borne spores.",
      },
      {
        title: "Maintain shallow standing water",
        detail:
          "Keep 3–5 cm of water in the field; drought stress sharply increases infection.",
      },
    ],
    chemical: [
      {
        title: "Fungicide spray",
        detail:
          "Hexaconazole 5% EC at 2 ml per litre at booting stage and again at heading.",
      },
    ],
    prevention: [
      "Balanced NPK, do not skip potash",
      "Use clean certified seed",
      "Avoid water stress at tillering",
    ],
  },
  {
    id: "leaf-rust",
    name: "Leaf Rust",
    crop: "Wheat",
    pathogen: "Puccinia triticina",
    image: wheatRust,
    severity: "High",
    confidence: 96,
    symptoms: ["Orange pustules", "Powdery spores", "Leaf drying"],
    organic: [
      {
        title: "Scout and rogue early",
        detail:
          "Walk the field twice weekly; remove isolated rusted plants before pustules burst.",
      },
      {
        title: "Sulphur dust",
        detail:
          "Dust wettable sulphur at 2 g per litre in the cool morning hours to check spread.",
      },
      {
        title: "Reduce nitrogen flush",
        detail:
          "Split nitrogen doses — lush growth from a single heavy dose invites rust.",
      },
    ],
    chemical: [
      {
        title: "Triazole spray",
        detail:
          "Tebuconazole 25% EC at 1 ml per litre at 5% leaf-area infection, repeat after 15 days.",
      },
      {
        title: "Rotate modes of action",
        detail:
          "Alternate with a strobilurin product to prevent resistance building up.",
      },
    ],
    prevention: [
      "Sow rust-resistant varieties",
      "Sow on time — late crops rust more",
      "Destroy volunteer wheat plants",
    ],
  },
];

export const crops: CropType[] = ["Tomato", "Maize", "Rice", "Wheat"];

export type ScanRecord = {
  id: string;
  diseaseId: string;
  diseaseName: string;
  crop: CropType;
  confidence: number;
  image: string;
  when: string;
  mode: "offline" | "cloud";
  synced: boolean;
};

export const initialScans: ScanRecord[] = [
  {
    id: "s-1041",
    diseaseId: "early-blight",
    diseaseName: "Early Blight",
    crop: "Tomato",
    confidence: 94,
    image: earlyBlight,
    when: "Today, 08:12",
    mode: "offline",
    synced: false,
  },
  {
    id: "s-1040",
    diseaseId: "leaf-rust",
    diseaseName: "Leaf Rust",
    crop: "Wheat",
    confidence: 96,
    image: wheatRust,
    when: "Yesterday, 17:44",
    mode: "offline",
    synced: false,
  },
  {
    id: "s-1039",
    diseaseId: "brown-spot",
    diseaseName: "Brown Spot",
    crop: "Rice",
    confidence: 91,
    image: riceBrownSpot,
    when: "2 days ago, 06:55",
    mode: "cloud",
    synced: true,
  },
  {
    id: "s-1038",
    diseaseId: "northern-leaf-blight",
    diseaseName: "Northern Leaf Blight",
    crop: "Maize",
    confidence: 89,
    image: maizeBlight,
    when: "3 days ago, 15:20",
    mode: "cloud",
    synced: true,
  },
];

export type OutbreakReport = {
  village: string;
  distanceKm: number;
  disease: string;
  reports: number;
  intensity: number; // 0-100
};

export const outbreaks: OutbreakReport[] = [
  { village: "Kadapur", distanceKm: 2.4, disease: "Early Blight", reports: 34, intensity: 88 },
  { village: "Bela Ghat", distanceKm: 5.1, disease: "Leaf Rust", reports: 21, intensity: 64 },
  { village: "Sundarpur", distanceKm: 7.8, disease: "Brown Spot", reports: 12, intensity: 41 },
  { village: "Manikgaon", distanceKm: 11.2, disease: "Northern Leaf Blight", reports: 6, intensity: 22 },
];

export const weather = {
  location: "Kadapur Block, Nashik",
  temperatureC: 29,
  humidity: 86,
  rainChance: 70,
  risk: "High fungal risk in the next 48 hours",
  advice:
    "Humidity above 85% with warm nights favours blight and rust. Scout tomato and wheat plots this evening and hold off on overhead irrigation.",
};
