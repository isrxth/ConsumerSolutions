# Consumer Solution Garden 🪴

An interactive **Digital Garden** and knowledge-graph web application for exploring notes, systems, and guidelines. Built with Next.js, React, TypeScript, and Tailwind CSS, it transforms markdown notes and Obsidian wikilinks (`[[Target Note]]`) into an interactive force-directed 2D node network and rich reader view.

---

## ✨ Features

- 🕸️ **Interactive 2D Knowledge Graph**: Visualize notes and relationships dynamically with force-directed graph layouts (`react-force-graph-2d` & `d3-force`).
- 📖 **Rich Markdown Reader**: Embedded markdown parser supporting Obsidian wikilinks (`[[Link]]`), frontmatter metadata, and code highlighting.
- ⚡ **Automated Graph Generation**: Built-in prebuild generator (`scripts/generate-graph.mjs`) that scans markdown files and builds relationship maps automatically into `public/graph.json`.
- 🗂️ **Categorized Navigation & Search**: Group notes by category, search by title, and filter nodes by network connectivity.
- 🎯 **Pill Navigation & Sliding Overlay**: Smooth tab switching and drawer sliding views using `framer-motion`.
- 💬 **Suggest Edit Feedback**: Integrated feedback submission via Discord Webhooks.
- 🎓 **Interactive Tutorial**: Onboarding tour guide built-in to introduce new users to the digital garden canvas.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Components**: [React 19](https://react.dev/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Graph & Parsing**: `react-force-graph-2d`, `d3-force`, `react-markdown`, `remark-wiki-link`, `gray-matter`
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📁 Project Structure

```text
ConsumerSolution/
├── Notes/                      # Markdown notes vault
├── public/
│   └── graph.json              # Generated graph nodes & edges output
├── scripts/
│   └── generate-graph.mjs      # Wikilink parser & graph generator
├── src/
│   ├── app/                    # Next.js App Router pages & state store
│   │   ├── api/                # API routes (e.g. feedback endpoint)
│   │   ├── globals.css         # Global styles & Tailwind configuration
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Digital garden main page
│   │   └── store.ts            # Zustand global application state
│   └── components/             # UI components
│       ├── disclaimer.tsx      # Info modal & disclaimer
│       ├── knowledge-graph.tsx # 2D Force graph canvas
│       ├── markdown-viewer.tsx # Markdown reader drawer & page viewer
│       ├── pill-navigation.tsx # Floating tab navigator
│       ├── sidebar.tsx         # Search and group navigation sidebar
│       └── tutorial-tour.tsx   # Step-by-step interactive onboarding tour
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v11+ recommended)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd ConsumerSolution
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and set your environment variables:

```bash
cp .env.example .env.local
```

Example config (`.env.local`):
```env
# Discord Webhook URL for user feedback & suggest edits
DISCORD_FEEDBACK_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 3. Development Server

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the digital garden.

---

## 🔄 Graph Generation

The knowledge graph is generated automatically during the build step (`pnpm prebuild`), but you can also run it manually at any time:

```bash
node scripts/generate-graph.mjs
```

This script:
1. Recursively scans the `Notes/` directory for `.md` files (and root `Rules.md`).
2. Extracts titles, frontmatter, groups, and Obsidian `[[wikilinks]]`.
3. Constructs node & edge structures and outputs to `public/graph.json`.

---

## ⚙️ Available Scripts

- `pnpm dev` – Starts the Next.js development server.
- `pnpm build` – Generates the node graph (`prebuild`) and builds the production bundle.
- `pnpm start` – Starts the Next.js production server.
- `pnpm lint` – Runs ESLint checks across the codebase.

---

## 📄 License

Private repository. All rights reserved.
