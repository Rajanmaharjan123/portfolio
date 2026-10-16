/* ------------------------------------------------------------------
   All site copy lives here. Edit freely — components read from this.
------------------------------------------------------------------- */

export const profile = {
  name: "Rajan Maharjan",
  handle: "RAJAN_M",
  role: "Senior iOS Developer",
  headline: "I build iOS apps that see in 3D, move in real time and ship to the App Store.",
  location: "Kathmandu, Nepal",
  timezone: "UTC+05:45",
  email: "rajanmaharjan123@gmail.com",
  phone: "+977-9860124285",
  linkedin: "https://www.linkedin.com/in/rajan1122/",
  cv: "/Rajan-Maharjan-CV.pdf",
  summary:
    "5+ years designing, building and shipping apps for Apple platforms — ride-sharing, fintech SDKs, LiDAR room scanners, 3D object capture and games. I take apps from idea (or legacy mess) to clean, fast, well-rated products.",
  level: 6,
  className: "Mobile Architect",
};

/* Headline numbers clients scan first */
export const impact = [
  { value: "5+", label: "Years shipping iOS" },
  { value: "25+", label: "Apps & SDKs delivered" },
  { value: "+0.9★", label: "Rating lift after rebuild" },
  { value: "4", label: "AR / LiDAR / 3D apps" },
];

/* ---------------- Services (what a client can hire for) ---------------- */
export type ServiceIcon = "phone" | "ar" | "sdk" | "rescue" | "cross" | "chip";
export type Service = { title: string; blurb: string; tags: string[]; icon: ServiceIcon };

export const services: Service[] = [
  {
    icon: "phone",
    title: "Native iOS apps",
    blurb: "Production apps in Swift, SwiftUI and UIKit — from first screen to App Store release.",
    tags: ["Swift", "SwiftUI", "UIKit", "App Store"],
  },
  {
    icon: "ar",
    title: "AR, LiDAR & 3D",
    blurb: "Room scanning, floor plans, measured layouts and photogrammetry object capture.",
    tags: ["ARKit", "RoomPlan", "RealityKit", "USDZ"],
  },
  {
    icon: "rescue",
    title: "App revamp & rescue",
    blurb: "Untangle legacy code into a modular architecture; fix crashes, leaks and battery drain.",
    tags: ["MVVM", "Instruments", "Refactoring"],
  },
  {
    icon: "sdk",
    title: "SDKs & frameworks",
    blurb: "Reusable iOS SDKs packaged as XCFrameworks for banks, wallets and identity partners.",
    tags: ["XCFramework", "SPM", "CocoaPods"],
  },
  {
    icon: "cross",
    title: "Flutter cross-platform",
    blurb: "One codebase for iOS and Android when the budget or timeline calls for it.",
    tags: ["Flutter", "Dart", "Stacked"],
  },
  {
    icon: "chip",
    title: "Real-time & connected",
    blurb: "Live tracking, chat over MQTT, payments, QR and IoT devices talking to your app.",
    tags: ["MQTT", "Maps", "Payments", "ESP32"],
  },
];

/* ---------------- Tech arsenal ---------------- */
export type Tech = { name: string; note?: string };
export type TechGroup = {
  id: string;
  label: string;
  color: "cyan" | "magenta" | "lime" | "amber" | "violet" | "sky";
  items: Tech[];
};

export const techGroups: TechGroup[] = [
  {
    id: "ios",
    label: "iOS",
    color: "cyan",
    items: [
      { name: "Swift", note: "Primary language" },
      { name: "SwiftUI" },
      { name: "UIKit", note: "Programmatic UI" },
      { name: "Combine" },
      { name: "Swift Concurrency", note: "async / await" },
      { name: "Core Location" },
      { name: "MapKit / Google Maps", note: "Live tracking" },
      { name: "Core Motion", note: "Shake gestures" },
      { name: "AVFoundation", note: "Camera · QR" },
      { name: "Push Notifications", note: "APNs · FCM" },
    ],
  },
  {
    id: "xr",
    label: "AR · 3D",
    color: "magenta",
    items: [
      { name: "ARKit" },
      { name: "RealityKit" },
      { name: "Object Capture", note: "Photogrammetry" },
      { name: "RoomPlan", note: "LiDAR rooms" },
      { name: "SceneKit" },
      { name: "LiDAR depth" },
      { name: "USDZ / 3D export" },
      { name: "3D game UI", note: "Langur Burja" },
    ],
  },
  {
    id: "arch",
    label: "Architecture",
    color: "violet",
    items: [
      { name: "MVVM" },
      { name: "Modular architecture" },
      { name: "Clean code · SOLID" },
      { name: "XCFramework SDKs" },
      { name: "Swift Package Manager" },
      { name: "CocoaPods" },
      { name: "Xcode Instruments", note: "Leaks · energy" },
      { name: "Battery & memory tuning" },
    ],
  },
  {
    id: "rt",
    label: "Realtime & Payments",
    color: "lime",
    items: [
      { name: "REST APIs · JSON" },
      { name: "MQTT", note: "Real-time chat" },
      { name: "Protocol Buffers" },
      { name: "Firebase" },
      { name: "eSewa" },
      { name: "Khalti" },
      { name: "Prabhu Pay" },
      { name: "Identity SDKs", note: "IDEMIA" },
      { name: "Generative AI APIs", note: "Text → video" },
    ],
  },
  {
    id: "cross",
    label: "Flutter & Tools",
    color: "sky",
    items: [
      { name: "Flutter" },
      { name: "Dart" },
      { name: "Stacked state" },
      { name: "Xcode" },
      { name: "Git" },
      { name: "TestFlight · App Store Connect" },
      { name: "Google Play Console" },
      { name: "Figma" },
      { name: "Adobe XD" },
    ],
  },
  {
    id: "hw",
    label: "Hardware",
    color: "amber",
    items: [
      { name: "Arduino", note: "C / C++" },
      { name: "ESP32 · ESP8266", note: "IoT" },
      { name: "Sensors & motor control" },
      { name: "Drones · UAV" },
      { name: "UGV robotics" },
      { name: "Electronics & Comm. Eng." },
    ],
  },
];

/* ---------------- Experience ---------------- */
export type Quest = {
  id: string;
  title: string;
  company: string;
  period: string;
  status: "ACTIVE" | "COMPLETE";
  objectives: string[];
  stack: string[];
  loot: string[];
};

export const quests: Quest[] = [
  {
    id: "Q-08",
    title: "iOS & Flutter Developer · Robotics Instructor",
    company: "Freelance / Upwork",
    period: "Nov 2024 — Present",
    status: "ACTIVE",
    objectives: [
      "Built LiDAR scanning apps that turn spaces into 2D floor plans with evacuation routes, and 3D room layouts with real dimensions.",
      "Shipped an insurance calculator with eSewa, Khalti and Prabhu Pay payments plus QR scanning.",
      "Built a focus mode for Norvic Reset that locks the device to one screen across timed sessions.",
      "Made ImaginAI: prompt → AI voice-over script → generated video.",
      "Ran month-long Arduino / ESP IoT workshops for students.",
    ],
    stack: ["SwiftUI", "RoomPlan", "LiDAR", "Flutter", "Payments", "Gen-AI"],
    loot: ["GIC Insurance", "EvacPlan", "LidarScanner", "Tarmac", "SIMAPP", "Norvic Reset", "BigFanz", "ImaginAI", "AdMonkey", "Everest Grocery"],
  },
  {
    id: "Q-07",
    title: "Senior iOS Developer",
    company: "Sajilo Saathi",
    period: "Aug 2023 — Present",
    status: "ACTIVE",
    objectives: [
      "Single-handedly re-architected the rider and driver ride-sharing apps from a legacy codebase into a modular, high-performance architecture.",
      "Fixed critical map rendering, real-time tracking and payment issues; tuned every component for battery life and location accuracy.",
      "Rebuilt booking flows, earnings dashboards and rating screens from scratch.",
      "Raised the rider app from 2.8★ to 3.7★ and the driver app from 2.2★ to 2.8★.",
    ],
    stack: ["Swift", "UIKit", "Maps", "Core Location", "Modular arch"],
    loot: ["Sajilo — Ride Sharing", "Sajilo Rider — Driver App"],
  },
  {
    id: "Q-06",
    title: "iOS & Flutter Developer",
    company: "Vanilla Tech",
    period: "Sep 2023 — Nov 2024",
    status: "COMPLETE",
    objectives: [
      "Revamped the IDEMIA identity SDK for iOS — split modules, fixed integration issues.",
      "Upgraded the KIBB iOS SDK to XCFramework and resolved compatibility problems.",
      "Built a tourism app in Flutter with Stacked state; added personalised currency and reordering to a fintech app.",
    ],
    stack: ["Swift", "XCFramework", "Flutter", "Stacked"],
    loot: ["Merchantrade Money", "eWallet Malaysia", "IDEMIA SDK", "KIBB SDK", "Merchantrade Money Biz", "Enrich Money", "Tourism App"],
  },
  {
    id: "Q-05",
    title: "iOS Developer",
    company: "Treeleaf Technologies",
    period: "Aug 2021 — Sep 2023",
    status: "COMPLETE",
    objectives: [
      "Built real-time chat over MQTT with Protocol Buffers for lean payloads.",
      "Delivered ticket management and meeting-calendar scheduling.",
      "Hunted down memory leaks; built all UI programmatically in UIKit.",
    ],
    stack: ["Swift", "UIKit", "MQTT", "Protobuf"],
    loot: ["Anydone"],
  },
  {
    id: "Q-04",
    title: "Flutter Developer",
    company: "YarshaSoft",
    period: "Aug 2020 — Aug 2021",
    status: "COMPLETE",
    objectives: [
      "Designed and shipped school-management and NVA apps to the Play Store.",
      "Integrated APIs and push notifications; owned testing and debugging.",
    ],
    stack: ["Flutter", "Dart", "REST", "Push"],
    loot: ["Ganesh Himal School", "IJ Pioneer School", "NVA"],
  },
  {
    id: "Q-03",
    title: "Flutter Developer Intern",
    company: "OkayJourney",
    period: "Jun 2020 — Aug 2021",
    status: "COMPLETE",
    objectives: [
      "Designed the OkayJourney and Muskan apps in Adobe XD.",
      "Learned app architecture patterns and UI/UX design.",
    ],
    stack: ["Adobe XD", "Flutter", "UI/UX"],
    loot: ["OkayJourney", "Muskan"],
  },
  {
    id: "Q-02",
    title: "Team Member — Robotics",
    company: "GBS Team",
    period: "Apr 2019 — Oct 2019",
    status: "COMPLETE",
    objectives: [
      "Helped build a bomb-disposal robot for the army (Swabhiman).",
      "Worked on surveillance drones, UAVs and UGVs — design and flight control.",
    ],
    stack: ["Robotics", "Drones", "Embedded"],
    loot: ["Swabhiman", "UAV / UGV builds"],
  },
  {
    id: "Q-01",
    title: "Robotics Teacher",
    company: "Prerana Vidhyashram",
    period: "Apr 2019 — Oct 2019",
    status: "COMPLETE",
    objectives: [
      "Taught Arduino programming, sensors and motor control.",
      "Mentored students through their own automation and robotics builds.",
    ],
    stack: ["Arduino", "Teaching"],
    loot: ["Student robotics projects"],
  },
];

/* ---------------- Projects ---------------- */
export type Category = "AR & 3D" | "Mobility" | "Fintech" | "AI & Media" | "Games" | "Business";
export type Item = {
  name: string;
  type: string;
  category: Category;
  rarity: "LEGENDARY" | "EPIC" | "RARE";
  icon: "dice" | "cube" | "scan" | "car" | "shield" | "chat" | "film" | "lock" | "wallet" | "store" | "plane";
  blurb: string;
  result?: string;
  stack: string[];
};

export const categories: ("All" | Category)[] = ["All", "AR & 3D", "Mobility", "Fintech", "AI & Media", "Games", "Business"];

export const inventory: Item[] = [
  {
    name: "Magi3D",
    type: "Object capture",
    category: "AR & 3D",
    rarity: "LEGENDARY",
    icon: "cube",
    blurb: "Walk around any object, scan it and get a shareable 3D model — right on the iPhone.",
    result: "Photogrammetry on device",
    stack: ["RealityKit", "ObjectCapture", "USDZ"],
  },
  {
    name: "EvacPlan",
    type: "LiDAR · Safety",
    category: "AR & 3D",
    rarity: "LEGENDARY",
    icon: "scan",
    blurb: "Scans a building with LiDAR, flattens it into a 2D floor plan and lays out evacuation routes for export.",
    result: "Scan → floor plan → export",
    stack: ["SwiftUI", "RoomPlan", "LiDAR"],
  },
  {
    name: "Sajilo",
    type: "Ride sharing",
    category: "Mobility",
    rarity: "LEGENDARY",
    icon: "car",
    blurb: "Nepal's rider and driver apps, rebuilt end to end — live tracking, payments, earnings dashboards.",
    result: "Rating 2.8★ → 3.7★",
    stack: ["Swift", "Maps", "Core Location", "Modular"],
  },
  {
    name: "Langur Burja",
    type: "Game · Personal",
    category: "Games",
    rarity: "EPIC",
    icon: "dice",
    blurb: "Nepal's traditional Jhandi Munda dice game — shake your phone to roll six 3D dice.",
    stack: ["Swift", "UIKit", "Core Motion", "3D"],
  },
  {
    name: "LidarScanner",
    type: "LiDAR · Upwork",
    category: "AR & 3D",
    rarity: "EPIC",
    icon: "scan",
    blurb: "3D room layouts with measured dimensions for every wall, door and window.",
    stack: ["SwiftUI", "RoomPlan", "SceneKit"],
  },
  {
    name: "IDEMIA & KIBB SDKs",
    type: "Identity · Banking",
    category: "Fintech",
    rarity: "EPIC",
    icon: "shield",
    blurb: "Identity-verification and banking SDKs repackaged as XCFrameworks for Merchantrade and eWallet Malaysia.",
    result: "Shipped to Malaysian fintechs",
    stack: ["Swift", "XCFramework", "SDK design"],
  },
  {
    name: "GIC Insurance",
    type: "Insurance",
    category: "Fintech",
    rarity: "EPIC",
    icon: "wallet",
    blurb: "Premium calculator with in-app payments through eSewa, Khalti and Prabhu Pay, plus QR scanning.",
    stack: ["Swift", "Payments", "QR"],
  },
  {
    name: "ImaginAI",
    type: "Generative video",
    category: "AI & Media",
    rarity: "EPIC",
    icon: "film",
    blurb: "Type a prompt, get a voiced-over AI video. Script, narration and footage stitched together.",
    stack: ["Flutter", "Gen-AI APIs"],
  },
  {
    name: "Anydone",
    type: "Messaging",
    category: "Business",
    rarity: "RARE",
    icon: "chat",
    blurb: "Real-time chat, tickets and meetings over MQTT + Protocol Buffers.",
    stack: ["UIKit", "MQTT", "Protobuf"],
  },
  {
    name: "Norvic Reset",
    type: "Health · Focus",
    category: "Business",
    rarity: "RARE",
    icon: "lock",
    blurb: "Focus mode that pins the device to one screen for timed sessions.",
    stack: ["SwiftUI", "Flutter"],
  },
  {
    name: "Merchantrade Money",
    type: "Remittance wallet",
    category: "Fintech",
    rarity: "RARE",
    icon: "wallet",
    blurb: "Consumer and business wallet apps with personalised currencies and reorderable favourites.",
    stack: ["Swift", "Flutter"],
  },
  {
    name: "BigFanz",
    type: "Fan engagement",
    category: "Business",
    rarity: "RARE",
    icon: "store",
    blurb: "Customer and business iOS apps for a fan-engagement platform.",
    stack: ["Swift", "SwiftUI"],
  },
  {
    name: "Tarmac · SIMAPP",
    type: "SwiftUI apps",
    category: "Business",
    rarity: "RARE",
    icon: "plane",
    blurb: "Client apps built entirely in SwiftUI.",
    stack: ["SwiftUI"],
  },
  {
    name: "AdMonkey",
    type: "Ad analytics",
    category: "AI & Media",
    rarity: "RARE",
    icon: "film",
    blurb: "Ad analysis app that helps marketers see what's working.",
    stack: ["Flutter"],
  },
  {
    name: "Everest Grocery",
    type: "E-commerce",
    category: "Business",
    rarity: "RARE",
    icon: "store",
    blurb: "Grocery ordering app for customers in Nepal.",
    stack: ["Flutter"],
  },
];

export const achievements = [
  { title: "Bomb-Disposal Bot", detail: "Team Swabhiman — robot built for the army", year: "2019" },
  { title: "Aqua-Bot Champion", detail: "Built and piloted a winning underwater bot", year: "2015–19" },
  { title: "Rating Reviver", detail: "Rider 2.8★ → 3.7★ · Driver 2.2★ → 2.8★", year: "★" },
  { title: "Event Organizer", detail: "Next Expo & National Mechanical Exhibition", year: "2019" },
  { title: "B.E. Electronics & Comm.", detail: "National College of Information Technology", year: "2015–19" },
  { title: "Polyglot", detail: "Nepali · Newari · English · Hindi", year: "∞" },
];

/* Scrolling ticker under the hero */
export const marquee = [
  "Swift", "SwiftUI", "UIKit", "ARKit", "RealityKit", "RoomPlan", "LiDAR", "Object Capture", "SceneKit",
  "Core Motion", "MapKit", "MQTT", "Protobuf", "XCFramework", "Combine", "Flutter", "Dart", "Firebase",
  "eSewa", "Khalti", "Arduino", "ESP32",
];
