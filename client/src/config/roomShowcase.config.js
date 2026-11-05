/**
 * Architectural Interior Room Showcase Configuration
 * High-definition photorealistic interior photography and telemetry for campus spaces,
 * matching the luxury digital twin experience from the reference video (e.g. The Solenne).
 */

export const ROOM_SHOWCASE_CONFIG = {
  // --- Block A (Main Courtyard Complex) ---
  'MB-101': {
    id: 'MB-101',
    name: 'CS-101 (Data Structures & Algorithms)',
    code: 'CS-101',
    floorLevel: 1,
    floorName: 'Floor 1 - Computer Science & Grand Atrium',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Computer Science & Engineering',
    category: 'Tiered Smart Lecture Theater',
    capacity: 72,
    areaSqFt: '2,400 SF',
    temperature: '23.5°C',
    powerDrawKw: 14.8,
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=85',
    description: 'State-of-the-art amphitheater lecture hall featuring curved acoustic oak paneling, dual 4K laser projection arrays, and collaborative tiered seating.',
    features: ['Dual 4K Laser Projection', 'Acoustic Wood Paneling', 'Smart Occupancy Sensors', 'Direct Atrium Terrace Access']
  },
  'MB-102': {
    id: 'MB-102',
    name: 'CS-102 (Operating Systems & Kernels)',
    code: 'CS-102',
    floorLevel: 1,
    floorName: 'Floor 1 - Computer Science & Grand Atrium',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Computer Science & Engineering',
    category: 'Advanced Systems Lab',
    capacity: 60,
    areaSqFt: '2,100 SF',
    temperature: '22.8°C',
    powerDrawKw: 18.2,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=85',
    description: 'High-performance computing laboratory configured with Linux kernel compile clusters, low-latency gigabit networking, and dual-monitor developer stations.',
    features: ['High-Performance Linux Cluster', 'Dual-Monitor Workstations', 'Isolated VLAN Sandbox', 'Automated HVAC Zone']
  },
  'MB-103': {
    id: 'MB-103',
    name: 'CS-103 (Algorithms & Competitive Programming Lab)',
    code: 'CS-103',
    floorLevel: 1,
    floorName: 'Floor 1 - Computer Science & Grand Atrium',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Computer Science & Engineering',
    category: 'Smart Innovation Lab',
    capacity: 48,
    areaSqFt: '1,850 SF',
    temperature: '23.0°C',
    powerDrawKw: 12.4,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=85',
    description: 'Collaborative development studio designed for algorithmic sprints, hackathons, and real-time competitive programming teams.',
    features: ['Interactive Glass Whiteboards', 'Modular Team Pods', 'Gigabit Fiber Uplinks', 'Energy Star Certified Rigging']
  },
  'MB-104': {
    id: 'MB-104',
    name: 'CS-104 (Database & Distributed Storage Systems)',
    code: 'CS-104',
    floorLevel: 1,
    floorName: 'Floor 1 - Computer Science & Grand Atrium',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Computer Science & Engineering',
    category: 'Smart Lecture Studio',
    capacity: 64,
    areaSqFt: '2,050 SF',
    temperature: '24.1°C',
    powerDrawKw: 13.6,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=85',
    description: 'Lecture studio equipped with cloud-connected digital podiums and live database cluster telemetry displays.',
    features: ['PostgreSQL & MongoDB Testbeds', 'Digital Teaching Podium', 'BEE 5-Star Efficient Inverters', 'Surround Sound Array']
  },

  // --- Floor 2 (AI, ML & Data Science) ---
  'MB-201': {
    id: 'MB-201',
    name: 'AI-201 (Machine Learning Core Studio)',
    code: 'AI-201',
    floorLevel: 2,
    floorName: 'Floor 2 - AI, ML & Data Science',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'AI & Machine Learning',
    category: 'Machine Learning Studio',
    capacity: 70,
    areaSqFt: '2,500 SF',
    temperature: '22.0°C',
    powerDrawKw: 22.5,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=85',
    description: 'Premier AI research classroom with floor-to-ceiling glass curtain facade, GPU cluster telemetry monitors, and ergonomic workstation seating.',
    features: ['NVIDIA Tensor Core Integration', 'Floor-to-Ceiling Glass Facade', 'CRAC Precision Airflow', 'Sub-metered Power Tracking']
  },
  'MB-202': {
    id: 'MB-202',
    name: 'AI-202 (Deep Learning Neural Cluster Lab)',
    code: 'AI-202',
    floorLevel: 2,
    floorName: 'Floor 2 - AI, ML & Data Science',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'AI & Machine Learning',
    category: 'Neural Cluster Research Lab',
    capacity: 54,
    areaSqFt: '2,200 SF',
    temperature: '21.5°C',
    powerDrawKw: 28.4,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=85',
    description: 'High-density GPU computing studio with direct fiber links to institutional server racks and neural network visualization displays.',
    features: ['Dedicated Liquid Cooled Racks', 'Multi-GPU Workstation Nodes', 'Smart Light Dimming', 'Real-time Watts/FLOP Telemetry']
  },
  'MB-203': {
    id: 'MB-203',
    name: 'AI-203 (Robotics & Computer Vision Studio)',
    code: 'AI-203',
    floorLevel: 2,
    floorName: 'Floor 2 - AI, ML & Data Science',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'AI & Machine Learning',
    category: 'Robotics & Vision Laboratory',
    capacity: 40,
    areaSqFt: '2,300 SF',
    temperature: '23.2°C',
    powerDrawKw: 19.8,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=85',
    description: 'Specialized robotics and stereo vision testing facility with optical tracking grids, autonomous rover bays, and robotic manipulator arms.',
    features: ['Optical Motion Capture Rig', 'Autonomous Ground Vehicle Test Track', 'ESD Safe Workbenches', 'Eco Cutoff Digital Relays']
  },
  'MB-204': {
    id: 'MB-204',
    name: 'AI-204 (Natural Language Systems & Audio Lab)',
    code: 'AI-204',
    floorLevel: 2,
    floorName: 'Floor 2 - AI, ML & Data Science',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'AI & Machine Learning',
    category: 'Speech & LLM Testing Studio',
    capacity: 50,
    areaSqFt: '1,950 SF',
    temperature: '23.6°C',
    powerDrawKw: 15.1,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=85',
    description: 'Sound-dampened acoustic intelligence suite dedicated to large language model tuning, multimodal speech synthesis, and audio analytics.',
    features: ['Studio Acoustic Baffles', 'Microphone Array Testing', 'Quiet Air Supply System', 'Zero-Waste Energy Policy']
  },

  // --- Floor 3 (Software Architecture & Cloud) ---
  'MB-301': {
    id: 'MB-301',
    name: 'SE-301 (Distributed Systems & Cloud Hub)',
    code: 'SE-301',
    floorLevel: 3,
    floorName: 'Floor 3 - Software Architecture & Cloud Labs',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Information Science & Engineering',
    category: 'Cloud Engineering Amphitheater',
    capacity: 65,
    areaSqFt: '2,250 SF',
    temperature: '23.0°C',
    powerDrawKw: 16.7,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=85',
    description: 'Modern glass-partitioned cloud development center with microservice orchestration dashboards and multi-region deployment monitoring.',
    features: ['Kubernetes Cluster Telemetry', 'Glass Partition Walls', 'Natural Daylighting Integration', 'High-Efficiency LED Arrays']
  },
  'MB-302': {
    id: 'MB-302',
    name: 'SE-302 (Cybersecurity & Threat Simulation Arena)',
    code: 'SE-302',
    floorLevel: 3,
    floorName: 'Floor 3 - Software Architecture & Cloud Labs',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Information Science & Engineering',
    category: 'Cyber War Room & SOC',
    capacity: 45,
    areaSqFt: '1,900 SF',
    temperature: '22.4°C',
    powerDrawKw: 21.0,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=85',
    description: 'Air-gapped security operations center (SOC) simulation arena with dynamic threat intelligence video walls and red/blue team consoles.',
    features: ['Air-Gapped Network Enclave', 'Dynamic SOC Video Wall', 'Red/Blue Team Pods', 'Precision Energy Profiling']
  },

  // --- Floor 4 (Research & Innovation) ---
  'MB-401': {
    id: 'MB-401',
    name: 'RES-401 (Quantum Computing & Photonics Lab)',
    code: 'RES-401',
    floorLevel: 4,
    floorName: 'Floor 4 - Research Labs & Department Library',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Research & Innovation',
    category: 'Advanced Quantum Research Facility',
    capacity: 35,
    areaSqFt: '2,100 SF',
    temperature: '20.5°C',
    powerDrawKw: 26.3,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=85',
    description: 'Top-floor quantum and photonics simulation facility featuring vibration-isolated optical tables, cryogenic testbed telemetry, and roof-terrace access.',
    features: ['Optical Isolation Tables', 'Cryogenic Telemetry Feeds', 'Skylight Daylight Harvesting', 'Rooftop Solar Direct Feed']
  },
  'MB-402': {
    id: 'MB-402',
    name: 'RES-402 (Digital Twin Command & VR Center)',
    code: 'RES-402',
    floorLevel: 4,
    floorName: 'Floor 4 - Research Labs & Department Library',
    buildingId: 'bit-main',
    buildingName: 'Block A (Main Courtyard Block)',
    department: 'Research & Innovation',
    category: 'Digital Twin Command Center',
    capacity: 50,
    areaSqFt: '2,400 SF',
    temperature: '22.0°C',
    powerDrawKw: 24.1,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=85',
    description: 'Campus-wide central digital twin simulation hub with live microgrid telemetry, building actuation controls, and immersive spatial twin projectors.',
    features: ['Campus Microgrid Master Terminal', 'Spatial VR Projection System', 'Direct DeviceAdapter Interface', 'Zero-Emission Rooftop Battery Hub']
  },

  // --- Block B (Academic Wing) ---
  'B2-101': {
    id: 'B2-101',
    name: 'EC-101 (Analog Microelectronics & VLSI)',
    code: 'EC-101',
    floorLevel: 1,
    floorName: 'Floor 1 - Electronics Core & VLSI',
    buildingId: 'bit-block-central',
    buildingName: 'Block B (Academic Wing)',
    department: 'Electronics & Communication',
    category: 'VLSI Design Studio',
    capacity: 60,
    areaSqFt: '2,000 SF',
    temperature: '23.2°C',
    powerDrawKw: 17.5,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=85',
    description: 'Cleanroom-adjacent microelectronics classroom with high-precision oscilloscope workbenches and automated silicon simulation suites.',
    features: ['Cadence & Synopsys Toolstations', 'Anti-static ESD Flooring', 'Variable Speed Ventilation', 'East Plaza Balcony Access']
  },
  'B2-201': {
    id: 'B2-201',
    name: 'EC-201 (Embedded Systems & IoT Innovation Hub)',
    code: 'EC-201',
    floorLevel: 2,
    floorName: 'Floor 2 - Embedded Systems & IoT Hub',
    buildingId: 'bit-block-central',
    buildingName: 'Block B (Academic Wing)',
    department: 'Electronics & Communication',
    category: 'IoT Maker & Sensor Lab',
    capacity: 48,
    areaSqFt: '1,950 SF',
    temperature: '23.8°C',
    powerDrawKw: 15.9,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=85',
    description: 'Rapid prototyping lab for wireless sensor networks, edge microcontroller deployments, and smart building energy IoT integration.',
    features: ['LoRa & Zigbee Testbed Grids', 'SMD Soldering & Inspection Stations', 'Sky-bridge Connection to Block A', 'Motion-Activated HVAC']
  },

  // --- Block C (Engineering & Mechanical Labs) ---
  'ME-101': {
    id: 'ME-101',
    name: 'ME-101 (Thermodynamics & Fluid Dynamics Arena)',
    code: 'ME-101',
    floorLevel: 1,
    floorName: 'Floor 1 - Robotics & Mechatronics',
    buildingId: 'bit-mechanical',
    buildingName: 'Block C (Engineering & Labs)',
    department: 'Mechanical Engineering',
    category: 'Engineering Lecture Theater',
    capacity: 68,
    areaSqFt: '2,200 SF',
    temperature: '24.2°C',
    powerDrawKw: 16.0,
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=85',
    description: 'Spacious modern engineering amphitheater featuring high-efficiency HVAC chillers and industrial CAD modeling demonstration suites.',
    features: ['Computational Fluid Dynamics Workstations', 'Dual Heavy-duty Projectors', 'Industrial Acoustic Baffles', 'Energy Audit Sensor Suite']
  },

  // --- Block D (Admin & Seminar Wing) ---
  'B3-101': {
    id: 'B3-101',
    name: 'ADM-101 (Executive Seminar & Council Boardroom)',
    code: 'ADM-101',
    floorLevel: 1,
    floorName: 'Floor 1 - Executive Hall & Faculty',
    buildingId: 'bit-block-east',
    buildingName: 'Block D (Admin & Seminar Wing)',
    department: 'Administration & Governance',
    category: 'Executive Council Boardroom',
    capacity: 55,
    areaSqFt: '2,600 SF',
    temperature: '22.5°C',
    powerDrawKw: 13.2,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=85',
    description: 'Luxury institutional executive boardroom with panoramic floor-to-ceiling glass, Italian leather conference seating, and encrypted video-conference matrix.',
    features: ['Panoramic Glass Curtain Enclosure', 'Italian Leather Conference Seating', 'Cisco TelePresence 4K Array', 'Direct Passkey Actuation Control']
  }
};

/**
 * Helper to fetch room showcase data with a robust fallback
 */
export function getRoomShowcaseData(classroomId) {
  if (ROOM_SHOWCASE_CONFIG[classroomId]) {
    return ROOM_SHOWCASE_CONFIG[classroomId];
  }

  // Generic fallback if a room is newly created or not explicitly mapped
  return {
    id: classroomId,
    name: classroomId,
    code: classroomId,
    floorLevel: 1,
    floorName: 'Campus Facility',
    buildingId: 'bit-main',
    buildingName: 'AuraSync Campus Complex',
    department: 'Academic Infrastructure',
    category: 'Smart Learning Space',
    capacity: 50,
    areaSqFt: '2,000 SF',
    temperature: '23.0°C',
    powerDrawKw: 15.0,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=85',
    description: 'Modern academic learning environment integrated with live microgrid sub-metering and environmental automation.',
    features: ['High-Efficiency LED Lighting', 'Smart Energy Metering', 'High-Speed Wi-Fi 6', 'Automated Comfort Zone']
  };
}
