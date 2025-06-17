
# MVP: Prompt-to-Product – AI Code & Chat Assistant

🚀 **Prompt-to-Product** is a powerful MVP platform that lets developers instantly turn prompts into usable code or insights. It combines the capabilities of AI chat and code generation in a single, intuitive interface.


visit my app at https://prompt-to-product.onrender.com
---

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

```bash
# Clone repo
git clone https://github.com/yourusername/MVP-Platform-Project.git

# Navigate into the frontend
cd Frontend

# Install dependencies
npm install

# Run dev server
npm run dev
````

---

## 🧠 How AI & LLMs Were Used

* Used **LLMs (GPT-4, Mixtral)** to generate responses, code snippets, explanations, and bug fixes.
* **Prompt engineering** helped fine-tune AI replies per mode (code/chat).
* **Prompt templates** and system messages were defined to guide the assistant's tone and behavior.
* Enabled multilingual replies and voice response generation using AI.

---



## 📄 License

MIT License

---

## 🙌 Acknowledgements

* [OpenAI](https://openai.com/)
* [Groq](https://groq.com/)
* [Firebase](https://firebase.google.com/)
* [StackBlitz](https://stackblitz.com/)
* [Ant Design](https://ant.design/)

\
