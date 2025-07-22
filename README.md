# Ingauss: Gamification + Blockchain + Cognitive Science + IA for Companies and Talents - A PoC for the WCHL25

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-1A1A1A?logo=radix-ui&logoColor=white)](https://www.radix-ui.com/themes)
[![Dfinity](https://img.shields.io/badge/Internet%20Computer-3B00B9?logo=dfinity&logoColor=white)](https://dfinity.org/)

This project serves as proof of concept, to showcase the effort on building an interesting web application based on **Internet Computer (ICP)** Tools. It's built with React, TypeScript, and the Radix UI component library. This combination provides a solid and usable structure to easily iterate, scale and evolve.

---

## Core Concepts

Ingauss has for mission is to significantly reduce the cost and the distance between the discovery of a suitable profile, and its incorporation to the workplace. The process is based on the resulting side effects of the continued use of a gamified platform.

#### This is what we solve for the people:
  - Monotonous and tedious recruitment processes for software developers.
  - Candidate overinvestment just to access a position.
  - Ineffectiveness of traditional methods to determine a candidate's suitability.
  - Validation impossibility for cultural resonance beyond random coincidences.
  - Low accuracy predicting (and preventing) recurrent job hopping.
  - Work-related exhaustion (burnout) due to an incorrect assessment.

#### This is what we solve for the companies:
  - High costs to prospect and acquire talent with very limited results.
  - Periodic shortages of assignable personnel for new initiatives.
  - Poor demographic coverage of its talent radar.
  - Seasonal defections linked to market fluctuations.
  - Insufficient incorporation of culturally resonant staff.
  - Increase in defections due to burnout.

### We solve this problems by:

| Measuring | Integrating | Validating |
|----------|-------------|---------------|
| Intellectual Strength | Company | Compatibility Index |
| Cultural Sensitivity | Department | Recent Activity |
| Personality Mechanics | Work Team | Related Results |
| Communicational Style | Available Position | Professional Potential |
| Professional Coherence | Situational Correlation | Continuous Improvement Path |

---

## Project Amenities

### 1. Multi-Provider Authentication 🛡️
The application provides a seamless and secure authentication layer with out-of-the-box support for multiple identity providers in the ICP ecosystem.

- **Providers:**
  - **NFID:** A privacy-preserving digital identity standard.
  - **Internet Identity (II):** The native authentication system for the Internet Computer.
- **Developer Mode:** A "bypass" login for rapid UI development, completely decoupled from the blockchain.
- **Configurability:** All login methods are controlled via **Feature Flags** in the `.env` file, allowing developers to enable or disable providers without changing the code.

### 2. Dynamic, Type-Safe Theming 🎨
The entire UI is built upon **Radix Themes**, providing a beautiful, accessible, and highly customizable component set.

- **Light & Dark Mode:** A persistent, user-selectable theme switch.
- **Accent Color Theming:** The application's accent color can be changed instantly by updating a single variable in the `.env` file.
- **Translucent UI:** Utilizes the `panelBackground="translucent"` feature of Radix Themes to create a modern, "frosted glass" effect reminiscent of modern operating systems.

### 3. Full Internationalization (i18n) 🌍
Built for a global audience from day one, the application features a complete i18n framework.

- **Multi-Language Support:** Comes pre-configured with **12 languages**.
- **Dynamic Language Selector:** A user-friendly modal allows users to switch languages on the fly. The list is automatically sorted by the number of native speakers.
- **Scalable Foundation:** Powered by `i18next` and `react-i18next`, making it easy to add new languages or translate new components.

### 4. Advanced & Independent Forms
The settings page showcases a complex, multi-tab form architecture where each tab functions as an independent, self-contained unit.

- **Component-Scoped State:** Each form tab manages its own state and API calls, improving modularity and performance.
- **Rich Inputs:** Implements advanced, accessible UI controls like dual-handle range sliders, dynamic tag selectors, and custom file inputs with validation, all powered by Radix UI primitives.

### 5. Robust Feature Flag System ⚙️
The project is architected around a centralized feature flag configuration, allowing for granular control over the application's functionality. This is a best practice for CI/CD, A/B testing, and phased rollouts.

- **Centralized Config:** A single `src/config/features.ts` file reads from the `.env` file.
- **Granular Control:** Toggle entire features like authentication methods, UI elements (like the header's news marquee), or form capabilities (like max file sizes) through environment variables.

---

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- **Node.js:** Version 18.x or higher.
- **npm** or your preferred package manager.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Create the environment file:**
    Duplicate the `.env.example` file and rename it to `.env`.
    ```bash
    cp .env.example .env
    ```
    This file contains all the necessary environment variables to configure the application.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 🔧 `.env` Configuration

This project is controlled by environment variables. Create a `.env` file in the root and add the following variables.

| Variable                          | Description                                                                                              | Default Value                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `VITE_APP_THEME_ACCENT`           | Sets the accent color for Radix Themes (e.g., `indigo`, `cyan`, `ruby`).                                   | `indigo`                                                                   |
| `VITE_APP_THEME_GRAY`             | Sets the gray scale for Radix Themes (e.g., `slate`, `sand`, `gray`).                                      | `slate`                                                                    |
| `VITE_APP_LOGIN_LOGO_URL`         | URL for the logo on the login screen.                                                                    | `/img/IngaussLogoSol.webp`                                                 |
| `VITE_HEADER_LOGO_URL`            | URL for the smaller logo in the main application header.                                                 | `/img/IngaussLogoMin.webp`                                                 |
| `VITE_FEATURE_NFID_LOGIN_ENABLED` | Set to `true` or `false` to show/hide the NFID login button.                                               | `true`                                                                     |
| `VITE_FEATURE_II_LOGIN_ENABLED`   | Set to `true` or `false` to show/hide the Internet Identity login button.                                  | `true`                                                                     |
| `VITE_FEATURE_DEV_LOGIN_ENABLED`  | Set to `true` or `false` to show/hide the developer bypass login button.                                   | `false`                                                                     |
| `VITE_FEATURE_MARQUEE_ENABLED`    | Set to `true` or `false` to show/hide the scrolling text marquee in the header.                            | `true`                                                                     |
| `VITE_MARQUEE_DEFAULT_TEXT`       | Default text for the marquee if the API call fails.                                                      | `Bienvenido a nuestra plataforma.`                                         |
| `VITE_II_DERIVATION_ORIGIN`       | The derivation origin for Internet Identity (use your frontend canister URL in production).              | `http://localhost:5173`                                                    |
| `VITE_MAX_PROFILE_PIC_SIZE_KB`    | Maximum size in kilobytes for the profile picture upload.                                                | `500`                                                                      |
| `VITE_MAX_RESUME_SIZE_KB`         | Maximum size in kilobytes for the resume/CV PDF upload.                                                  | `500`                                                                      |
| `VITE_MAX_WORKPLACE_TAGS`         | The maximum number of workplace tags a user can select.                                                  | `3`                                                                        |

---

## 📂 Project Structure

A brief overview of the key directories in the `src` folder:

-   `api/`: Contains mock API functions, ready to be replaced with real canister calls.
-   `components/`: Shared React components used across the application.
-   `config/`: Centralized configuration for features and environment variables.
-   `context/`: React Context providers for managing global state (Auth, Theme).
-   `i18n/`: Configuration and translation files for internationalization.
-   `layouts/`: Components that define the structure of pages (e.g., Login vs. Lobby).
-   `pages/`: Top-level components that correspond to application routes.

---