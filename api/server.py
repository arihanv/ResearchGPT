from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain import OpenAI
import arxiv
from langchain import PromptTemplate
from fastapi.responses import StreamingResponse
import fitz
import requests
import json
import time
import asyncio
import os
import re
import app_secrets
from langchain.document_loaders import TextLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.document_loaders import TextLoader
from langchain.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyMuPDFLoader
from fastapi import FastAPI, BackgroundTasks
from langchain.embeddings import HuggingFaceEmbeddings


origins = [
    "http://localhost:3000",
    "localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

llm = OpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=app_secrets.OPEN_AI_KEY)

class Message(BaseModel):
    query: str

@app.post("/gpt")
def gpt(prompt: Message):
    global llm
    res = llm(prompt.query)
    return res

@app.post("/search")
def gpt(query: Message):
    try:
        if query.query[0:22] == "https://arxiv.org/pdf/":
            pattern = r"\d{4}\.\d{5}"
            match = re.search(pattern, query.query)
            if match:
                query.query = match.group(0)
            else:
                return ["None"]
        if len(query.query) == 10 and query.query[4] == '.':
            search = arxiv.Search(id_list=[query.query])
        else:
            search = arxiv.Search(
                query = query.query,
                max_results = 5,
                sort_by = arxiv.SortCriterion.Relevance
            )
        res = []
        for result in search.results():
            res.append(result.__dict__)
        if len(res) == 0:
            return ["none"]
        else: 
            return res
    
    except Exception as e:
        print(e)
        return ["none"]
    
# @app.get("/api/pdf")
# async def get_pdf(url: str):
#     response = requests.get(url, stream=True)
#     return StreamingResponse(response.iter_content(chunk_size=1024), media_type="application/pdf")
db = None
text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)

def download_pdf(url: str):
    global db
    data = PyMuPDFLoader(url).load()
    docs = text_splitter.split_documents(data)
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    db = FAISS.from_documents(docs, embeddings)
    print("Indexed")

@app.get("/api/pdf")
async def get_pdf(url: str, background_tasks: BackgroundTasks):
    # background_tasks.add_task(download_pdf, url)
    response = requests.get(url, stream=True)
    return StreamingResponse(response.iter_content(chunk_size=1024), media_type="application/pdf")


pdf_content = None  # Global variable to store the PDF content
text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)


# @app.get("/api/pdfs")
# async def get_pdf(url: str):
#     global pdf_content  # Access the global variable

#     response = requests.get(url, stream=True)
#     pdf_content = b""  # Initialize the variable

#     for chunk in response.iter_content(chunk_size=1024):
#         pdf_content += chunk

#     return StreamingResponse(iter([pdf_content]), media_type="application/pdf")

@app.get("/index")
def index():
    global db
    # loader = PyMuPDFLoader('./files/test.pdf')
    # data = loader.load()
    # text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    # docs = text_splitter.split_documents(data)
    # embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    # db = FAISS.from_documents(docs, embeddings)
    if db is None:
        return "Not Indexed"
    return "Indexed"


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)