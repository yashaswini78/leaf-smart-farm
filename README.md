# Agri Health Hub

"Build a modern, responsive web application for AgriSense AI—an offline-first crop disease detection platform for smallholder farmers, aligned with UN SDG 2 (Zero Hunger). Design it with a mobile-first, high-contrast, high-accessibility layout suitable for rural field use.

1. Application Layout & Navigation

Bottom Navigation Bar (Mobile) / Sidebar (Desktop):

🌿 Scanner: Main camera/upload interface for crop disease diagnosis.

📊 Dashboard: Regional disease heatmaps, recent scans, and local weather risk alerts.

📚 Treatment Guide: Searchable offline database of crop diseases and organic remedies.

📶 Sync Status: Indicator showing offline state and pending cloud sync items.

2. Key Features & Page Flow

Leaf Scanner Page (/scan):

Include a live camera preview viewport / file upload box with framed scanner overlays.

Add a toggle for 'Offline Mode (TFLite Edge AI)' vs. 'Cloud Mode (Gemini Vision API)'.

Upon uploading/taking a photo, show an animated loading state ('Analyzing leaf patterns via Edge AI...').

Display a Diagnostic Result Card:

Disease name (e.g., Early Blight in Tomato).

Confidence score (e.g., 94% Match).

Visual symptom breakdown chips (e.g., Concentric rings, Leaf yellowing).

Accordion steps for Step-by-Step Treatment (Organic vs. Chemical options).

Audio button to 'Listen to Treatment Instructions' (Text-to-Speech simulation).

Dashboard Page (/dashboard):

Weather Alert Banner: Local humidity/temperature risk for pest outbreaks (e.g., High fungal risk in next 48 hrs).

Regional Outbreak Heatmap: Interactive map/card view showing nearby community disease reports.

Recent Scan History: Cards showing past leaf diagnoses with offline sync status badges.

Treatment Knowledge Base (/guide):

Filterable cards by crop type (Tomato, Maize, Rice, Wheat) with step-by-step prevention steps.

3. Design System & Tech Stack

Theme: Modern, clean agricultural aesthetic using Tailwind CSS (Deep Emerald Green #0F5132, Warm Leaf Green #198754, Soil Brown #5C3D2E, Warning Amber, High-Contrast White/Light Slate background).

UI Components: Use Lucide icons, Shadcn UI (Cards, Accordions, Tabs, Dialogs, Badges, Progress bars).

Mock Data & State: Pre-populate realistic mock data for 3–4 crop diseases with mock images, treatment guides, and offline toggle state handlers so the app is fully interactive out of the box."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://leaf-smart-farm.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6768e22-aacc-42b2-9c19-bb7caa0ed5d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
