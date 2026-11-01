# BIT Energy Twin 🌐⚡
### A Campus Digital Twin for Sustainable Microgrid Monitoring, AI Optimization & Transparent ESG Governance
**Built for:** Bangalore Institute of Technology (BIT), [BIT ADDRESS], Bengaluru, Karnataka, India  
**Developed by:** **[YOUR TEAM NAME], BIT**

---

## 🏆 Project Overview

**BIT Energy Twin** is a high-stakes, 100% software-based campus digital twin engineered for **BIT**. It unifies:
1. **Interactive 2D Spatial Digital Campus Map** of the BIT campus (featuring BIT Main Block, Administration Block, Engineering Block A, Engineering Block B, Sports Court, Hostel, and EV Charging Hub).
2. **Ghost Twin Technology** that computes the real-time gap between real consumption and ideal occupancy-derived baseline, isolating deterministic energy ghosts.
3. **Movable, Portal-Based Dynamic Island** HUD with 9+ smooth layout morphs, right-click-hold physics dragging, anchor snapping, and rotating institutional statements.
4. **Privacy-Preserving Edge Computer Vision** with client-side TensorFlow.js inference and smartphone WebRTC camera pairing.
5. **GenAI Energy Coach ("Aura AI")** powered by Gemini API proxy with zero-latency offline rule-based fallback, delivering quantified savings in Indian Rupees (₹) and kg CO₂e.
6. **Campus Helpdesk & Worker Action Center** with 3-tap student reporting, HOD Kanban dispatch with Smart-Assign, and mandatory after-photo evidence.
7. **Complete ESG & Carbon Accounting Hub** tracking Scope 1, Scope 2, and Scope 3 emissions, solar self-consumption, and instant Green Audit PDF exports.

---

## 🏛️ Institution & Team Recognition

- **Institution:** Bangalore Institute of Technology (BIT)
- **Parent Group:** Bangalore Institute of Technology
- **Location:** [BIT ADDRESS]
- **Institutional Statement Source:** `/client/src/config/institution.json` & `/server/src/config/institution.json`
- **Team Credit:** **Developed by [YOUR TEAM NAME], BIT**
- **Currency & Grouping:** Indian Rupees (`₹`) using `Intl.NumberFormat('en-IN')` everywhere.
- **Default Baseline:** Grid emission factor 0.71 kg CO₂e/kWh; BESCOM commercial HT slab rate assumed at ₹8.25/kWh (editable in Settings).

---

## ⚡ Quick Start & Run Commands

### 1. Prerequisites
- Node.js (v18.x or v20.x+)
- npm (v9.x or v10.x+)

### 2. Installation & Setup
From the root directory:
```bash
# 1. Install root, server, and client dependencies
npm run install:all

# 2. Seed database (creates demo accounts, tickets, workers, lifts, smart bins, telemetry)
npm run seed

# 3. Start both Backend Server (Port 5000) and Frontend Client (Port 5173) concurrently
npm run dev
```

### 3. Build for Production
```bash
npm run build:client
npm start
```

---

## 🔑 Demo Accounts & Passkeys

| Role | Email | Password | Passkey PIN | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@aurasync.demo` | `Admin@12345` | `123456` | Demo Principal (Full campus master control) |
| **HOD** | `hod.aiml@aurasync.demo` | `Hod@12345` | `123456` | Demo HOD (HOD AIML & Department Board) |
| **Faculty** | `faculty@aurasync.demo` | `Faculty@12345` | `123456` | Demo Faculty (Assistant Professor) |
| **Student** | `student@aurasync.demo` | `Student@12345` | `123456` | Demo Student (USN: [DEMO USN]) |
| **Worker** | `worker@aurasync.demo` | `Worker@12345` | `123456` | Worker 1 (Electrician) |

> **Note:** Demo mode includes a 1-click credential chip on `/login` to switch between roles instantly.

---

## 🏝️ The Dynamic Island (Positioning & Drag Physics)

The Dynamic Island is rendered through a React Portal directly into `document.body` with `position: fixed` and `z-index: 99999`.

- **How to Move:** **Right-Click and Hold for 300ms** (or press the **M key** on your keyboard, or long-press on mobile) to pick up the island with lifted shadow and grab cursor.
- **Snap Anchors:** Top-Center (Default), Top-Left, Top-Right, Bottom-Center, Bottom-Left, Bottom-Right, or Free Drag.
- **Reset:** Double-click the island or click "Reset Island Position" in Settings.

---

## 📹 IP / RTSP Camera Bridge Setup

For streaming institutional ONVIF/RTSP CCTV feeds into the Vision Lab, run a lightweight Node.js `fluent-ffmpeg` bridge:
```bash
# Example conversion of campus RTSP stream to WebRTC/MJPEG endpoint:
ffmpeg -rtsp_transport tcp -i rtsp://[USERNAME]:[PASSWORD]@192.168.1.120:554/live/ch0 \
  -f mjpeg -q:v 3 -r 10 http://localhost:8080/feed/lab204.mjpg
```

---

## 🗺️ How Any College Can Adopt the Energy Twin

The architecture is 100% config-driven:
1. Copy `/server/src/data/campus.json` and adjust building footprints.
2. Update `/server/src/config/institution.json` with university name and statements.
3. Update sanctioned kVA and local state grid tariff slabs in Settings.

---
*Developed with pride by **[YOUR TEAM NAME], BIT** for Bangalore Institute of Technology.*
