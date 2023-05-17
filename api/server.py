from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain import OpenAI
import arxiv
from langchain import PromptTemplate
from fastapi.responses import StreamingResponse
import requests
import json
import time
import asyncio
import os
import re
import app_secrets


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
    
@app.get("/api/pdf")
async def get_pdf(url: str):
    response = requests.get(url, stream=True)
    return StreamingResponse(response.iter_content(chunk_size=1024), media_type="application/pdf")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)