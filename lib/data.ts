/* ------------------------------------------------------------------
   All site copy lives here (source: Rajan Maharjan — iOS Developer Resume).
   Components read from this file; edit freely.
------------------------------------------------------------------- */

export const profile = {
  name: "Rajan Maharjan",
  handle: "RAJAN_M",
  role: "Senior iOS Developer",
  roleLong: "Senior iOS Developer | Flutter Developer",
  headline: "I build iOS apps that see in 3D, talk in real time and ship to the App Store.",
  location: "Kathmandu, Nepal",
  timezone: "UTC+05:45",
  email: "rajanmaharjan123@gmail.com",
  phone: "+977-9860124285",
  linkedin: "https://www.linkedin.com/in/rajan1122/",
  cv: "/Rajan-Maharjan-CV.pdf",
  years: "6+",
  summary:
    "Senior iOS Developer with 6+ years designing, building and shipping mobile apps with Swift, UIKit and SwiftUI, plus cross-platform apps in Flutter. Led the full architecture revamp of a ride-sharing platform (App Store ratings 2.8 → 4.0 and 2.2 → 3.2), built WebRTC calling, video conferencing and AR-enabled screen sharing for a US collaboration platform, and delivered fintech, e-wallet and remittance apps for Malaysian and Singaporean clients.",
  strengths:
    "Experienced in SDK development and integration, maps and location tracking, payment gateways, real-time communication and 3D / LiDAR scanning with RealityKit and RoomPlan.",
  level: 6,
  className: "Mobile Architect",
  education: { degree: "Bachelor in Electronics and Communication Engineering", school: "National College of Information Technology (NCIT)", years: "2015 – 2019" },
  languages: ["Nepali (Native)", "Newari (Native)", "English (Fluent)", "Hindi (Intermediate)"],
  interests: "Football · Travel · Video games",
};

/* Headline numbers clients scan first */
export const impact = [
  { value: "6+", label: "Years shipping mobile apps" },
  { value: "30+", label: "Apps, SDKs & client builds" },
  { value: "2.8→4.0★", label: "Sajilo user-app rating after rebuild" },
  { value: "4", label: "Client countries · US · CA · MY · SG" },
];

/* ---------------- Services (what a client can hire for) ---------------- */
export type ServiceIcon = "phone" | "ar" | "sdk" | "rescue" | "cross" | "chip";
export type Service = { title: string; blurb: string; tags: string[]; icon: ServiceIcon; proof: string[]; points: string[] };

export const services: Service[] = [
  {
    icon: "phone",
    title: "Native iOS apps",
    blurb: "Production apps in Swift, SwiftUI and UIKit — from first screen to App Store release and ongoing updates.",
    tags: ["Swift", "SwiftUI", "UIKit", "App Store"],
    points: ["Programmatic UIKit & SwiftUI interfaces", "MVVM / Clean, modular architecture", "TestFlight & App Store Connect releases", "iPhone, iPad and Mac with real-time sync"],
    proof: ["Sajilo", "Evacuation Plan App", "GIC Insurance", "Norvic Reset"],
  },
  {
    icon: "ar",
    title: "AR, LiDAR & 3D",
    blurb: "Room scanning into floor plans, measured 3D layouts, photogrammetry object capture and AR collaboration tools.",
    tags: ["ARKit", "RoomPlan", "RealityKit", "LiDAR"],
    points: ["RoomPlan scans → 2D floor plans & 3D rooms", "Object Capture photogrammetry", "AR-enabled screen sharing & ARKit drawing", "PDF / JPG / USDZ export"],
    proof: ["Evacuation Plan App", "LidarScanner", "Magi3D", "Anydone"],
  },
  {
    icon: "chip",
    title: "Real-time communication",
    blurb: "Audio calling, multi-party video conferencing, screen sharing and encrypted chat that hold up on mobile networks.",
    tags: ["WebRTC", "Janus", "WebSocket", "MQTT", "gRPC"],
    points: ["One-to-one audio & group video calls", "Screen sharing with ReplayKit", "End-to-end encrypted messaging", "Protocol Buffers for lean payloads"],
    proof: ["Anydone"],
  },
  {
    icon: "rescue",
    title: "App revamp & rescue",
    blurb: "Untangle legacy code into a modular architecture; fix crashes, memory leaks, battery drain and bad ratings.",
    tags: ["Legacy migration", "Instruments", "MVVM"],
    points: ["Legacy → modular migration, single-handed", "Map rendering & location-tracking fixes", "Battery and accuracy optimisation", "Ratings 2.8 → 4.0 and 2.2 → 3.2"],
    proof: ["Sajilo", "Anydone", "IDEMIA & KIBB SDKs"],
  },
  {
    icon: "sdk",
    title: "Fintech, SDKs & security",
    blurb: "E-wallets, cross-border remittance and identity SDKs — packaged, integrated and secured for regulated markets.",
    tags: ["XCFramework", "eKYC", "Keychain", "Payments"],
    points: ["IDEMIA biometric eKYC integration", "KIBB SDK → XCFramework migration", "eSewa, Khalti, Prabhu Pay, QR payments", "Keychain, biometrics, E2E encryption"],
    proof: ["Merchantrade & eRemit wallets", "IDEMIA & KIBB SDKs", "GIC Insurance"],
  },
  {
    icon: "cross",
    title: "Flutter cross-platform",
    blurb: "One codebase for iOS and Android when the budget or timeline calls for it — published to both stores.",
    tags: ["Flutter", "Dart", "Stacked"],
    points: ["Stacked state management", "REST APIs & push notifications", "Google Play & App Store publishing", "Gen-AI powered features"],
    proof: ["ImaginAI", "Tourism App", "School Apps", "AdMonkey", "Everest Grocery"],
  },
];

/* ---------------- Tech arsenal (straight from the resume) ---------------- */
export type Tech = { name: string; note?: string; match?: string[] };
export type TechGroup = {
  id: string;
  label: string;
  color: "cyan" | "magenta" | "lime" | "amber" | "violet" | "sky";
  items: Tech[];
};

export const techGroups: TechGroup[] = [
  {
    id: "lang", label: "Languages", color: "cyan",
    items: [
      { name: "Swift", note: "Primary language" },
      { name: "Dart", note: "Flutter apps", match: ["Flutter"] },
      { name: "JavaScript" },
      { name: "C / C++", note: "Arduino firmware", match: ["Arduino"] },
    ],
  },
  {
    id: "ios", label: "iOS Frameworks", color: "sky",
    items: [
      { name: "UIKit", note: "Programmatic UI · Auto Layout" },
      { name: "SwiftUI" },
      { name: "Combine" },
      { name: "Foundation" },
      { name: "AVFoundation", note: "Camera · media" },
      { name: "ReplayKit", note: "Screen sharing" },
      { name: "Core Location", note: "Live tracking" },
      { name: "MapKit", match: ["Maps"] },
      { name: "Core Data" },
      { name: "StoreKit", note: "In-app credits" },
      { name: "APNs", note: "Push notifications", match: ["Push"] },
    ],
  },
  {
    id: "xr", label: "AR · 3D · LiDAR", color: "magenta",
    items: [
      { name: "ARKit" },
      { name: "RealityKit" },
      { name: "Object Capture", note: "Photogrammetry", match: ["ObjectCapture"] },
      { name: "RoomPlan", note: "Floor plans" },
      { name: "LiDAR" },
      { name: "USDZ / PDF export", match: ["USDZ", "PDF"] },
    ],
  },
  {
    id: "rtc", label: "Real-time Communication", color: "lime",
    items: [
      { name: "WebRTC" },
      { name: "WebSocket" },
      { name: "Janus Media Server", match: ["Janus"] },
      { name: "MQTT" },
      { name: "gRPC" },
      { name: "Audio calling", match: ["WebRTC"] },
      { name: "Video conferencing", match: ["WebRTC"] },
      { name: "Screen sharing", match: ["ReplayKit"] },
      { name: "Real-time chat", match: ["MQTT"] },
    ],
  },
  {
    id: "net", label: "Networking & Data", color: "sky",
    items: [
      { name: "REST APIs", match: ["REST"] },
      { name: "URLSession" },
      { name: "JSON / Codable" },
      { name: "Protocol Buffers", match: ["Protobuf"] },
      { name: "Push notifications", match: ["Push"] },
    ],
  },
  {
    id: "arch", label: "Architecture & Patterns", color: "violet",
    items: [
      { name: "MVVM" },
      { name: "MVC" },
      { name: "Clean Architecture" },
      { name: "Modular architecture", match: ["Modular"] },
      { name: "Protocol-oriented programming" },
      { name: "Delegate & singleton patterns" },
      { name: "Legacy code migration", match: ["Legacy"] },
    ],
  },
  {
    id: "sdk", label: "SDKs & Security", color: "violet",
    items: [
      { name: "XCFramework" },
      { name: "Swift Package Manager" },
      { name: "CocoaPods" },
      { name: "IDEMIA SDK", match: ["IDEMIA"] },
      { name: "KIBB SDK", match: ["KIBB"] },
      { name: "End-to-end encryption", match: ["E2E"] },
      { name: "Keychain" },
      { name: "Biometric authentication", match: ["Biometric", "eKYC"] },
      { name: "eKYC identity verification", match: ["eKYC"] },
    ],
  },
  {
    id: "pay", label: "FinTech & Payments", color: "amber",
    items: [
      { name: "E-wallets", match: ["Wallet"] },
      { name: "Cross-border remittance", match: ["Remittance"] },
      { name: "eSewa" },
      { name: "Khalti" },
      { name: "Prabhu Pay" },
      { name: "QR code payments", match: ["QR"] },
    ],
  },
  {
    id: "perf", label: "Performance & Debugging", color: "cyan",
    items: [
      { name: "Xcode Instruments", match: ["Instruments"] },
      { name: "Memory leak detection", match: ["Instruments"] },
      { name: "Battery & location optimisation", match: ["Core Location"] },
      { name: "Crash analysis", match: ["Crashlytics"] },
    ],
  },
  {
    id: "tools", label: "Flutter, Tools & Process", color: "amber",
    items: [
      { name: "Flutter" },
      { name: "Stacked state management", match: ["Stacked"] },
      { name: "Xcode" },
      { name: "Git · GitLab", match: ["Git"] },
      { name: "Firebase", note: "Crashlytics · FCM" },
      { name: "TestFlight · App Store Connect", match: ["App Store"] },
      { name: "Google Play Console", match: ["Play Store"] },
      { name: "Postman" },
      { name: "Jira" },
      { name: "Adobe XD" },
      { name: "Agile · Scrum · code reviews", match: ["Agile"] },
    ],
  },
  {
    id: "hw", label: "Hardware & IoT", color: "amber",
    items: [
      { name: "Arduino" },
      { name: "ESP32", note: "IoT" },
      { name: "Robotics" },
      { name: "Drones · UAV / UGV", match: ["Drones", "UAV"] },
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
  location?: string;
  client?: string;
  project?: string;
  link?: string;
  objectives: string[];
  stack: string[];
  loot: string[];
};

export const quests: Quest[] = [
  {
    id: "Q-09",
    title: "Senior iOS Developer",
    company: "Sajilo Saathi",
    location: "Kathmandu, Nepal",
    period: "Aug 2025 — Present",
    status: "ACTIVE",
    project: "Sajilo (user) and Sajilo Rider (driver) — Nepal's ride-sharing apps.",
    objectives: [
      "Led the complete revamp of the Sajilo and Sajilo Rider iOS apps, single-handedly migrating a legacy codebase to a modular, high-performance architecture.",
      "Resolved critical issues in map rendering, real-time location tracking and payment integration.",
      "Optimised every core component for battery efficiency and location accuracy.",
      "Redesigned booking flows, earnings dashboards and rating interfaces from scratch.",
      "Raised the user app rating from 2.8 to 4.0 stars and the rider app from 2.2 to 3.2 stars through hands-on development and systematic bug resolution.",
    ],
    stack: ["Swift", "UIKit", "MapKit", "Core Location", "Modular", "Legacy", "Payments"],
    loot: ["Sajilo"],
  },
  {
    id: "Q-08",
    title: "Freelance iOS · Flutter Developer · Robotics Instructor",
    company: "Self-Employed (Upwork & direct clients)",
    location: "Remote",
    period: "Nov 2024 — Present",
    status: "ACTIVE",
    objectives: [
      "Built a LiDAR scanning app that produces 3D room layouts with dimensions for an Upwork client (LidarScanner).",
      "Developed an insurance calculator and QR scan app integrating eSewa, Khalti and Prabhu Pay (GIC Insurance).",
      "Designed and built a focus mode for Norvic Reset that locks the app for custom durations across sessions and keeps the device on a single screen.",
      "Built ImaginAI, a Flutter text-to-video app that turns a prompt into a voiceover script and attaches it to an AI-generated video.",
      "Developed a traditional dice game with 3D dice shaking and a clean Swift / UIKit interface.",
      "Led one-month hands-on Arduino and ESP IoT sessions, guiding students through real-world robotics projects.",
      "Coordinated with remote teams to deliver tasks against project objectives.",
    ],
    stack: ["Swift", "SwiftUI", "UIKit", "RoomPlan", "LiDAR", "Flutter", "eSewa", "Khalti", "QR", "Arduino", "ESP32"],
    loot: ["GIC Insurance", "BigFanz", "SIMAPP · Tarmac", "LidarScanner", "Norvic Reset", "ImaginAI", "AdMonkey", "Everest Grocery", "Langur Burja"],
  },
  {
    id: "Q-07",
    title: "Founding iOS Developer (Part-Time)",
    company: "Virtual Tour Calgary",
    location: "Calgary, Canada (Remote)",
    period: "Apr 2024 — Present",
    status: "ACTIVE",
    project: "Evacuation Plan App — an App Store app for iPhone, iPad and Mac that turns LiDAR scans into professional evacuation plans.",
    link: "https://evacuationplanapp.com",
    objectives: [
      "Sole founding developer: designed, built and launched the app end to end, from architecture to App Store release and ongoing updates.",
      "Built multi-device support under one account with real-time project sync across iPhone, iPad and macOS — scan on iPhone, finish markup on iPad or Mac.",
      "Built LiDAR room scanning with Apple's RoomPlan to generate accurate 2D floor plans from a single continuous scan, with options to hide furniture.",
      "Developed a markup editor with drawing tools for evacuation routes (Apple Pencil on iPad), room labels and drag-and-drop safety icons.",
      "Built a smart legend that lists only the icons placed on the plan, plus a mirror tool for identical adjoining units.",
      "Implemented customisable templates with white-label branding, logos, emergency contacts, addresses and automatic safety warnings.",
      "Delivered A4 print preview, PDF and JPG export, printing and sharing, and a custom .evacplan file format.",
      "Built a pay-per-plan export credit system with in-app top-ups for fire-safety companies, property managers, landlords and Airbnb hosts.",
    ],
    stack: ["Swift", "SwiftUI", "RoomPlan", "ARKit", "LiDAR", "StoreKit", "PDF", "App Store"],
    loot: ["Evacuation Plan App"],
  },
  {
    id: "Q-06",
    title: "iOS Developer | Flutter Developer",
    company: "Vanilla Tech",
    client: "Malaysian and Singaporean fintech products",
    period: "Sep 2023 — Nov 2024",
    status: "COMPLETE",
    objectives: [
      "Developed and maintained iOS apps for Malaysian and Singaporean digital wallet and cross-border remittance products: Merchantrade Money, Valyou, Corporate Wallet, eRemit Malaysia and eRemit Singapore.",
      "Integrated the IDEMIA SDK for biometric identity verification, and revamped it by modularising components, resolving issues and ensuring seamless integration.",
      "Fixed compatibility issues and migrated the KIBB iOS SDK to XCFramework for better performance and distribution.",
      "Built a Tourism App in Flutter using Stacked state management with refined UI design.",
      "Enhanced a Flutter fintech app with personalised currency features and intuitive reordering.",
    ],
    stack: ["Swift", "UIKit", "XCFramework", "IDEMIA", "KIBB", "eKYC", "Wallet", "Remittance", "Flutter", "Stacked"],
    loot: ["Merchantrade & eRemit wallets", "IDEMIA & KIBB SDKs", "Tourism App", "Merchantrade Money Biz", "Enrich Money"],
  },
  {
    id: "Q-05",
    title: "iOS Developer",
    company: "Treeleaf Technologies",
    client: "Anydone (US-based)",
    period: "Aug 2021 — Sep 2023",
    status: "COMPLETE",
    project: "Anydone — a real-time communication and collaboration platform for enterprise clients.",
    objectives: [
      "Built one-to-one audio calling, multi-party video conference calls and screen sharing using WebRTC, Janus Media Server and WebSocket.",
      "Developed AR-enabled screen sharing and interactive ARKit drawing tools for collaborative sessions.",
      "Built a real-time messaging system with end-to-end encrypted communication.",
      "Used MQTT, gRPC and Protocol Buffers for low-latency, reliable data transfer with reduced payload overhead.",
      "Developed a ticket management system to track and resolve customer issues.",
      "Implemented meeting calendar and scheduling features.",
      "Resolved performance bottlenecks and fixed memory leaks with Xcode Instruments, improving UI responsiveness and stability.",
      "Built user interfaces programmatically with UIKit as reusable, modular components.",
      "Worked in Agile sprints with remote backend, QA and product teams in the US, from planning through TestFlight and App Store releases.",
    ],
    stack: ["Swift", "UIKit", "WebRTC", "Janus", "WebSocket", "MQTT", "gRPC", "Protobuf", "ARKit", "AVFoundation", "ReplayKit", "MVVM", "E2E", "Instruments", "Git", "Agile"],
    loot: ["Anydone"],
  },
  {
    id: "Q-04",
    title: "Flutter Developer",
    company: "YarshaSoft Pvt. Ltd.",
    period: "Aug 2020 — Aug 2021",
    status: "COMPLETE",
    objectives: [
      "Designed and developed school management apps and the NVA app, and published them on Google Play.",
      "Integrated REST APIs and implemented push notifications for real-time communication with users.",
      "Tested and debugged apps to identify and fix issues before release.",
    ],
    stack: ["Flutter", "Dart", "REST", "Push", "Play Store"],
    loot: ["School Apps"],
  },
  {
    id: "Q-03",
    title: "Flutter Developer Intern",
    company: "OkayJourney Pvt. Ltd.",
    period: "Jun 2020 — Aug 2021",
    status: "COMPLETE",
    objectives: [
      "Designed the OkayJourney and Muskan apps in Adobe XD.",
      "Learned mobile app architecture, design patterns and UI/UX design.",
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
      "Contributed to the development of a bomb-disposal robot for the Nepal Army (Swabhiman).",
      "Worked on drone projects including surveillance, covering drone design and flight-control systems.",
    ],
    stack: ["Robotics", "Drones", "UAV", "Arduino"],
    loot: ["Swabhiman", "UAV / UGV builds"],
  },
  {
    id: "Q-01",
    title: "Robotics Teacher",
    company: "Prerana Vidhyashram",
    period: "Apr 2019 — Oct 2019",
    status: "COMPLETE",
    objectives: [
      "Conducted robotics classes and workshops covering core concepts and technologies.",
      "Taught Arduino programming, including sensor integration and motor control.",
      "Mentored students in completing their automation and robotics projects.",
    ],
    stack: ["Arduino", "Robotics"],
    loot: ["Student robotics projects"],
  },
];

/* ---------------- Projects ---------------- */
export type Category = "AR & 3D" | "Mobility" | "Fintech" | "Real-time" | "AI & Media" | "Games" | "Business";
export type Item = {
  name: string;
  type: string;
  category: Category;
  rarity: "LEGENDARY" | "EPIC" | "RARE";
  icon: "dice" | "cube" | "scan" | "car" | "shield" | "chat" | "film" | "lock" | "wallet" | "store" | "plane";
  blurb: string;
  result?: string;
  details?: string[];
  platforms?: string;
  link?: string;
  job?: string;        // quest id this was built in
  stack: string[];
};

export const categories: ("All" | Category)[] = ["All", "AR & 3D", "Mobility", "Fintech", "Real-time", "AI & Media", "Games", "Business"];

export const inventory: Item[] = [
  {
    name: "Evacuation Plan App",
    type: "LiDAR · Safety · App Store",
    category: "AR & 3D",
    rarity: "LEGENDARY",
    icon: "scan",
    blurb: "Turns a single LiDAR scan into a professional, printable evacuation plan — on iPhone, iPad and Mac.",
    result: "Founding developer · live on the App Store",
    platforms: "iPhone · iPad · Mac",
    link: "https://evacuationplanapp.com",
    job: "Q-07",
    details: [
      "RoomPlan scanning produces accurate 2D floor plans from one continuous scan, with furniture hiding.",
      "Markup editor with Apple Pencil routes, room labels and drag-and-drop safety icons.",
      "Smart legend, mirror tool for adjoining units, white-label templates and auto safety warnings.",
      "Real-time project sync across iPhone, iPad and Mac under one account.",
      "A4 print preview, PDF/JPG export, custom .evacplan files and a pay-per-plan credit system (StoreKit).",
    ],
    stack: ["Swift", "SwiftUI", "RoomPlan", "ARKit", "LiDAR", "StoreKit", "PDF"],
  },
  {
    name: "Sajilo",
    type: "Ride sharing · User & Rider apps",
    category: "Mobility",
    rarity: "LEGENDARY",
    icon: "car",
    blurb: "Nepal's ride-sharing apps, rebuilt end to end — live tracking, payments, booking flows and earnings dashboards.",
    result: "User app 2.8★ → 4.0★ · Rider app 2.2★ → 3.2★",
    platforms: "iOS",
    job: "Q-09",
    details: [
      "Single-handed migration from a legacy codebase to a modular, high-performance architecture.",
      "Fixed map rendering, real-time location tracking and payment integration.",
      "Battery and location-accuracy optimisation across every core component.",
      "Booking flows, earnings dashboards and rating interfaces redesigned from scratch.",
    ],
    stack: ["Swift", "UIKit", "MapKit", "Core Location", "Modular", "Legacy"],
  },
  {
    name: "Anydone",
    type: "Real-time collaboration · US client",
    category: "Real-time",
    rarity: "LEGENDARY",
    icon: "chat",
    blurb: "Enterprise communication platform: audio calls, multi-party video, AR screen sharing and encrypted chat.",
    result: "WebRTC · Janus · AR screen sharing",
    platforms: "iOS",
    job: "Q-05",
    details: [
      "One-to-one audio and multi-party video conferencing with WebRTC, Janus Media Server and WebSocket.",
      "AR-enabled screen sharing and interactive ARKit drawing tools for collaborative sessions.",
      "End-to-end encrypted real-time messaging over MQTT, gRPC and Protocol Buffers.",
      "Ticket management, meeting calendar and scheduling.",
      "Memory-leak and performance fixes with Xcode Instruments; programmatic, modular UIKit.",
    ],
    stack: ["Swift", "UIKit", "WebRTC", "Janus", "WebSocket", "MQTT", "gRPC", "Protobuf", "ARKit", "ReplayKit", "E2E"],
  },
  {
    name: "Magi3D",
    type: "Object capture · Personal",
    category: "AR & 3D",
    rarity: "EPIC",
    icon: "cube",
    blurb: "Walk around any object, scan it and get a shareable 3D model, built with RealityKit's ObjectCaptureSession.",
    result: "Photogrammetry on device",
    details: ["Guided capture with ObjectCaptureSession.", "Generates a 3D model from a mobile scan of any object.", "Share the result as USDZ."],
    stack: ["Swift", "RealityKit", "ObjectCapture", "USDZ"],
  },
  {
    name: "LidarScanner",
    type: "LiDAR · Upwork client",
    category: "AR & 3D",
    rarity: "EPIC",
    icon: "scan",
    blurb: "Produces 3D room layouts with real dimensions from a LiDAR scan.",
    job: "Q-08",
    details: ["RoomPlan capture with measured walls, doors and windows.", "3D room layout preview with dimensions.", "Built in SwiftUI for an Upwork client."],
    stack: ["SwiftUI", "RoomPlan", "LiDAR"],
  },
  {
    name: "Merchantrade & eRemit wallets",
    type: "E-wallet · Remittance · MY & SG",
    category: "Fintech",
    rarity: "EPIC",
    icon: "wallet",
    blurb: "Digital wallet and cross-border remittance apps for Malaysian and Singaporean customers.",
    result: "5 fintech apps maintained",
    job: "Q-06",
    details: [
      "Merchantrade Money, Valyou, Corporate Wallet, eRemit Malaysia and eRemit Singapore (iOS).",
      "Merchantrade Money Biz and Enrich Money (Flutter) — personalised currencies and reordering.",
      "Biometric eKYC identity verification with the IDEMIA SDK.",
    ],
    stack: ["Swift", "UIKit", "Wallet", "Remittance", "eKYC", "Flutter"],
  },
  {
    name: "IDEMIA & KIBB SDKs",
    type: "Identity · Banking SDKs",
    category: "Fintech",
    rarity: "EPIC",
    icon: "shield",
    blurb: "Biometric identity-verification and banking SDKs, revamped and repackaged for fintech apps.",
    result: "KIBB migrated to XCFramework",
    job: "Q-06",
    details: [
      "Integrated and revamped the IDEMIA SDK — modularised components and resolved integration issues.",
      "Fixed compatibility issues and migrated the KIBB iOS SDK to XCFramework.",
    ],
    stack: ["Swift", "XCFramework", "IDEMIA", "KIBB", "eKYC", "Biometric"],
  },
  {
    name: "GIC Insurance",
    type: "Insurance · Payments",
    category: "Fintech",
    rarity: "EPIC",
    icon: "wallet",
    blurb: "Insurance premium calculator and QR scan app with local payment gateways.",
    job: "Q-08",
    details: ["Premium calculator flows.", "QR code scanning and QR payments.", "eSewa, Khalti and Prabhu Pay integration."],
    stack: ["Swift", "eSewa", "Khalti", "Prabhu Pay", "QR"],
  },
  {
    name: "ImaginAI",
    type: "Generative video · Flutter",
    category: "AI & Media",
    rarity: "EPIC",
    icon: "film",
    blurb: "Type a prompt, get a voiced-over AI video — script, narration and footage stitched together.",
    job: "Q-08",
    details: ["Generates a voiceover script from the user's prompt.", "Attaches narration to an AI-generated video.", "Built in Flutter."],
    stack: ["Flutter", "Dart", "Gen-AI APIs"],
  },
  {
    name: "Langur Burja",
    type: "Game · Personal",
    category: "Games",
    rarity: "RARE",
    icon: "dice",
    blurb: "Digital version of Nepal's traditional Langur Burja (Jhandi Munda) dice game with 3D dice.",
    job: "Q-08",
    details: ["Roll by shaking the phone (shake detection) or pressing a button.", "3D dice shaking with a clean Swift / UIKit interface."],
    stack: ["Swift", "UIKit", "3D"],
  },
  {
    name: "Norvic Reset",
    type: "Health · Focus mode",
    category: "Business",
    rarity: "RARE",
    icon: "lock",
    blurb: "Focus mode that locks the app for custom durations and keeps the device on a single screen.",
    job: "Q-08",
    details: ["Custom lock durations across multiple sessions.", "Keeps the device pinned to a single screen for uninterrupted focus."],
    stack: ["SwiftUI", "Flutter"],
  },
  {
    name: "Tourism App",
    type: "Travel · Flutter",
    category: "Business",
    rarity: "RARE",
    icon: "plane",
    blurb: "Tourism app with a refined UI, built in Flutter with Stacked state management.",
    job: "Q-06",
    stack: ["Flutter", "Stacked"],
  },
  {
    name: "BigFanz",
    type: "Fan engagement · iOS",
    category: "Business",
    rarity: "RARE",
    icon: "store",
    blurb: "Business and customer iOS apps for a fan-engagement platform.",
    job: "Q-08",
    details: ["BigFanz Business and BigFanz Customer apps."],
    stack: ["Swift"],
  },
  {
    name: "SIMAPP · Tarmac",
    type: "SwiftUI client apps",
    category: "Business",
    rarity: "RARE",
    icon: "plane",
    blurb: "Client apps built entirely in SwiftUI.",
    job: "Q-08",
    stack: ["SwiftUI"],
  },
  {
    name: "School Apps",
    type: "Education · Google Play",
    category: "Business",
    rarity: "RARE",
    icon: "store",
    blurb: "School management apps and the NVA app, published on Google Play.",
    job: "Q-04",
    details: ["Ganesh Himal School, IJ Pioneer School and NVA.", "REST API integration and push notifications."],
    stack: ["Flutter", "REST", "Push", "Play Store"],
  },
  {
    name: "AdMonkey",
    type: "Ad analytics · Flutter",
    category: "AI & Media",
    rarity: "RARE",
    icon: "film",
    blurb: "Ad analysis app that helps marketers see what's working.",
    job: "Q-08",
    stack: ["Flutter"],
  },
  {
    name: "Everest Grocery",
    type: "E-commerce · Flutter",
    category: "Business",
    rarity: "RARE",
    icon: "store",
    blurb: "Grocery ordering app for customers in Nepal.",
    job: "Q-08",
    stack: ["Flutter"],
  },
];

export const achievements = [
  { title: "Swabhiman Bomb-Disposal Robot", detail: "Team member on a bomb-disposal robot developed for the Nepal Army, contributing to the safety of military personnel.", year: "Aug 2019" },
  { title: "Aqua-Bot Champion", detail: "Developed and piloted an Aqua-bot that won the competition.", year: "2015–19" },
  { title: "Rating Reviver", detail: "Sajilo user app 2.8★ → 4.0★ and rider app 2.2★ → 3.2★ after the rebuild.", year: "2025" },
  { title: "Event Organizer — Next Expo", detail: "Planned and ran hardware and robotics events.", year: "Jul 2019" },
  { title: "Event Organizer — National Mechanical Exhibition", detail: "Coordinated and executed exhibition events.", year: "2015–19" },
  { title: "B.E. Electronics & Communication", detail: "National College of Information Technology (NCIT), 2015 – 2019.", year: "2019" },
];

/* Scrolling ticker */
export const marquee = [
  "Swift", "SwiftUI", "UIKit", "ARKit", "RealityKit", "RoomPlan", "LiDAR", "WebRTC", "Janus", "MQTT", "gRPC",
  "XCFramework", "eKYC", "Combine", "Core Data", "Flutter", "Dart", "Firebase", "eSewa", "Khalti", "Arduino", "ESP32",
];
