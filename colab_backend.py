# =====================================================================
#  🎨 SKETCH2CODE AI — BACKEND (Google Colab)
# =====================================================================
#  YE FILE GUIDE KE LIYE HAI. ACTUAL COLAB MEIN 4 SEPARATE CELLS BANAO.
#  Har "# === CELL X ===" wala section ek alag Colab cell mein paste karo.
#
#  Pehle ye karna hai:
#    1. https://aistudio.google.com pe jao
#    2. "Get API Key" click karo → "Create API key" → copy karo
#    3. https://ngrok.com/signup pe free account banao → dashboard se authtoken copy karo
#    4. Google Colab kholo: https://colab.research.google.com → New Notebook
# =====================================================================


# ============================ CELL 1 =================================
# Dependencies install karo (Colab cell mein paste karo, run karo)

!pip install fastapi uvicorn pyngrok nest-asyncio python-multipart google-generativeai pillow -q


# ============================ CELL 2 =================================
# Apne API keys paste karo yahan (ye 2 variables bhar do)

import os
os.environ["GEMINI_API_KEY"] = "YAHAN_PASTE_KARO_GEMINI_KEY"
NGROK_AUTH_TOKEN = "YAHAN_PASTE_KARO_NGROK_TOKEN"

from pyngrok import ngrok, conf
conf.get_default().auth_token = NGROK_AUTH_TOKEN
print("✅ Keys set ho gayi")


# ============================ CELL 3 =================================
# Main FastAPI server code — ye pura cell as-is paste karo

import base64
import io
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

# Gemini configure karo
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-2.0-flash-exp")

app = FastAPI(title="Sketch2Code AI")

# CORS — frontend ko allow karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============== Request model ================
class SketchRequest(BaseModel):
    image: str          # base64 data URL (data:image/png;base64,...)
    style: str = "modern"   # modern | minimal | playful | corporate

# =============== The master prompt ============
SYSTEM_PROMPT = """You are an expert frontend developer. You receive a hand-drawn UI sketch (wireframe) and must convert it into production-ready HTML with Tailwind CSS classes.

RULES:
1. Output ONLY a single complete HTML file — nothing else. No explanations, no markdown fences.
2. Include Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Interpret the sketch GENEROUSLY — if you see a rough rectangle labeled "button", make it a beautiful button. Be creative in making it look polished.
4. Use realistic placeholder text (not "Lorem ipsum" — use real-sounding product copy).
5. Add nice shadows, rounded corners, proper spacing, good typography.
6. Use a cohesive color palette. Default to indigo/slate if unclear.
7. Make it RESPONSIVE (mobile-friendly).
8. Add smooth hover states on interactive elements.
9. Use Lucide icons via CDN if icons are needed.
10. The output must be a COMPLETE standalone HTML page starting with <!DOCTYPE html>."""

STYLE_NOTES = {
    "modern": "Use a modern, clean aesthetic with bold typography, generous whitespace, and a primary color of indigo-600. Add subtle gradients.",
    "minimal": "Use a strictly minimal aesthetic — black, white, one accent color. Thin borders, lots of whitespace, elegant serif headings.",
    "playful": "Use a playful aesthetic — rounded corners everywhere, pastel colors (pink-400, yellow-300, teal-400), fun emojis where appropriate.",
    "corporate": "Use a corporate professional aesthetic — navy blue primary, gray neutrals, sharp corners, serious tone, subtle shadows.",
}

# =============== Helper: clean AI output =======
def extract_html(text: str) -> str:
    """AI kabhi kabhi ```html fence add kar deta hai — hata do."""
    text = text.strip()
    # Remove markdown code fences
    text = re.sub(r"^```(?:html)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    # Agar <!DOCTYPE se start nahi ho raha to wrap kar do
    if not text.lower().lstrip().startswith("<!doctype") and not text.lower().lstrip().startswith("<html"):
        text = f"<!DOCTYPE html>\n<html><head><script src='https://cdn.tailwindcss.com'></script></head><body>{text}</body></html>"
    return text

# =============== Routes =======================
@app.get("/")
def root():
    return {"status": "ok", "service": "Sketch2Code AI", "version": "1.0"}


@app.post("/generate")
def generate_code(req: SketchRequest):
    try:
        # Base64 se image bytes nikaalo
        image_data = req.image
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        img_bytes = base64.b64decode(image_data)

        # PIL image banao (Gemini ke liye)
        from PIL import Image
        pil_image = Image.open(io.BytesIO(img_bytes))

        # Prompt bhejo
        style_note = STYLE_NOTES.get(req.style, STYLE_NOTES["modern"])
        full_prompt = f"{SYSTEM_PROMPT}\n\nSTYLE: {style_note}\n\nNow convert this sketch into a beautiful HTML page:"

        response = model.generate_content([full_prompt, pil_image])
        html = extract_html(response.text)

        return {
            "success": True,
            "html": html,
            "style": req.style,
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)[:200],
            "html": f"<html><body style='font-family:sans-serif;padding:40px'><h2>Error</h2><p>{str(e)[:200]}</p></body></html>",
        }


print("✅ App ready. Ab Cell 4 run karo.")


# ============================ CELL 4 =================================
# Server start karo + public URL generate karo

import nest_asyncio
import uvicorn
from pyngrok import ngrok

nest_asyncio.apply()

# Agar koi purana tunnel khula hai to band karo
ngrok.kill()

public_url = ngrok.connect(8000).public_url
print("=" * 60)
print("🚀 BACKEND LIVE!")
print("📍 Public URL:", public_url)
print("=" * 60)
print("👉 Ye URL copy karo aur frontend ke App.jsx mein paste karo")
print("=" * 60)

uvicorn.run(app, host="0.0.0.0", port=8000)
