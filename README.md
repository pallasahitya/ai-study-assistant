# AI Study Assistant
AI Study Assistant is a full-stack web application that allows users to upload PDF documents, interact with them through AI-powered conversations, and receive context-aware answers using Gemini 2.5 Flash.

## Features
* AI Chat
* PDF Upload
* PDF Question Answering
* PDF Summarization
* Markdown Rendering
* Syntax Highlighting
* Auto Scroll
* Enter-to-Send
* Loading Animation
* New Chat Support
* Automatic PDF Clearing

## Tech Stack

### Frontend
* React
* Vite
* Tailwind CSS

### Backend
* FastAPI
* Python

### AI & PDF Processing
* Gemini 2.5 Flash
* Google Generative AI SDK
* PyMuPDF
## Installation
### Clone Repository
```bash
git clone https://github.com/pallasahitya/ai-study-assistant.git
cd ai-study-assistant
```

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

## Project Structure
```text
AI-Study-Assistant
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── public/
├── src/
│
├── package.json
├── vite.config.js
└── README.md
```
## Future Improvements
* User Authentication
* Chat History
* Multiple PDF Support
* Quiz Generation
* Flashcard Generation

## Author
Sivani Sahitya Palla
GitHub: https://github.com/pallasahitya
