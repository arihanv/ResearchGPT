from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain import OpenAI
import arxiv
from langchain import PromptTemplate
# from trapy import Trapy
import json
import time
import asyncio
import os
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
    search = arxiv.Search(
        query = query.query,
        max_results = 5,
        sort_by = arxiv.SortCriterion.Relevance
    )
    res = []
    for result in search.results():
        res.append(result.__dict__)
    return res


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)