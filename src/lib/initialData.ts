import {
  TeamMember,
  Idea,
  ResearchItem,
  Suggestion,
  Project,
  RoadmapStage,
  Task,
  ComponentItem,
  Experiment,
  PrototypeVersion,
  DecisionRecord,
  WikiArticle,
  ChatMessage,
  ActivityLog,
  BudgetExpense,
  TeamAchievement,
  ProjectFile,
  TeamNotification,
} from "@/types";

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    name: "Alex Rivera",
    callsign: "Spark",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Focused on embedded C++, real-time sensor processing, and low-level firmware.",
    skills: ["Embedded C++", "RTOS", "Sensor Interfacing", "Soldering"],
    online: true,
    joinedAt: "2025-02-01",
    contributionsCount: 19,
  },
  {
    id: "member-2",
    name: "Maya Chen",
    callsign: "Flux",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Passionate about PCB schematic layout, RF transmission, and power regulation.",
    skills: ["KiCad", "High-speed PCB", "RF / Antenna", "Power Supplies"],
    online: true,
    joinedAt: "2025-02-01",
    contributionsCount: 24,
  },
  {
    id: "member-3",
    name: "Liam Patel",
    callsign: "Logic",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Specializing in microcontrollers, communication protocols, and battery longevity.",
    skills: ["ESP32-S3", "I2C/SPI/UART", "Power Profiling", "Python"],
    online: true,
    joinedAt: "2025-02-01",
    contributionsCount: 16,
  },
  {
    id: "member-4",
    name: "Elena Rostova",
    callsign: "Vector",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bio: "Handling 3D CAD design, mechanical assemblies, heat dissipation, and rugged enclosures.",
    skills: ["Fusion 360", "3D Printing", "Thermal Modeling", "Mechanics"],
    online: false,
    joinedAt: "2025-02-01",
    contributionsCount: 21,
  },
  {
    id: "member-5",
    name: "Marcus Adebayo",
    callsign: "Pulse",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Bridging tinyML, edge AI inference on microcontrollers, and wireless sensor telemetry.",
    skills: ["TinyML", "Edge Impulse", "Signal Processing", "Data Pipelines"],
    online: true,
    joinedAt: "2025-02-01",
    contributionsCount: 18,
  },
  {
    id: "member-6",
    name: "Sofia Torres",
    callsign: "Relay",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Expertise in bench testing, signal integrity, component sourcing, and integration.",
    skills: ["Oscilloscopes", "Logic Analyzers", "Component Sourcing", "System Integration"],
    online: false,
    joinedAt: "2025-02-01",
    contributionsCount: 15,
  },
];

export const INITIAL_PROJECT: Project = {
  id: "proj-aeropulse",
  title: "AeroPulse: Resilient Hazardous Gas & Thermal Drone Sensor Node",
  objective:
    "Design and manufacture an ultra-lightweight, battery-powered environmental monitoring node for rapid disaster response, equipped with multi-gas AI sensing, LoRa long-range telemetry, and modular snap-fit mounting.",
  problem:
    "First responders and industrial inspectors lack low-cost, disposable or rapidly deployable sensor nodes that operate without cellular networks in harsh, toxic thermal environments.",
  solution:
    "A self-contained sensor payload combining Bosch BME688 AI gas scanner, ESP32-S3 dual-core processing, SX1262 LoRa transmission, and passive thermal isolation.",
  status: "Active",
  progress: 68,
  deadline: "2025-03-15",
  createdAt: "2025-02-05",
  tags: ["Hardware", "ESP32", "LoRa", "Disaster Response", "Sensors"],
};

export const INITIAL_IDEAS: Idea[] = [
  {
    id: "idea-1",
    title: "Dual-Chamber Modular Gas Sensor Pod with Active Airflow Venturi",
    problem:
      "Stagnant air inside typical 3D printed enclosures causes delayed gas sensor response times up to 45 seconds.",
    proposedSolution:
      "A micro-venturi channel integrated directly into the 3D-printed enclosure nosecone that naturally draws ambient air over the sensing element when the drone flies.",
    explanation:
      "By using Bernoulli's principle, forward movement creates a slight pressure differential that pulls fresh air across the BME688 without needing an active, power-hungry blower fan.",
    howItWorks:
      "Air enters through a 3mm mesh front intake, narrows through a 1.2mm nozzle, and exhausts past the sensor chamber.",
    requiredHardware: "BME688 sensor breakout, 3D printed PETG nozzle, fine nylon mesh.",
    requiredSoftware: "Sensor compensation algorithm in C++.",
    estimatedCost: 28.5,
    advantages: "Zero electrical power needed for air sampling; faster response time under 4 seconds.",
    risks: "Dust buildup on the mesh; requires drone forward airspeed of at least 2 m/s.",
    questions: "How does rain or mist affect the nylon filter?",
    references: "NASA Venturi tube airflow reference standard TM-82467.",
    authorId: "member-2",
    createdAt: "2025-02-06T10:30:00Z",
    status: "Building",
    upvotes: ["member-1", "member-3", "member-4", "member-5"],
    comments: [
      {
        id: "comm-1",
        authorId: "member-4",
        authorName: "Elena Rostova",
        content: "I modeled a test nozzle in Fusion 360 with a 30-degree inlet. 3D printing a draft tonight on the resin printer.",
        createdAt: "2025-02-06T14:15:00Z",
      },
    ],
  },
  {
    id: "idea-2",
    title: "Sub-GHz LoRa Mesh Fallback for Cellular Blackout Zones",
    problem:
      "In wildfire or collapsed infrastructure zones, LTE and 5G base stations are offline, disabling conventional IoT telemetry.",
    proposedSolution:
      "Integrate an SX1262 LoRa transceiver operating at 915 MHz with a hopping mesh protocol to relay emergency telemetry over 10+ km.",
    explanation:
      "Each node acts as an autonomous relay. If a drone is out of direct range of the base station, intermediate ground nodes re-transmit packets.",
    howItWorks:
      "Uses custom lightweight packet protocol with CRC-16 and adaptive transmission power to conserve battery.",
    requiredHardware: "SX1262 LoRa module, 915MHz helical or PCB dipole antenna.",
    requiredSoftware: "RadioLib C++ library adapted for ESP-IDF FreeRTOS task.",
    estimatedCost: 14.0,
    advantages: "Operates 100% off-grid; up to 15km line-of-sight range.",
    risks: "Low bandwidth (max ~5kbps), requiring tight data compression.",
    questions: "Can we compress gas signature spectrograms into under 64 bytes?",
    references: "Semtech SX1262 datasheet rev 2.1.",
    authorId: "member-1",
    createdAt: "2025-02-07T09:00:00Z",
    status: "Selected",
    upvotes: ["member-2", "member-3", "member-5", "member-6"],
    comments: [],
  },
  {
    id: "idea-3",
    title: "Optical Dust & Particulate Scattering with Infrared Photodiode",
    problem:
      "Standard laser particulate sensors (like PMS5003) weigh 45g and consume 100mA continuous, too heavy for our micro payload.",
    proposedSolution:
      "Custom miniature forward-scattering optical chamber using an IR LED (850nm) and matched phototransistor.",
    explanation:
      "Pulsing the IR LED for 2ms every second drops consumption below 1mA while still detecting smoke density thresholds.",
    howItWorks:
      "Particles in the optical path scatter IR light onto a shielded photodiode, producing microvolt spikes read by the ESP32 ADC.",
    requiredHardware: "850nm IR LED, BPW34 photodiode, op-amp transimpedance amplifier (OPA344).",
    requiredSoftware: "Moving average filter and analog peak detector.",
    estimatedCost: 8.2,
    advantages: "Weighs only 3.5 grams; ultra-low power consumption.",
    risks: "Ambient sunlight leakage could saturate the photodiode if optical baffles are imperfect.",
    questions: "Do we need a dark anodized interior or light-absorbent coating?",
    references: "MIT Media Lab particulate sensing whitepaper.",
    authorId: "member-3",
    createdAt: "2025-02-08T16:20:00Z",
    status: "Discussing",
    upvotes: ["member-1", "member-5"],
    comments: [],
  },
  {
    id: "idea-graveyard-1",
    title: "Electrochemical Toxic Gas Sensor Array (PPM Level)",
    problem:
      "High accuracy toxic gas detection required for industrial ammonia leaks.",
    proposedSolution: "Stack four bulky electrochemical 3-electrode sensors.",
    explanation:
      "Electrochemical cells offer high sensitivity to specific hazardous gases like CO and NH3.",
    howItWorks: "Chemical reaction generates pico-amps measured via potentiostat circuits.",
    requiredHardware: "4x 3-electrode electrochemical cells, LMP91000 AFE.",
    requiredSoftware: "Calibration curves.",
    estimatedCost: 110.0,
    advantages: "Extremely high chemical specificity.",
    risks: "Sensors weigh over 80g combined, have limited shelf life (6 months), and cost exceeds entire budget.",
    questions: "Can we source smaller MEMS sensors instead?",
    references: "Alphasense spec sheets.",
    authorId: "member-5",
    createdAt: "2025-02-03T11:00:00Z",
    status: "Rejected",
    upvotes: [],
    comments: [
      {
        id: "comm-archived",
        authorId: "member-6",
        authorName: "Sofia Torres",
        content: "Archived to Idea Graveyard: Sensors exceeded our $150 budget and 50g weight limit. We selected the MEMS Bosch BME688 instead.",
        createdAt: "2025-02-04T12:00:00Z",
      },
    ],
  },
];

export const INITIAL_RESEARCH: ResearchItem[] = [
  {
    id: "res-1",
    title: "ESP32-S3 Deep Sleep Current Profiling & Power Domain Optimization",
    topic: "Power & Microcontrollers",
    summary:
      "In-depth measurement of ESP32-S3 WROOM-1 module power states across RTC slow clock, ULP coprocessor, and wake stubs.",
    keyFindings:
      "Standard deep sleep consumes 22uA. By disabling brownout detector in deep sleep and pulling GPIO hold states high, consumption dropped to 14.8uA. ULP FSM can read I2C gas wake thresholds without waking the main dual Xtensa cores.",
    whatWeLearned:
      "We can keep the node sleeping 98% of the time, extending our 800mAh 1S LiPo battery runtime from 6 hours to 14.5 days.",
    howItHelps:
      "Proves our continuous environmental sensing node can last throughout multi-day emergency rescue operations.",
    sourceUrl: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/system/sleep_modes.html",
    tags: ["Electronics", "Microcontrollers", "Power", "Hardware"],
    authorId: "member-1",
    createdAt: "2025-02-06T11:00:00Z",
    attachments: ["ESP32-S3-Power-Profile-Log.csv"],
    comments: [
      {
        id: "c-r-1",
        authorId: "member-3",
        authorName: "Liam Patel",
        content: "Awesome findings Alex! Let's make sure the flash chip doesn't leak current through VDD_SPI during deep sleep.",
        createdAt: "2025-02-06T15:00:00Z",
      },
    ],
  },
  {
    id: "res-2",
    title: "Bosch BME688 Gas Scanner BSEC 2.0 AI Model on Microcontrollers",
    topic: "Sensors & Edge AI",
    summary:
      "Evaluation of the BME688 4-in-1 gas, temperature, humidity, and barometric pressure sensor using Bosch's BSEC library on ESP32-S3.",
    keyFindings:
      "The sensor's hot-plate temperature stepping (320°C for 150ms) can classify VOC profiles (e.g., wood smoke vs kerosene vs clean air) with 94.2% accuracy using a lightweight 12KB neural net compiled into flash.",
    whatWeLearned:
      "Heater cycle requires 12mA during the 150ms burst. We need a low-ESR 47uF tantalum capacitor near the VDD pin to buffer the voltage drop.",
    howItHelps:
      "Allows the node to distinguish real wildfire smoke from vehicle exhaust or cooking fumes on-device without cloud connectivity.",
    sourceUrl: "https://www.bosch-sensortec.com/products/environmental-sensors/gas-sensors/bme688/",
    tags: ["Sensors", "AI", "Electronics", "IoT"],
    authorId: "member-5",
    createdAt: "2025-02-07T14:30:00Z",
    attachments: ["bme688-datasheet.pdf"],
    comments: [],
  },
  {
    id: "res-3",
    title: "SX1262 LoRa Impedance Matching & PCB Trace Antenna Design",
    topic: "Communication & Hardware",
    summary:
      "Analysis of 50-ohm RF trace geometry for 915 MHz band on standard FR-4 1.6mm 2-layer and 4-layer stackups.",
    keyFindings:
      "A coplanar waveguide with ground (CPW-G) trace of 1.1mm width with 0.3mm gap to ground flood achieves 50.4 ohms impedance on standard JLC 2-layer 1.6mm FR4. Adding pi-filter matching network (1.8nH inductor and two 1.5pF caps) allows tuning VSWR below 1.15.",
    whatWeLearned:
      "Component placement within 5mm of the SX1262 RF output pin is critical to eliminate parasitic capacitive coupling.",
    howItHelps:
      "Ensures our transmission reaches maximum distance with minimal reflected power.",
    sourceUrl: "https://www.semtech.com/products/wireless-rf/lora-core/sx1262",
    tags: ["Communication", "Electronics", "Manufacturing"],
    authorId: "member-2",
    createdAt: "2025-02-08T18:00:00Z",
    attachments: ["pi-filter-simulation.png"],
    comments: [],
  },
];

export const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "sug-1",
    title: "Add a magnetic reed switch or hall-effect sensor for tool-free power activation",
    content:
      "Instead of putting a mechanical push button on the waterproof enclosure that might leak or get pressed accidentally in transit, let's embed an internal reed switch so waving a small magnet over the case powers it up or enters pairing mode.",
    authorId: "member-4",
    createdAt: "2025-02-08T10:00:00Z",
    status: "Accepted",
    supports: ["member-1", "member-2", "member-3", "member-6"],
    comments: [
      {
        id: "cs-1",
        authorId: "member-1",
        authorName: "Alex Rivera",
        content: "Love this. We have two tiny glass reed switches in the component bin. Let's add it to Prototype V2!",
        createdAt: "2025-02-08T11:20:00Z",
      },
    ],
  },
  {
    id: "sug-2",
    title: "Use quick-disconnect JST-GH or Molex PicoBlade connectors for the sensor daughterboard",
    content:
      "Direct soldering wires between the mainboard and the sensor pod makes replacing damaged sensors during field trials a nightmare. A 4-pin JST-GH locking connector weighs under 0.5g and prevents loose pins.",
    authorId: "member-6",
    createdAt: "2025-02-09T08:45:00Z",
    status: "Discussing",
    supports: ["member-2", "member-4"],
    comments: [],
  },
  {
    id: "sug-3",
    title: "Include an onboard buzzer for emergency locator beacon function",
    content:
      "If the drone drops the node in tall grass or brush, a loud 85dB piezo buzzer pulsing every 10 seconds will help recovery teams locate it quickly.",
    authorId: "member-3",
    createdAt: "2025-02-09T13:00:00Z",
    status: "Open",
    supports: ["member-5"],
    comments: [],
  },
];

export const INITIAL_ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    order: 1,
    name: "Problem Understanding",
    description: "Analyze emergency response telemetry gaps and define payload constraints.",
    ownerId: "member-1",
    deadline: "2025-02-04",
    status: "Completed",
    checklist: [
      { id: "c1-1", text: "Interview first responders and wildfire teams", done: true },
      { id: "c1-2", text: "Establish maximum payload weight (50 grams)", done: true },
      { id: "c1-3", text: "Determine battery life target (72+ hours)", done: true },
    ],
    notes: "Target: 50g weight limit, sub-GHz transmission, under $150 bill of materials.",
  },
  {
    id: "stage-2",
    order: 2,
    name: "Research & Benchmarking",
    description: "Datasheet studies, radio regulations (FCC 915MHz), sensor evaluation.",
    ownerId: "member-2",
    deadline: "2025-02-08",
    status: "Completed",
    checklist: [
      { id: "c2-1", text: "Compare ESP32-S3 vs nRF52840 vs STM32", done: true },
      { id: "c2-2", text: "Review Bosch BME688 AI gas scanner accuracy", done: true },
      { id: "c2-3", text: "Test SX1262 LoRa range in urban/forest conditions", done: true },
    ],
    notes: "ESP32-S3 selected due to dual core, FreeRTOS, and vector instructions for TinyML.",
  },
  {
    id: "stage-3",
    order: 3,
    name: "Ideation & Architecture",
    description: "Brainstorming modular pods, power harvesting, and mesh protocol.",
    ownerId: "member-3",
    deadline: "2025-02-12",
    status: "Completed",
    checklist: [
      { id: "c3-1", text: "Submit and review Vault ideas", done: true },
      { id: "c3-2", text: "Select venturi intake airflow concept", done: true },
      { id: "c3-3", text: "Draft system block diagram and power architecture", done: true },
    ],
  },
  {
    id: "stage-4",
    order: 4,
    name: "Solution Selection & ADRs",
    description: "Formalize Architectural Decision Records (ADRs) for hardware components.",
    ownerId: "member-6",
    deadline: "2025-02-15",
    status: "Completed",
    checklist: [
      { id: "c4-1", text: "Record Decision #01: ESP32-S3 processor", done: true },
      { id: "c4-2", text: "Record Decision #02: I2C 400kHz sensor bus", done: true },
      { id: "c4-3", text: "Approve BOM and budget allocation", done: true },
    ],
  },
  {
    id: "stage-5",
    order: 5,
    name: "System Design & Schematics",
    description: "KiCad schematic capture, power distribution network, pinout allocation.",
    ownerId: "member-2",
    deadline: "2025-02-18",
    status: "Completed",
    checklist: [
      { id: "c5-1", text: "Complete ESP32-S3 minimum operating circuit", done: true },
      { id: "c5-2", text: "Design 3.3V ultra-low quiescent LDO regulator", done: true },
      { id: "c5-3", text: "Generate bill of materials and check supplier stock", done: true },
    ],
  },
  {
    id: "stage-6",
    order: 6,
    name: "Component Sourcing",
    description: "Procure and verify components, inspect pinouts, organize inventory.",
    ownerId: "member-6",
    deadline: "2025-02-21",
    status: "Completed",
    checklist: [
      { id: "c6-1", text: "Order ESP32-S3 modules and SX1262 boards", done: true },
      { id: "c6-2", text: "Inspect BME688 breakouts under microscope", done: true },
      { id: "c6-3", text: "Log storage bins and prices in Inventory", done: true },
    ],
  },
  {
    id: "stage-7",
    order: 7,
    name: "Prototype V1 (Breadboard / Perfboard)",
    description: "Assemble first working circuit, verify basic sensor I2C communication.",
    ownerId: "member-1",
    deadline: "2025-02-25",
    status: "Completed",
    checklist: [
      { id: "c7-1", text: "Solder jumper headers and power rails", done: true },
      { id: "c7-2", text: "Verify 3.3V rail ripple with oscilloscope", done: true },
      { id: "c7-3", text: "Transmit first mock telemetry packet over LoRa", done: true },
    ],
  },
  {
    id: "stage-8",
    order: 8,
    name: "Testing & Validation (Exp Lab)",
    description: "Run formal experiments on sleep current, radio range, and gas response.",
    ownerId: "member-5",
    deadline: "2025-03-01",
    status: "In Progress",
    checklist: [
      { id: "c8-1", text: "Exp #01: Deep sleep current profiling", done: true },
      { id: "c8-2", text: "Exp #02: BME688 heater humidity stress test", done: true },
      { id: "c8-3", text: "Exp #03: RF line of sight packet loss test", done: false },
    ],
    notes: "Exp #02 identified heater calibration issues; fix applied in firmware v0.4.",
  },
  {
    id: "stage-9",
    order: 9,
    name: "Prototype V2 (Milled PCB & Enclosure)",
    description: "Compact form-factor assembly with 3D printed aerodynamic enclosure.",
    ownerId: "member-4",
    deadline: "2025-03-05",
    status: "In Progress",
    checklist: [
      { id: "c9-1", text: "Mill 2-layer compact PCB on desktop CNC", done: true },
      { id: "c9-2", text: "3D print PETG venturi nosecone enclosure", done: true },
      { id: "c9-3", text: "Assembly and vibration test on drone mount", done: false },
    ],
  },
  {
    id: "stage-10",
    order: 10,
    name: "Integration & Flight Trial",
    description: "Mount payload onto drone and perform simulated gas plume detection run.",
    ownerId: "member-1",
    deadline: "2025-03-09",
    status: "Pending",
    checklist: [
      { id: "c10-1", text: "Verify magnetic latch and drone vibration dampening", done: false },
      { id: "c10-2", text: "Execute 15-minute autonomous survey flight", done: false },
      { id: "c10-3", text: "Validate live ground-station packet telemetry", done: false },
    ],
  },
  {
    id: "stage-11",
    order: 11,
    name: "Final Optimization & Polish",
    description: "Weight trimming, conformal coating for weather resistance, packaging.",
    ownerId: "member-4",
    deadline: "2025-03-12",
    status: "Pending",
    checklist: [
      { id: "c11-1", text: "Apply silicone conformal coating to PCB", done: false },
      { id: "c11-2", text: "Final weight check (target <= 45g)", done: false },
    ],
  },
  {
    id: "stage-12",
    order: 12,
    name: "Documentation & Presentation",
    description: "Complete schematics, bill of materials, demo video, and slide deck.",
    ownerId: "member-3",
    deadline: "2025-03-14",
    status: "Pending",
    checklist: [
      { id: "c12-1", text: "Generate high-res wiring diagrams and pinout sheets", done: false },
      { id: "c12-2", text: "Record 2-minute live hardware demonstration video", done: false },
      { id: "c12-3", text: "Prepare judges technical slide deck", done: false },
    ],
  },
  {
    id: "stage-13",
    order: 13,
    name: "Submission & Live Defense",
    description: "Final project submission to hackathon portal and judging Q&A.",
    ownerId: "member-6",
    deadline: "2025-03-15",
    status: "Pending",
    checklist: [
      { id: "c13-1", text: "Upload code to GitHub repository with open-source license", done: false },
      { id: "c13-2", text: "Submit final bill of materials and test logs", done: false },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Implement FreeRTOS low-power tickless idle on ESP32-S3",
    description: "Configure FreeRTOS configUSE_TICKLESS_IDLE to automatically drop MCU into light sleep between sensor polling cycles.",
    assigneeId: "member-1",
    priority: "High",
    status: "IN PROGRESS",
    deadline: "2025-02-12",
    checklist: [
      { id: "tk1-1", text: "Set sdkconfig tickless idle option", done: true },
      { id: "tk1-2", text: "Measure 80MHz CPU drop down to 10MHz", done: false },
      { id: "tk1-3", text: "Test I2C clock sync recovery", done: false },
    ],
    relatedProjectId: "proj-aeropulse",
    relatedIdeaId: "idea-2",
    comments: [],
    createdAt: "2025-02-07T09:00:00Z",
  },
  {
    id: "task-2",
    title: "Route 50-ohm RF trace and pi-filter on Prototype V2 PCB",
    description: "Use coplanar waveguide geometry to route antenna signal from SX1262 pin 22 to the U.FL connector.",
    assigneeId: "member-2",
    priority: "Critical",
    status: "TODO",
    deadline: "2025-02-11",
    checklist: [
      { id: "tk2-1", text: "Calculate trace width for 1.6mm FR4", done: true },
      { id: "tk2-2", text: "Place ground vias along RF trace shield", done: false },
      { id: "tk2-3", text: "Run KiCad DRC check", done: false },
    ],
    relatedProjectId: "proj-aeropulse",
    comments: [],
    createdAt: "2025-02-08T11:00:00Z",
  },
  {
    id: "task-3",
    title: "3D Print Venturi Nosecone with 0.12mm layer height in PETG",
    description: "Fabricate aerodynamic air sampling nozzle on Bambu Lab X1C with 100% infill for airtight walls.",
    assigneeId: "member-4",
    priority: "High",
    status: "IN PROGRESS",
    deadline: "2025-02-10",
    checklist: [
      { id: "tk3-1", text: "Export STL with high mesh resolution", done: true },
      { id: "tk3-2", text: "Dry PETG filament 6 hours at 65C", done: true },
      { id: "tk3-3", text: "Print and inspect internal venturi diameter", done: false },
    ],
    relatedIdeaId: "idea-1",
    comments: [],
    createdAt: "2025-02-08T13:30:00Z",
  },
  {
    id: "task-4",
    title: "Train TinyML gas classifier on wood smoke and gasoline fumes",
    description: "Capture 15 minutes of BME688 multi-channel resistance data in Edge Impulse and train an 8-bit quantized classifier.",
    assigneeId: "member-5",
    priority: "Medium",
    status: "REVIEW",
    deadline: "2025-02-13",
    checklist: [
      { id: "tk4-1", text: "Log 50 samples of clean ambient air", done: true },
      { id: "tk4-2", text: "Log 50 samples of smoky air near candle test chamber", done: true },
      { id: "tk4-3", text: "Export C++ static inference library", done: true },
    ],
    relatedProjectId: "proj-aeropulse",
    comments: [],
    createdAt: "2025-02-06T14:00:00Z",
  },
  {
    id: "task-5",
    title: "Calibrate bench power supply and oscilloscope for current shunt",
    description: "Set up INA226 0.1% current shunt amplifier to measure microamp spikes on the ESP32 power line.",
    assigneeId: "member-6",
    priority: "Medium",
    status: "DONE",
    deadline: "2025-02-06",
    checklist: [
      { id: "tk5-1", text: "Calibrate zero offset on Siglent scope", done: true },
      { id: "tk5-2", text: "Validate against Keithley reference multimeter", done: true },
    ],
    relatedExperimentId: "exp-1",
    comments: [],
    createdAt: "2025-02-05T10:00:00Z",
  },
  {
    id: "task-6",
    title: "Write LoRa packet deserializer in Python for Ground Station",
    description: "Create lightweight terminal dashboard in Python using Rich to display live incoming telemetry.",
    assigneeId: "member-3",
    priority: "Low",
    status: "BACKLOG",
    deadline: "2025-02-16",
    checklist: [
      { id: "tk6-1", text: "Parse binary struct with unpack", done: false },
      { id: "tk6-2", text: "Display temperature, pressure, gas index, RSSI", done: false },
    ],
    comments: [],
    createdAt: "2025-02-08T17:00:00Z",
  },
];

export const INITIAL_COMPONENTS: ComponentItem[] = [
  {
    id: "comp-1",
    name: "ESP32-S3-WROOM-1 (8MB Flash, 2MB PSRAM)",
    category: "Microcontroller",
    quantityRequired: 3,
    quantityAvailable: 3,
    status: "Available",
    estimatedPrice: 3.8,
    actualPrice: 3.75,
    supplier: "Mouser Electronics",
    link: "https://www.mouser.com/ProductDetail/Espressif-Systems/ESP32-S3-WROOM-1-N8R2",
    purchasedById: "member-1",
    storageLocation: "ESD Bin A-04",
    notes: "Dual core Xtensa, integrated 2.4GHz Wi-Fi + BLE 5.0.",
    createdAt: "2025-02-02",
  },
  {
    id: "comp-2",
    name: "Bosch BME688 Digital Gas & Environmental Sensor Breakout",
    category: "Sensor",
    quantityRequired: 2,
    quantityAvailable: 2,
    status: "Available",
    estimatedPrice: 19.5,
    actualPrice: 19.95,
    supplier: "Adafruit",
    link: "https://www.adafruit.com/product/5046",
    purchasedById: "member-5",
    storageLocation: "Sensor Cabinet B-02",
    notes: "Includes AI gas scanning hotplate, VOC, VSC, humidity, temp, barometric pressure.",
    createdAt: "2025-02-02",
  },
  {
    id: "comp-3",
    name: "Semtech SX1262 LoRa 915MHz Wireless Transceiver Module",
    category: "Communication",
    quantityRequired: 3,
    quantityAvailable: 1, // WARNING: Required > Available!
    status: "Ordered",
    estimatedPrice: 9.0,
    actualPrice: 8.8,
    supplier: "DigiKey",
    link: "https://www.digikey.com",
    purchasedById: "member-2",
    storageLocation: "In Transit (FedEx #789012)",
    notes: "1 module on hand for Prototype V1, 2 more arriving Wednesday for mesh tests.",
    createdAt: "2025-02-03",
  },
  {
    id: "comp-4",
    name: "Texas Instruments TPS7A02 200mA Ultra-Low Iq LDO (3.3V)",
    category: "Power",
    quantityRequired: 6,
    quantityAvailable: 10,
    status: "Available",
    estimatedPrice: 0.85,
    actualPrice: 0.72,
    supplier: "Mouser",
    link: "https://www.mouser.com",
    purchasedById: "member-2",
    storageLocation: "Tape Reel Rack C-11",
    notes: "Quiescent current Iq = 25nA! Ideal for battery life.",
    createdAt: "2025-02-04",
  },
  {
    id: "comp-5",
    name: "EEMB 3.7V 800mAh 1S LiPo Battery Pack with Protection Circuit",
    category: "Power",
    quantityRequired: 4,
    quantityAvailable: 2, // WARNING: Required > Available!
    status: "Searching",
    estimatedPrice: 7.5,
    actualPrice: 0.0,
    supplier: "Amazon / Local Hobby Shop",
    link: "https://www.amazon.com",
    purchasedById: "member-6",
    storageLocation: "LiPo Fire-Safe Battery Box 1",
    notes: "Need 2 more units for continuous flight swap testing.",
    createdAt: "2025-02-05",
  },
  {
    id: "comp-6",
    name: "Molex PicoBlade 4-Pin Wire Assembly (1.25mm Pitch)",
    category: "Passive",
    quantityRequired: 5,
    quantityAvailable: 12,
    status: "Available",
    estimatedPrice: 1.2,
    actualPrice: 0.95,
    supplier: "DigiKey",
    link: "https://www.digikey.com",
    purchasedById: "member-4",
    storageLocation: "Cable Bin D-01",
    notes: "Pre-crimped leads for sensor daughterboard disconnect.",
    createdAt: "2025-02-05",
  },
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: "exp-1",
    experimentNumber: "EXP-01",
    title: "ESP32-S3 Deep Sleep Current Verification with Disabled Brownout Detector",
    objective: "Verify whether deep sleep current matches the theoretical target under 20uA on our custom power rail.",
    hypothesis:
      "Disabling the internal brownout detector and floating RTC GPIOs during sleep will decrease quiescent current from 28uA to below 18uA without risking brownout lockup upon 3.3V wake.",
    setup:
      "ESP32-S3 development board powered from 3.7V LiPo stepped down through TI TPS7A02 LDO. Current monitored via 1-ohm 0.1% precision shunt resistor connected to a high-speed digital multimeter with 100ksps averaging.",
    componentsUsed: ["ESP32-S3", "TPS7A02 LDO", "1-ohm Shunt Resistor", "3.7V LiPo 800mAh"],
    expectedResult: "Current draw during deep sleep < 20uA.",
    actualResult: "Measured steady-state deep sleep current: 16.2uA! Peak wake burst is 112mA for 12ms during radio init.",
    measurements: "Sleep: 16.2uA, Active Idle: 19.4mA, TX burst: 112mA @ 14dBm.",
    problems: "None. System resumed cleanly every 60 seconds from RTC timer wake.",
    conclusion: "Hypothesis confirmed. Low-power sleep target is officially validated.",
    status: "Successful",
    mediaUrls: [],
    nextExperiment: "EXP-02",
    contributorId: "member-1",
    createdAt: "2025-02-06T16:00:00Z",
  },
  {
    id: "exp-2",
    experimentNumber: "EXP-02",
    title: "BME688 AI Gas Sensor Hotplate Pulse Under 90% Relative Humidity",
    objective: "Test whether extreme humidity causes heater drift or false VOC alerts.",
    hypothesis:
      "High humidity will introduce excessive thermal cooling on the MEMS hotplate, causing temperature control oscillation and false smoke classifications.",
    setup:
      "Sealed chamber with ultrasonic humidifier raising chamber to 92% RH at 24°C. BME688 running 320°C heater profile for 150ms steps.",
    componentsUsed: ["BME688", "AeroPulse Chamber V0", "SHT40 Reference Hygrometer"],
    expectedResult: "Sensor maintains +/- 5°C heater stability and correctly identifies clean moist air.",
    actualResult:
      "FAILED: Hotplate temperature dropped by 34°C during humid bursts. BSEC software reported false positive 'Combustion Products' due to cooling curve distortion.",
    measurements: "Target: 320°C, Measured: 286°C, Error: -10.6%, False positive trigger rate: 85%.",
    problems:
      "Condensation micro-droplets on the MEMS hotplate mesh caused severe heat sinking. Sensor cannot be used in open moist air without hydrophobic membrane.",
    conclusion:
      "Critical finding: We must incorporate a PTFE hydrophobic vent membrane (e.g. Gore automotive vent) over the gas intake to block droplets while allowing gas diffusion.",
    status: "Failed",
    mediaUrls: [],
    nextExperiment: "EXP-04: Hydrophobic PTFE Vent Gas Response",
    contributorId: "member-5",
    createdAt: "2025-02-07T18:30:00Z",
  },
  {
    id: "exp-3",
    experimentNumber: "EXP-03",
    title: "SX1262 LoRa 915MHz Packet Reception Rate vs Flight Speed Simulation",
    objective: "Determine packet error rate (PER) when node is moving at 15 m/s simulating drone patrol.",
    hypothesis: "Doppler shift at 915MHz and 15 m/s will be under 50 Hz, well within the receiver AFC lock range.",
    setup: "Mobile transmitter mounted on vehicle roof driving at 50 km/h, stationary ground gateway with dipole antenna.",
    componentsUsed: ["SX1262 LoRa", "915MHz dipole antenna", "ESP32-S3"],
    expectedResult: "PER < 2% at 2km distance.",
    actualResult: "In progress. Initial stationary tests show 0% packet loss at 1.8km line-of-sight.",
    measurements: "Stationary RSSI: -92 dBm, SNR: +8.5 dB. Mobile drive test scheduled for Saturday.",
    problems: "Awaiting second receiver module from delivery.",
    conclusion: "Currently running.",
    status: "Running",
    mediaUrls: [],
    contributorId: "member-2",
    createdAt: "2025-02-08T12:00:00Z",
  },
];

export const INITIAL_PROTOTYPES: PrototypeVersion[] = [
  {
    id: "proto-v0",
    version: "Prototype V0 (Benchtop Breadboard)",
    date: "2025-02-03",
    objective: "Validate basic component electrical compatibility and pinout allocations.",
    changes: "Initial wiring setup with jumper cables on standard 830-point solderless breadboard.",
    components: ["ESP32-S3 DevKit", "BME688 Breakout", "SX1262 Dev Board", "Bench DC Supply"],
    designFiles: ["v0_breadboard_schematic.png"],
    photos: ["https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80"],
    testResults: "I2C scanner detected BME688 at address 0x77. SPI communication with SX1262 verified.",
    problems: "Excessive electrical noise on I2C bus due to long 20cm jumper wires. Intermittent NACK errors.",
    improvements: "Shorten lead lengths to under 5cm; add 4.7k pullups on SDA and SCL.",
    status: "Superseded",
  },
  {
    id: "proto-v1",
    version: "Prototype V1 (Perfboard & Laser-Cut Sled)",
    date: "2025-02-06",
    objective: "First integrated physical assembly capable of untethered battery operation.",
    changes: "Soldered point-to-point wiring on double-sided FR4 perfboard with JST battery connector.",
    components: ["ESP32-S3", "BME688", "SX1262", "TPS7A02 LDO", "800mAh 1S LiPo", "Acrylic Sled"],
    designFiles: ["v1_perfboard_layout.pdf", "v1_mounting_sled.dxf"],
    photos: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"],
    testResults: "Ran continuously for 48 hours in test chamber transmitting packets every 2 minutes.",
    problems: "Total weight came out to 62 grams (exceeding 50g target). Acrylic sled cracked on drop test.",
    improvements: "Replace acrylic with 3D printed PETG lattice; design custom 2-layer PCB to eliminate heavy wire harness.",
    status: "Verified",
  },
  {
    id: "proto-v2",
    version: "Prototype V2 (Milled Custom PCB & Aerodynamic Pod)",
    date: "2025-02-10",
    objective: "Production-grade compact form factor under 42 grams with integrated venturi air nozzle.",
    changes: "Custom 2-layer surface-mount PCB (42mm x 32mm) with snap-fit snap-in enclosure.",
    components: ["Custom SMD PCB", "ESP32-S3-WROOM-1", "BME688 SMD", "SX1262 SMD", "PETG Enclosure"],
    designFiles: ["aeropulse_v2_gerbers.zip", "venturi_enclosure_v2.step"],
    photos: ["https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80"],
    testResults: "PCB fabricated and assembled. Total assembly weight: 38.6 grams with battery (below target!).",
    problems: "Currently undergoing bench vibration and thermal dissipation testing.",
    improvements: "Optimize antenna clearance on drone frame.",
    status: "Fabricating",
  },
];

export const INITIAL_DECISIONS: DecisionRecord[] = [
  {
    id: "dec-1",
    decisionNumber: "ADR-01",
    title: "Select ESP32-S3 over STM32WB55 for Core Processing",
    decision: "Adopt Espressif ESP32-S3 dual-core microcontroller as the primary computing platform.",
    reason:
      "ESP32-S3 provides dedicated vector instructions for TinyML inference, generous 512KB SRAM + 8MB flash, native USB-OTG for fast firmware flashing, and mature FreeRTOS support with active open-source community.",
    alternatives:
      "STM32WB55 (lower power but complex toolchain, less RAM), Raspberry Pi Pico W (lacks hardware crypto, higher sleep power).",
    decisionMadeBy: "Unanimous Team Agreement (6/6)",
    date: "2025-02-04",
    status: "Accepted",
    comments: [],
  },
  {
    id: "dec-2",
    decisionNumber: "ADR-02",
    title: "Standardize on 400kHz Fast-Mode I2C Bus with 4.7kΩ Pull-Ups",
    decision: "Run sensor communication bus at 400kHz Fast-Mode with dedicated external 4.7kΩ pull-up resistors.",
    reason:
      "Internal ESP32 pull-ups (~45kΩ) result in slow signal rise times that round off clock edges over ribbon cables, causing I2C bus lockups. Dedicated 4.7kΩ resistors yield sharp square waves at 3.3V.",
    alternatives: "Standard Mode 100kHz (too slow for high-resolution gas ADC sampling), 1MHz Fast-Mode Plus (susceptible to crosstalk).",
    decisionMadeBy: "Maya Chen & Alex Rivera",
    date: "2025-02-05",
    status: "Accepted",
    comments: [],
  },
  {
    id: "dec-3",
    decisionNumber: "ADR-03",
    title: "Adopt Sub-GHz 915MHz LoRa Rather than 2.4GHz Wi-Fi Telemetry",
    decision: "Use SX1262 LoRa modulation on the North American 915MHz ISM band as primary telemetry link.",
    reason:
      "915MHz penetrates tree foliage and smoke particulate significantly better than 2.4GHz, and achieves 10x the operational range with under 50mW transmission power.",
    alternatives: "2.4GHz ESP-NOW (range limited to ~300m in open air), Cellular LTE-M (requires SIM card, useless in disaster blackout zones).",
    decisionMadeBy: "Unanimous Team Agreement (6/6)",
    date: "2025-02-06",
    status: "Accepted",
    comments: [],
  },
];

export const INITIAL_WIKI_ARTICLES: WikiArticle[] = [
  {
    id: "wiki-1",
    title: "ESP32-S3 Hardware Pinout, Boot Strapping, & Reserved Pins",
    category: "Microcontrollers",
    content: `### ESP32-S3 Pinout & Hardware Rules

When designing schematics or soldering breadboards, NEVER use these pins for general I/O:

* **GPIO0**: Boot mode strap. Must be HIGH during boot for normal execution.
* **GPIO45**: VDD_SPI power domain voltage strap.
* **GPIO46**: ROM code log print strap. Must be LOW to suppress debug chatter.
* **GPIO19 / GPIO20**: Native USB D- / D+ pins for hardware debugging.

#### Recommended Pin Assignment for AeroPulse:
| Function | Pin | Notes |
| :--- | :--- | :--- |
| I2C SDA | GPIO8 | 4.7kΩ pullup to 3.3V |
| I2C SCL | GPIO9 | 4.7kΩ pullup to 3.3V |
| LoRa NSS (CS) | GPIO10 | Dedicated SPI CS |
| LoRa SCK | GPIO12 | SPI Clock |
| LoRa MOSI | GPIO11 | Master Out |
| LoRa MISO | GPIO13 | Master In |
| LoRa DIO1 | GPIO14 | Hardware Interrupt |
| LoRa BUSY | GPIO21 | High when internal PLL active |
| Magnetic Reed | GPIO4 | Configured with internal pullup + RTC wake |
`,
    tags: ["ESP32", "Pinout", "Hardware", "Schematic"],
    authorId: "member-1",
    updatedAt: "2025-02-06",
  },
  {
    id: "wiki-2",
    title: "Battery Life & Power Budget Calculator Formula",
    category: "Power",
    content: `### Power Budget & Battery Longevity Calculations

To determine node runtime on a single charge:

$$I_{\\text{average}} = (I_{\\text{active}} \\times D) + (I_{\\text{sleep}} \\times (1 - D))$$

Where:
* $D$ is the duty cycle ratio: $t_{\\text{active}} / (t_{\\text{active}} + t_{\\text{sleep}})$
* $I_{\\text{active}} = 45\\text{ mA}$ (CPU + BME688 heater burst + LoRa TX)
* $t_{\\text{active}} = 0.5\\text{ seconds}$
* $t_{\\text{sleep}} = 120\\text{ seconds}$ (2 minute reporting cycle)
* $I_{\\text{sleep}} = 16.2\\text{ }\\mu\\text{A} = 0.0162\\text{ mA}$

#### Calculated Values:
* Duty Cycle $D = 0.5 / 120.5 = 0.00415$ ($0.415\\%$)
* $I_{\\text{average}} = (45 \\times 0.00415) + (0.0162 \\times 0.99585) = 0.1867 + 0.0161 = 0.2028\\text{ mA}$

On an **800 mAh** battery (with 80% usable safety margin = 640 mAh):
$$\\text{Runtime} = \\frac{640\\text{ mAh}}{0.2028\\text{ mA}} = 3,155\\text{ hours} \\approx 131\\text{ days!}$$

Even under heavy 10-second polling during active alarms, the node provides over **142 hours of continuous operation**.
`,
    tags: ["Power", "Battery", "Calculations", "LiPo"],
    authorId: "member-3",
    updatedAt: "2025-02-07",
  },
  {
    id: "wiki-3",
    title: "3D Printing High-Strength Enclosures for Drone Mounting",
    category: "Mechanical",
    content: `### PETG & Carbon Fiber Filament Guidelines

For drone-mounted sensor nodes that must withstand 35 km/h airflow and accidental impacts:

1. **Material Choice**:
   * **Do NOT use PLA**: Melts or softens inside hot parked cars or direct sunlight (> 50°C).
   * **Use PETG or ASA**: Superior UV resistance, chemical resilience against battery electrolyte, and glass transition temperature > 75°C.

2. **Slicer Settings for Waterproof / Airtight Nozzles**:
   * Wall line count: 4 walls (ensures zero pinhole leaks in the venturi tube).
   * Infill: 30% Gyroid (isotropic strength under torsional drone vibration).
   * Layer height: 0.16mm for outer shell, 0.12mm for internal venturi throat.

3. **Fasteners**:
   * Use **M2 and M2.5 brass heat-set threaded inserts** (Ruthex style).
   * Drill pilot holes at 3.2mm diameter for M2 brass inserts; insert with soldering iron at 220°C.
`,
    tags: ["Mechanical", "3D Printing", "CAD", "Enclosure"],
    authorId: "member-4",
    updatedAt: "2025-02-08",
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    channelId: "general",
    senderId: "member-1",
    content: "Team, welcome to Byte Builders HQ! All 6 workstations are synced. Let's build something unforgettable.",
    timestamp: "2025-02-06T09:00:00Z",
    reactions: [
      { emoji: "🚀", users: ["member-2", "member-3", "member-4", "member-5", "member-6"] },
      { emoji: "⚡", users: ["member-2", "member-3"] },
    ],
  },
  {
    id: "msg-2",
    channelId: "general",
    senderId: "member-2",
    content: "Schematic review for Prototype V2 is complete. 50-ohm RF trace is matched. Milling the board now.",
    timestamp: "2025-02-07T14:10:00Z",
    reactions: [{ emoji: "🔥", users: ["member-1", "member-4"] }],
  },
  {
    id: "msg-3",
    channelId: "hardware",
    senderId: "member-4",
    content: "The 3D printed venturi nosecone just came off the build plate! Layer lines look super smooth. I'm bringing it to the lab at 4 PM.",
    timestamp: "2025-02-08T11:45:00Z",
    reactions: [{ emoji: "👏", users: ["member-1", "member-2", "member-5"] }],
  },
  {
    id: "msg-4",
    channelId: "hardware",
    senderId: "member-5",
    content: "Awesome Elena! I have the BME688 sensor calibrated with the BSEC 2.0 library ready for the snap-fit test.",
    timestamp: "2025-02-08T12:00:00Z",
    reactions: [],
  },
  {
    id: "msg-5",
    channelId: "general",
    senderId: "member-6",
    content: "Component status update: DigiKey confirmed the SX1262 replacement modules are out for delivery today. We are in great shape for weekend field trials.",
    timestamp: "2025-02-08T14:20:00Z",
    reactions: [{ emoji: "🙌", users: ["member-1", "member-2", "member-3"] }],
  },
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: "act-1",
    type: "prototype",
    description: "Elena updated Prototype V2 status to 'Fabricating' with 38.6g weight verification.",
    memberId: "member-4",
    timestamp: "2025-02-08T15:30:00Z",
    linkTab: "prototypes",
    linkId: "proto-v2",
  },
  {
    id: "act-2",
    type: "experiment",
    description: "Marcus logged EXP-02: Humidity stress test on BME688 gas scanner.",
    memberId: "member-5",
    timestamp: "2025-02-07T18:30:00Z",
    linkTab: "experiments",
    linkId: "exp-2",
  },
  {
    id: "act-3",
    type: "task",
    description: "Sofia marked task 'Calibrate bench power supply and current shunt' as DONE.",
    memberId: "member-6",
    timestamp: "2025-02-06T17:15:00Z",
    linkTab: "tasks",
    linkId: "task-5",
  },
  {
    id: "act-4",
    type: "idea",
    description: "Maya submitted idea: Dual-Chamber Modular Gas Sensor Pod with Venturi Airflow.",
    memberId: "member-2",
    timestamp: "2025-02-06T10:30:00Z",
    linkTab: "ideas",
    linkId: "idea-1",
  },
  {
    id: "act-5",
    type: "achievement",
    description: "Achievement unlocked: 'First Circuit Powered Up' with zero smoke!",
    memberId: "member-1",
    timestamp: "2025-02-05T19:00:00Z",
    linkTab: "achievements",
  },
];

export const INITIAL_EXPENSES: BudgetExpense[] = [
  {
    id: "exp-item-1",
    item: "ESP32-S3-WROOM-1 Microcontrollers (Qty 3)",
    category: "Microcontrollers",
    quantity: 3,
    cost: 11.25,
    date: "2025-02-02",
    purchasedById: "member-1",
    notes: "Direct from Mouser Electronics.",
  },
  {
    id: "exp-item-2",
    item: "Bosch BME688 Environmental Sensor Breakouts (Qty 2)",
    category: "Sensors",
    quantity: 2,
    cost: 39.9,
    date: "2025-02-02",
    purchasedById: "member-5",
    notes: "Adafruit STEMMA QT edition.",
  },
  {
    id: "exp-item-3",
    item: "Semtech SX1262 LoRa 915MHz Transceivers (Qty 3)",
    category: "Communication",
    quantity: 3,
    cost: 26.4,
    date: "2025-02-03",
    purchasedById: "member-2",
    notes: "DigiKey order #4582910.",
  },
  {
    id: "exp-item-4",
    item: "PETG High-Toughness 3D Printing Filament (1kg Spool)",
    category: "Materials",
    quantity: 1,
    cost: 19.99,
    date: "2025-02-04",
    purchasedById: "member-4",
    notes: "Polymaker PolyLite PETG in Signal Orange.",
  },
  {
    id: "exp-item-5",
    item: "Texas Instruments TPS7A02 LDO Regulators & Passives Pack",
    category: "Components",
    quantity: 10,
    cost: 7.2,
    date: "2025-02-04",
    purchasedById: "member-2",
    notes: "Surface-mount SOT-23 packages.",
  },
];

export const INITIAL_ACHIEVEMENTS: TeamAchievement[] = [
  {
    id: "ach-1",
    title: "Team Formed & Assembled",
    description: "Byte Builders official workspace initialized with all 6 hardware innovators ready.",
    unlockedAt: "2025-02-01",
    icon: "Users",
    addedById: "member-1",
  },
  {
    id: "ach-2",
    title: "Problem Understood & Spec Locked",
    description: "Defined 50g max payload and 72-hour off-grid sensor node requirements.",
    unlockedAt: "2025-02-04",
    icon: "Target",
    addedById: "member-3",
  },
  {
    id: "ach-3",
    title: "First Circuit Powered (Zero Smoke)",
    description: "Successfully powered 3.3V power rails on bench without magic blue smoke.",
    unlockedAt: "2025-02-05",
    icon: "Zap",
    addedById: "member-2",
  },
  {
    id: "ach-4",
    title: "Sub-20uA Deep Sleep Barrier Broken",
    description: "Measured 16.2uA deep sleep on ESP32-S3, proving multi-week battery endurance.",
    unlockedAt: "2025-02-06",
    icon: "BatteryCharging",
    addedById: "member-1",
  },
  {
    id: "ach-5",
    title: "First Over-the-Air LoRa Packet",
    description: "Received sensor payload across 1.8km line-of-sight with +8.5dB SNR.",
    unlockedAt: "2025-02-08",
    icon: "Radio",
    addedById: "member-2",
  },
];

export const INITIAL_FILES: ProjectFile[] = [
  {
    id: "file-1",
    name: "aeropulse_system_schematic_v2.pdf",
    category: "Circuits",
    size: "1.4 MB",
    url: "#",
    uploadedById: "member-2",
    uploadedAt: "2025-02-07",
    relatedEntityId: "proj-aeropulse",
  },
  {
    id: "file-2",
    name: "venturi_sampling_nozzle_v2.step",
    category: "CAD",
    size: "4.8 MB",
    url: "#",
    uploadedById: "member-4",
    uploadedAt: "2025-02-08",
    relatedEntityId: "idea-1",
  },
  {
    id: "file-3",
    name: "bme688_environmental_datasheet.pdf",
    category: "Datasheets",
    size: "2.1 MB",
    url: "https://www.bosch-sensortec.com",
    uploadedById: "member-5",
    uploadedAt: "2025-02-05",
  },
  {
    id: "file-4",
    name: "esp32s3_tinyml_firmware_v0.4.zip",
    category: "Code",
    size: "3.2 MB",
    url: "#",
    uploadedById: "member-1",
    uploadedAt: "2025-02-08",
  },
];

export const INITIAL_NOTIFICATIONS: TeamNotification[] = [
  {
    id: "notif-1",
    title: "Component Arrival Alert",
    message: "SX1262 LoRa modules are arriving today from DigiKey.",
    timestamp: "2025-02-08T14:20:00Z",
    read: false,
    linkTab: "components",
  },
  {
    id: "notif-2",
    title: "New Experiment Logged",
    message: "Marcus logged EXP-02 results in the Experiment Lab.",
    timestamp: "2025-02-07T18:30:00Z",
    read: true,
    linkTab: "experiments",
  },
  {
    id: "notif-3",
    title: "Suggestion Approved",
    message: "Magnetic reed switch suggestion accepted for Prototype V2.",
    timestamp: "2025-02-08T11:20:00Z",
    read: true,
    linkTab: "suggestions",
  },
];
