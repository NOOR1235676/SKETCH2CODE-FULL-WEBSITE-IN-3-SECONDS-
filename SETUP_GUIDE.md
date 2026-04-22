# 🎨 Sketch2Code AI — Complete Setup Guide

**Draw any UI on paper → Upload → Get production React/Tailwind code in seconds.**

---

## 📋 Zaroorat ki cheezein (5 minute setup)

| # | Cheez | Kahan milegi | Cost |
|---|---|---|---|
| 1 | Google Gemini API Key | [aistudio.google.com](https://aistudio.google.com) → "Get API Key" | 🆓 Free |
| 2 | Ngrok Auth Token | [ngrok.com/signup](https://ngrok.com/signup) → Dashboard → Your Authtoken | 🆓 Free |
| 3 | Google account (Colab ke liye) | Already hai tumhare paas | 🆓 Free |
| 4 | Node.js v18+ | [nodejs.org](https://nodejs.org) — download LTS version | 🆓 Free |
| 5 | VS Code | [code.visualstudio.com](https://code.visualstudio.com) | 🆓 Free |

**Sab free. Sab easy. Credit card nahi chahiye.**

---

## 🚀 PART 1 — BACKEND SETUP (Google Colab, 5 mins)

### Step 1.1 — Gemini API key lo
1. [aistudio.google.com](https://aistudio.google.com) kholo
2. Top right pe **"Get API key"** click karo
3. **"Create API key"** → **"Create API key in new project"**
4. Key copy karo, notepad mein paste kar lo

### Step 1.2 — Ngrok token lo
1. [ngrok.com/signup](https://ngrok.com/signup) pe free account banao
2. Login karne ke baad [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) pe jao
3. Authtoken copy karo

### Step 1.3 — Colab notebook banao
1. [colab.research.google.com](https://colab.research.google.com) kholo
2. **"New Notebook"** click karo
3. Upar title ko rename karo: `Sketch2Code Backend`

### Step 1.4 — 4 cells mein code paste karo

File `backend/colab_backend.py` kholo aur **"# === CELL X ==="** markers dekho.

**Cell 1** — Paste karo:
```python
!pip install fastapi uvicorn pyngrok nest-asyncio python-multipart google-generativeai pillow -q
```
▶️ Run (Shift+Enter)

**Cell 2** — Apni keys paste karo (2 jagah):
```python
import os
os.environ["GEMINI_API_KEY"] = "PASTE_YOUR_GEMINI_KEY"
NGROK_AUTH_TOKEN = "PASTE_YOUR_NGROK_TOKEN"

from pyngrok import ngrok, conf
conf.get_default().auth_token = NGROK_AUTH_TOKEN
print("✅ Keys set ho gayi")
```
▶️ Run

**Cell 3** — `colab_backend.py` file se pura "CELL 3" wala block copy karke paste karo (around 100 lines — `import base64` se `print("✅ App ready...")` tak)
▶️ Run

**Cell 4** — Paste karo:
```python
import nest_asyncio
import uvicorn
from pyngrok import ngrok

nest_asyncio.apply()
ngrok.kill()

public_url = ngrok.connect(8000).public_url
print("=" * 60)
print("🚀 BACKEND LIVE!")
print("📍 Public URL:", public_url)
print("=" * 60)

uvicorn.run(app, host="0.0.0.0", port=8000)
```
▶️ Run

### Step 1.5 — Public URL copy karo
Cell 4 ke output mein aisa dikhega:
```
🚀 BACKEND LIVE!
📍 Public URL: https://abc123-xyz.ngrok-free.app
```

👉 **Ye URL copy karo, frontend mein use hoga.**

⚠️ **Cell 4 chalti rehni chahiye** — Colab tab band mat karo jab tak test karna hai.

---

## ⚛️ PART 2 — FRONTEND SETUP (VS Code, 5 mins)

### Step 2.1 — Project folder kholo
```bash
cd path/to/sketch2code/frontend
```

### Step 2.2 — Dependencies install karo
```bash
npm install
```
(1-2 minute lagega)

### Step 2.3 — Backend URL paste karo
1. VS Code mein `src/App.jsx` kholo
2. File ke top pe ye line dhoondo:
   ```js
   const BACKEND_URL = "https://YOUR-NGROK-URL.ngrok-free.app";
   ```
3. Apna Colab wala ngrok URL paste karo (Step 1.5 se):
   ```js
   const BACKEND_URL = "https://abc123-xyz.ngrok-free.app";
   ```
4. Save (Ctrl+S)

### Step 2.4 — Frontend chalao
```bash
npm run dev
```

Output:
```
  ➜  Local:   http://localhost:5173/
```

### Step 2.5 — Browser mein kholo
`http://localhost:5173` pe jao. App ready hai! 🎉

---

## 🎬 PART 3 — DEMO TEST

### Step 3.1 — Sketch banao
- Kaagaz pe marker/pen se koi rough wireframe banao
- Examples:
  - Ek **login form** (email field, password field, button)
  - Ek **landing page** (header, hero text, CTA button)
  - Ek **pricing card** (title, price, features list)

### Step 3.2 — Upload karo
1. App mein drop zone pe drag-drop karo ya click karke select karo
2. Style choose karo (Modern / Minimal / Playful / Corporate)
3. **"Generate Code"** button click karo
4. 3-5 seconds wait karo
5. Right panel mein:
   - **Preview tab** — live rendered UI dikhegi
   - **Code tab** — pura HTML + Tailwind code

### Step 3.3 — Download/Copy
- "Copy" button se code copy karo
- "Download" button se `.html` file save karo
- Kisi bhi browser mein kholke test karo

---

## 📹 PART 4 — LinkedIn Video Banao

### Recording setup:
- **Loom** (free, easy): [loom.com](https://loom.com) — Chrome extension install karo
- Ya **Windows Game Bar** (Win+G)
- Ya **OBS Studio** (agar pehle se hai)

### Script (30-60 seconds):

**Scene 1 (0-10s)** — Camera pe paper aur marker dikhate huye:
> *"Main sirf ek rough sketch banata hoon..."*
> (Paper pe button/form quickly draw karo)

**Scene 2 (10-15s)** — Laptop screen pe switch:
> *"Ise upload karta hoon..."*
> (Drag-drop hota huye dikhao)

**Scene 3 (15-20s)** — Style select karte huye:
> *"Style choose karta hoon — Modern..."*

**Scene 4 (20-25s)** — Generate button click:
> *"Aur yeh dekho..."*
> (Loading animation → preview show hoti hai)

**Scene 5 (25-40s)** — Zoom in on preview:
> *"Paper wala sketch → production-ready React code.
> Tailwind, responsive, copy-paste ready."*

**Scene 6 (40-50s)** — Code tab dikhate huye:
> *"Ye raha actual code, Gemini AI ne generate kiya."*

**Scene 7 (50-60s)** — Closing:
> *"Bana hai FastAPI + React + Google Gemini se.
> Code comments mein milega. Follow for more AI tools! 🚀"*

---

## 📝 PART 5 — LinkedIn Post (copy-paste ready)

```
🚀 Just built an AI that converts HAND-DRAWN sketches into production code!

I draw a rough wireframe on paper... upload the photo...
and in 3 seconds, I get:

✅ Complete HTML + Tailwind CSS code
✅ Responsive & mobile-friendly
✅ 4 style options (Modern / Minimal / Playful / Corporate)
✅ Live preview + download option
✅ Actually USABLE code, not a toy

The magic? Google Gemini 2.0 Flash — a vision-language model
that can LOOK at your messy sketch and UNDERSTAND what you meant.

🛠️ Tech Stack:
• Python + FastAPI (backend)
• Google Gemini 2.0 (multi-modal AI)
• React + Vite + Tailwind (frontend)
• Google Colab + Ngrok (deployment)

I built this in one sitting — but the implications are massive.

Designers → no more "can devs build this?"
Devs → no more "can you send me the Figma?"
Product people → prototype at the speed of THOUGHT.

The future of design-to-code is here, and it's free. 🔥

Demo video 👇
What should I build next? Drop ideas in comments!

#AI #ComputerVision #FullStack #Python #React #FastAPI #Gemini
#WebDev #MachineLearning #SoftwareEngineering #DesignToCode
#ProductDesign #NoCode #StartupTech
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| **"Backend connect nahi hua"** | Colab tab open hai? Cell 4 chal rahi hai? URL sahi paste kiya? |
| **ngrok URL expired** | Free tier ~2hr session. Cell 4 rerun karo, naya URL lo, `App.jsx` mein update karo |
| **"Failed to fetch"** | Ngrok free tier mein pehli dafa jab request jati hai to "visit site" warning aati hai. Browser mein direct ngrok URL kholo, "Visit Site" click karo, phir app try karo |
| **Gemini error: API key invalid** | Key exactly copy-paste ki hai? Koi space to nahi hai? |
| **Gemini error: rate limit** | Free tier 15 req/min hai. 1 minute wait karo |
| **Blank preview** | Code tab check karo — agar HTML hai, iframe sandbox issue hai. Download karke browser mein kholo |
| **npm install fails** | Node version check karo: `node -v` (18+ chahiye) |

---

## 💼 Resume Bullet Points

Ye project apne CV mein aise likho:

```
Sketch2Code AI — Full-Stack AI Tool
• Built a multi-modal AI tool that converts hand-drawn UI wireframes 
  into production-ready React/Tailwind code in under 3 seconds
• Integrated Google Gemini 2.0 Flash vision-language model for image 
  understanding and HTML generation
• Architected FastAPI backend with ngrok tunneling for rapid deployment
• Developed responsive React + Vite frontend with drag-drop upload, 
  live iframe preview, and 4 style presets
• Tech: Python, FastAPI, Google Gemini, React, Vite, Tailwind CSS
```

---

## 🎯 Extension Ideas (agar aur add karna chaho)

- ✨ **Multiple frames** — multi-page app ek sketch se
- 🎨 **Color picker** — user define kare accent color
- 🖼️ **Generated preview thumbnails** — history sidebar
- 💾 **Save projects** — localStorage mein save karo
- 🔄 **Regenerate variations** — same sketch, different layouts
- 📦 **Export to Figma / CodeSandbox**

---

**Built by Spiral Lab** 🚀
