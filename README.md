# Dakshinamurthy Website V1

> [!WARNING]
> **CRITICAL BRANCH RULE**: Direct pushes to the `main` branch are strictly locked. All daily development, commits, and feature updates must be pushed exclusively to the `prep` branch. Changes are merged into `main` via Pull Requests only.

---

## ⚙️ Prerequisites & First-Time Setup

### Prerequisites
- **Node.js** (Latest LTS version recommended)
- **npm** (Comes bundled with Node.js)
- **Git**
- **Centralized Database**: No separate individual database installation is required. The development team uses a shared, single central Supabase workspace instances cluster to maintain mock rows together.

### First-Time Environment Setup
If you are setting up the project on your machine for the first time, run these commands in order:

```bash
# 1. Clone the repository and switch to the prep branch
git clone https://github.com/DakMur/Dakshinamurthy_Website_V1.git
cd Dakshinamurthy_Website_V1
git checkout prep

# 2. Set up the Backend Workspace
cd server
npm install
# Create your local configuration file
cp .env.example .env

# 3. Set up the Frontend Workspace
cd ../client
npm install
# Create your local client configuration file
cp .env.example .env
```

### 🔐 Environment & Credentials Coordination
- **Central Database Keys**: Ask the project lead directly to obtain the active development string tokens block. Paste these credentials directly into your local `server/.env` file so your local server routes API calls to our shared Supabase project sandbox.
- **Cloudflare R2 Testing Bypasses**: For local development, if you do not have a Cloudflare card verification setup configured, retain the default placeholder text string `"PLACEHOLDER_UNTIL_CARD_VERIFIED"` inside your local `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` variables inside `server/.env`. The application middleware detects this string pattern automatically and safely routes dummy file URLs to keep the registration submission flow 100% functional without throwing storage crashes.
- **Client Configuration Link**: Ensure `VITE_API_URL` inside your local `client/.env` file is set to `http://localhost:5000` to bind with the local backend process server.

---

## 🔄 Daily Workflow for Contributors

Always follow this sequence when working on the project to avoid code synchronization issues.

### 1. Before You Start Coding
Always pull the latest changes from the remote tracking branch to ensure your local environment is up to date:

```bash
git pull origin prep
```

### 2. After Making Your Changes
Save your progress, commit your work locally, and push your branch back up to GitHub:

```bash
git add .
git commit -m "Describe your specific changes clearly"
git push origin prep
```

### 3. If Your Push Is Rejected
If GitHub rejects your push, it means a fellow contributor pushed changes while you were working. Run the following commands to sync and resolve any conflicts:

```bash
# Pull down the updates
git pull origin prep

# Resolve any merge conflicts if prompted by your editor, then push again:
git push origin prep
```

---

## 🔮 Working on Dimension Portals (Modular Development)

To prevent team members from overwriting each other's code, the dimension portal feature has been split into isolated, individual files. Do not modify the main modal logic or global files unless explicitly instructed.

Navigate to the info-cards directory:
`client/src/features/dimension-portal/info-cards/`

Make all UI, layout, and content changes strictly inside your specifically assigned file:

| File Name | Assigned Domain / Topic |
| :--- | :--- |
| `PageOne.tsx` | Meditation |
| `PageTwo.tsx` | Yoga & Asana |
| `PageThree.tsx` | Mindfulness |
| `PageFour.tsx` | Sacred Geometry |
| `PageFive.tsx` | Spiritual Science |
| `PageSix.tsx` | Conscious Living |
| `PageSeven.tsx` | Divine Energy & Qi |
| `PageEight.tsx` | Sacred Scriptures |
| `PageNine.tsx` | Ancient Wisdom |
| `PageTen.tsx` | Universal Consciousness |
| `PageEleven.tsx` | Astral Awareness & Dream |
| `PageTwelve.tsx` | Cosmic Philosophy |

> [!TIP]
> **Verification Tip**: Always test your compilation locally before tracking or staging your files. You can do this by running `npm run lint` or `npx tsc --noEmit` inside the `client` folder.

---

## 🛠️ Complete Command Reference

To launch the absolute development environment ecosystem, you must open two separate terminal split instances and trigger the runtime processes locally:
* **Inside `/server`**: Run `npm run dev` to boot up the Express API router.
* **Inside `/client`**: Run `npm run dev` to execute the local Vite user interface server framework.

| Scope / Directory | Command | Action |
| :--- | :--- | :--- |
| Root | `git status` | Verify which files are modified or staged |
| Root | `git branch` | Confirm you are currently standing on the prep branch |
| `/server` or `/client` | `npm install` | Download and update local dependencies in the respective directory |
| `/server` | `npm run dev` | Boot up the Express API router |
| `/client` | `npm run dev` | Execute the local Vite user interface server framework |
| `/server` or `/client` | `npx tsc --noEmit` | Execute inside the respective subfolder to audit type mappings cleanly |
| `/client` | `npm run build` | Compile and bundle the application for production deployment |
| `/client` | `npm run preview` | Locally preview the compiled production build |