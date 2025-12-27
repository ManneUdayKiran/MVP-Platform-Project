# MVP: Prompt-to-Product – AI Code & Chat Assistant

🚀 **Prompt-to-Product** is a powerful MVP platform that lets developers instantly turn prompts into usable code or insights. It combines the capabilities of AI chat and code generation in a single, intuitive interface.

## visit my app at https://prompt-to-product.onrender.com

## 🧠 Elevator Pitch

**Prompt-to-Product** is a web-based AI assistant that helps developers generate, test, and understand code — instantly. Whether you're exploring ideas or debugging, switch between AI Chat Mode and Code Mode to get exactly what you need.

---

## 🌐 Tech Stack

- **Frontend**: React.js (Vite), Ant Design UI, ShadCN
- **Backend**: FastAPI
- **Authentication**: Firebase Auth
- **Cloud**: Render (Deployment)
- **AI Integration**: OpenAI / Groq (LLMs)
- **Database**: Firebase (Authentication data), No backend DB needed in MVP
- **Version Control**: GitHub

---

## 🛠 Toolstack Used

- **LLMs**: GPT-4, Mixtral (via Groq API)
- **Frontend Styling**: Tailwind CSS + Ant Design + Custom dark/light/system themes
- **Speech & Image Input**: Web Speech API, Tesseract.js (optional integration)
- **Deployment**: Render with Docker

---

## ✨ Features

- 🔁 **Dual Mode Switching**: Toggle between **Chat Mode** (conversational help) and **Code Mode** (code generation via StackBlitz iframe)
- 🎙️ **Voice Input & TTS**: Speak to your assistant and hear back the response in multiple languages
- 🖼️ **Image Upload**: Upload screenshots to extract and summarize text using OCR
- 🌐 **Multilingual Support**: Switch language dynamically for output
- 💡 **Dark/Light/System Theme**: Customize your experience
- 🔐 **Firebase Authentication**: Secure login/signup system
- 💬 **Chat History**: Persistent memory via localStorage
- ⚙️ **Settings Modal**: UI preferences, theme, language

---

## 💻 Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+
- pip

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file with your GROQ_API_KEY

# Run the backend server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate into the frontend
cd Frontend

# Install dependencies
npm install

# Run dev server (connects to local backend by default)
npm run dev
```

### Environment Configuration

The frontend automatically connects to:

- **Local development**: `http://localhost:8000` (when running `npm run dev`)
- **Production**: `https://mvp-platform-project.onrender.com`

To customize, edit the `.env` file in the Frontend folder:

```bash
# For local development (default)
VITE_API_ENV=local

# For production
# VITE_API_ENV=production
# VITE_API_BASE_URL=https://your-backend-url.com
```

---

## 🧠 How AI & LLMs Were Used

- Used **LLMs (GPT-4, Mixtral)** to generate responses, code snippets, explanations, and bug fixes.
- **Prompt engineering** helped fine-tune AI replies per mode (code/chat).
- **Prompt templates** and system messages were defined to guide the assistant's tone and behavior.
- Enabled multilingual replies and voice response generation using AI.

---

## 📄 License

MIT License

---

## 🙌 Acknowledgements

- [OpenAI](https://openai.com/)
- [Groq](https://groq.com/)
- [Firebase](https://firebase.google.com/)
- [StackBlitz](https://stackblitz.com/)
- [Ant Design](https://ant.design/)

\
