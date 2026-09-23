# 🚻 Jajisha

### Find a toilet. Add a toilet. Get there.

<p align="center">
  <img src="image/README/jajisha-banner.png" alt="Jajisha — Public Toilet Discovery App" width="900">
</p>

<p align="center">
  <strong>A community-powered mobile application for discovering, reviewing, and navigating to public toilets.</strong>
</p>

<p align="center">
  <a href="https://github.com/devomid/jajisha">
    <img src="https://img.shields.io/badge/GitHub-devomid%2Fjajisha-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Tests-250%20Passing-2EA44F?style=for-the-badge&logo=jest&logoColor=white" alt="250 tests passing">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License">
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#engineering">Engineering</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#testing">Testing</a> •
  <a href="#security">Security</a> •
  <a href="#setup">Setup</a> •
  <a href="#demo">Demo</a>
</p>

---

## Overview

**Jajisha** is a full-stack mobile application built around a simple problem:

> **Finding a public toilet should not be difficult.**

Jajisha allows users to discover public toilets on an interactive map, inspect their information, contribute new locations, rate and review existing locations, save useful places, and navigate toward selected toilets.

The project was built as a complete product rather than a collection of isolated screens. It includes the mobile application, backend API, persistent database, authentication, localization, application state management, defensive error handling, security controls, and automated testing.

---

## Product

The core experience is intentionally simple:

```text
DISCOVER
   ↓
SELECT
   ↓
INSPECT
   ↓
REVIEW
   ↓
NAVIGATE
```

At the same time, Jajisha is community-driven: users can contribute locations and information that become part of the application's shared data.

---

# 📱 Visual Preview

> **Temporary preview only**
>
> The images below are generic mobile-app imagery from the internet. They are included temporarily so the README's visual composition can be evaluated before replacing them with actual Jajisha screenshots and product imagery.

<p align="center">
  <img src="https://images.unsplash.com/photo-1594948506928-2d4cad88d0af?auto=format&fit=crop&fm=jpg&q=80&w=900" alt="Temporary mobile application visual" width="220">
  <img src="https://images.unsplash.com/photo-1627542557169-5ed71c66ed85?auto=format&fit=crop&fm=jpg&q=80&w=900" alt="Temporary mobile application mockup" width="220">
  <img src="https://images.unsplash.com/photo-1678446870432-ba12574c14e5?auto=format&fit=crop&fm=jpg&q=80&w=900" alt="Temporary mobile application visual" width="220">
</p>

<p align="center">
  <sub><strong>Discover</strong> · <strong>Explore</strong> · <strong>Interact</strong></sub>
</p>

<br>

<p align="center">
  <img src="https://miro.medium.com/v2/resize%3Afit%3A1400/1%2ADPAg2VZvMou5SU582QHX9g.png" alt="Temporary navigation application visual" width="220">
  <img src="https://images.unsplash.com/photo-1594948506928-2d4cad88d0af?auto=format&fit=crop&fm=jpg&q=80&w=900" alt="Temporary mobile application visual" width="220">
</p>

<p align="center">
  <sub><strong>Navigate</strong> · <strong>Community</strong></sub>
</p>

> These temporary images should be replaced with final Jajisha visuals before the portfolio version of the repository is published.

---

# ✨ Features

## 🗺️ Interactive Map

The map is the primary discovery interface.

Users can:

* View available public toilets
* Inspect toilet markers
* Select individual locations
* View toilet information
* Search for locations
* Use their current location
* Switch map presentation modes

---

## 📍 Location-Based Discovery

Jajisha uses device location services to help users find nearby toilets.

The application handles:

* Current location acquisition
* Distance calculations
* Location-dependent discovery
* Navigation targets
* Map positioning
* Device heading information

---

## ➕ Community Contributions

Users can add public toilets to the shared map.

Toilet records can contain information about the location and its facilities, allowing the application to function as a community-maintained source of public toilet information.

---

## ⭐ Multi-Dimensional Ratings

Toilets are evaluated across multiple characteristics rather than relying only on one overall score.

The rating system includes dimensions such as:

* Cleanliness
* Amenities
* Privacy
* Lighting
* Odor
* Crowd level

---

## 💬 Reviews

Authenticated users can submit reviews for toilet locations.

The review lifecycle is handled across the complete application stack:

```text
User input
    ↓
Client validation
    ↓
API request
    ↓
Server validation
    ↓
Database persistence
    ↓
Updated application state
    ↓
User feedback
```

---

## 📷 Photos

Jajisha supports toilet-related images and photo galleries, giving users additional visual information about locations.

---

## ❤️ Favorites

Users can save useful toilet locations for easier access later.

---

## 🧭 Navigation

Users can start navigation toward a selected toilet.

The navigation system combines:

* Current location
* Destination coordinates
* Distance calculation
* Heading information
* Map camera control
* Navigation state
* Request lifecycle protection

---

## 🔎 Search

Users can search for locations beyond their immediate surroundings.

---

## 🌍 Localization

Jajisha currently supports:

| Language     | Status |
| ------------ | ------ |
| 🇬🇧 English | ✅      |
| 🇮🇷 Persian | ✅      |

Persian text receives dedicated RTL-aware text presentation while the overall application layout remains intentionally controlled rather than globally mirrored.

---

# 🧠 Engineering

Jajisha was built as a full-stack application with attention to:

* Application state
* Asynchronous operations
* Request lifecycle handling
* Error boundaries
* Authentication lifecycle
* Data validation
* Security
* Runtime diagnostics
* Localization
* Automated testing

---

## Frontend

The mobile application is built with:

* React Native
* Expo
* Expo Router
* React Native Maps
* Expo Location
* React Native Paper
* Zustand
* Formik
* Yup
* i18next
* React Native Reanimated
* React Native Gesture Handler
* `@gorhom/bottom-sheet`
* React Native Skia
* Lucide React Native
* Expo Secure Store
* AsyncStorage

---

## Backend

The backend is built with:

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Helmet
* CORS
* express-rate-limit
* Pino
* pino-http
* dotenv

---

# 🏗️ Architecture

Jajisha follows a client/server architecture.

```text
┌─────────────────────────────────────────────┐
│                  MOBILE APP                 │
│                                             │
│              React Native / Expo            │
│                                             │
│  ┌──────────┐  ┌────────────┐  ┌─────────┐ │
│  │   Map    │  │ Components │  │ Screens │ │
│  └────┬─────┘  └─────┬──────┘  └────┬────┘ │
│       │              │              │       │
│       └──────────────┼──────────────┘       │
│                      │                      │
│              ┌───────▼────────┐             │
│              │ Zustand Stores │             │
│              │     Hooks      │             │
│              │   API Layer    │             │
│              └───────┬────────┘             │
└──────────────────────┼──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│                 BACKEND API                 │
│                                             │
│                    Express                  │
│                      │                      │
│                ┌─────▼──────┐               │
│                │   Routes   │               │
│                └─────┬──────┘               │
│                      │                      │
│                ┌─────▼────────┐             │
│                │ Controllers  │             │
│                └─────┬────────┘             │
│                      │                      │
│                ┌─────▼──────┐               │
│                │   Models   │               │
│                └─────┬──────┘               │
└──────────────────────┼──────────────────────┘
                       │
                       ▼
                ┌──────────────┐
                │   MongoDB    │
                └──────────────┘
```

---

# 🔄 Application State

Global application state is managed with **Zustand**.

Focused stores handle application concerns such as:

* User state
* Map and toilet data
* Settings
* Menu state
* Waiting state

This separates application-level state from transient component state.

---

# ⚡ Asynchronous Lifecycle Handling

Jajisha contains centralized mechanisms for:

* Waiting/loading states
* Toast notifications
* API failures
* Request lifecycle handling
* Stale request protection
* Authentication restoration
* Error logging
* User-facing error feedback

The goal is consistent behavior across asynchronous operations rather than implementing independent loading and error behavior in every screen.

---

# 🛡️ Defensive API Boundaries

Frontend API interactions validate response outcomes instead of assuming every request succeeds.

The general lifecycle is:

```text
Request started
      ↓
Response received
      ↓
HTTP success?
   ↙       ↘
 YES       NO
  ↓         ↓
Process   Handle error
data      + feedback
```

This is particularly important for operations such as:

* Creating toilets
* Saving toilets
* Creating reviews
* Authentication
* Loading reviews
* Location-dependent requests

---

# 🔐 Security

Security was treated as part of the application architecture.

## Authentication

* JWT-based authentication
* Password hashing with bcryptjs
* Protected authenticated operations
* Authentication lifecycle handling

## HTTP security

* Helmet
* CORS configuration
* Rate limiting

## Input validation

* Request validation
* Domain validation
* Rating validation
* Review validation
* Defensive handling of malformed input

## Secrets

Sensitive configuration is supplied through environment variables.

Database credentials and authentication secrets should never be committed to the repository.

---

# 🧪 Testing

Jajisha has automated test coverage across the frontend, backend, and dedicated security surface.

## Frontend

The frontend suite covers:

* Zustand stores
* Utility functions
* Hooks
* Authentication logic
* Navigation logic
* Review logic
* Location logic
* Theme behavior
* API/theme boundaries
* Validation

### Result

```text
115 / 115 tests passing
```

---

## Backend

The backend suite covers:

* Controllers
* Routes
* Authentication
* Validation
* Database interactions
* API behavior

### Result

```text
103 / 103 tests passing
```

---

## Security

Dedicated security tests cover:

* Authentication
* JWT behavior
* Authorization
* Injection handling
* Validation
* Rate limiting
* Security headers
* Data exposure

### Result

```text
32 / 32 tests passing
```

---

## Total

```text
Frontend     115 / 115
Backend      103 / 103
Security      32 / 32
──────────────────────
Total        250 / 250
```

---

# 📊 Test Structure

Frontend and backend tests are kept separate from application source code.

```text
jajisha/
│
├── frontend/
│   ├── tests/
│   │   ├── utils/
│   │   ├── store/
│   │   ├── hooks/
│   │   └── ...
│   └── jest.config.js
│
├── backend/
│   └── test/
│
└── secTests/
    ├── auth/
    ├── authorization/
    ├── injection/
    ├── validation/
    ├── rateLimit/
    ├── headers/
    └── dataExposure/
```

---

# 📁 Project Structure

```text
jajisha/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── test/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── src/
│   │   ├── api/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── locales/
│   │   └── validation/
│   ├── store/
│   ├── tests/
│   ├── assets/
│   ├── android/
│   ├── ios/
│   ├── app.json
│   ├── jest.config.js
│   └── package.json
│
├── secTests/
│   ├── auth/
│   ├── authorization/
│   ├── injection/
│   ├── validation/
│   ├── rateLimit/
│   ├── headers/
│   ├── dataExposure/
│   ├── setup.js
│   └── package.json
│
├── LICENSE
└── README.md
```

---

# 🚀 Setup

## Requirements

* Node.js
* npm
* Git
* MongoDB
* Expo development environment
* Xcode for iOS development
* Android Studio for Android development

---

## Clone

```bash
git clone https://github.com/devomid/jajisha.git
cd jajisha
```

---

## Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

using the structure in:

```text
backend/.env.example
```

Example:

```env
MONGOURI=your_mongodb_connection_string
PORT=your_port_number
SECRET_KEY=your_jwt_secret
CLIENT_ORIGIN=http://localhost:8081
```

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start Expo:

```bash
npm start
```

For native development:

```bash
npm run ios
```

or:

```bash
npm run android
```

---

# 🧪 Running Tests

## Frontend

```bash
cd frontend
npm test
```

## Backend

```bash
cd backend
npm test
```

## Security

```bash
cd secTests
npm test
```

---

# 📱 Platform Support

| Platform | Status          |
| -------- | --------------- |
| iOS      | ✅               |
| Android  | ✅               |
| Web      | ⚠️ Experimental |

The primary product targets are **iOS and Android**.

---

# 🌍 Localization

| Language | Status |
| -------- | ------ |
| English  | ✅      |
| Persian  | ✅      |

The localization layer uses:

* i18next
* react-i18next
* Dedicated locale files
* Persian text alignment
* RTL-aware text presentation

---

# 🎨 UI & Design

Jajisha uses a custom mobile interface built around:

* React Native Paper
* Custom light and dark themes
* Persian typography
* Shabnam font
* Bottom-sheet interactions
* Blur and glass-style visual elements
* Animated transitions
* Map-focused interaction patterns

The interface was designed specifically for mobile use rather than treating the application as a web interface inside a mobile shell.

---

# 🎥 Demo

A short product demonstration will showcase the application more effectively than a long screen recording.

The final demo should focus on the actual product experience:

```text
OPEN
  ↓
DISCOVER
  ↓
SELECT
  ↓
INSPECT
  ↓
NAVIGATE
  ↓
CONTRIBUTE
  ↓
REVIEW
  ↓
FINISH
```

The intended final video length is approximately **40–60 seconds**.

The recording should show the finished application without development tooling, terminal windows, debug overlays, or unnecessary waiting.

---

# 🧩 What the Project Demonstrates

Jajisha demonstrates experience across several layers of modern application development:

| Area                       | Demonstrated |
| -------------------------- | ------------ |
| React Native               | ✅            |
| Expo                       | ✅            |
| JavaScript                 | ✅            |
| Mobile UI                  | ✅            |
| Maps & geolocation         | ✅            |
| Navigation                 | ✅            |
| REST APIs                  | ✅            |
| Node.js                    | ✅            |
| Express                    | ✅            |
| MongoDB                    | ✅            |
| Mongoose                   | ✅            |
| Authentication             | ✅            |
| JWT                        | ✅            |
| Zustand                    | ✅            |
| Localization               | ✅            |
| Persian / RTL support      | ✅            |
| API validation             | ✅            |
| Security testing           | ✅            |
| Automated testing          | ✅            |
| Error handling             | ✅            |
| Async lifecycle management | ✅            |

---

# 📌 Project Status

Jajisha is a completed portfolio project.

The application has completed:

* Frontend hardening
* Backend hardening
* Security testing
* Automated frontend testing
* Automated backend testing
* Runtime diagnostics
* Localization
* UI refinement
* Authentication lifecycle handling
* Async request handling

Current automated test result:

```text
250 / 250 passing
```

---

# 📄 License

This project is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for details.

---

# 👤 About

Jajisha was designed and developed as a full-stack mobile application project by **Omid**.

The project combines mobile application development, backend engineering, database design, geolocation, authentication, security, localization, UI design, and automated testing into a single production-oriented application.

---

<p align="center">
  <strong>Jajisha</strong><br>
  Find a toilet. Add a toilet. Get there.
</p>
