import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import fitz
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = genai.GenerativeModel("gemini-2.5-flash")

pdf_text = ""

class ChatRequest(BaseModel):
    text: str


@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    global pdf_text

    pdf_data = await file.read()

    doc = fitz.open(stream=pdf_data, filetype="pdf")

    extracted_text = ""

    for page in doc:
        extracted_text += page.get_text()

    pdf_text = extracted_text

    print("\n========== PDF UPLOADED ==========")
    print("Characters:", len(pdf_text))
    print(pdf_text[:500])
    print("==================================\n")

    return {
        "message": "PDF uploaded successfully"
    }


@app.post("/clear-pdf")
async def clear_pdf():

    global pdf_text

    pdf_text = ""

    return {
        "message": "PDF cleared successfully"
    }


@app.post("/chat")
async def chat(request: ChatRequest):

    try:

        print("\n========== NEW QUESTION ==========")
        print("Question:", request.text)

        # If PDF exists, use PDF context
        if len(pdf_text.strip()) > 0:

            prompt = f"""
You are a study assistant.

Answer using the PDF content whenever relevant.

PDF Content:
{pdf_text[:20000]}

Question:
{request.text}
"""

        # Otherwise act like a normal AI chatbot
        else:

            prompt = request.text

        response = model.generate_content(prompt)

        print("SUCCESS")
        print("==================================\n")

        return {
            "message": response.text
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "message": f"Backend Error: {str(e)}"
        }