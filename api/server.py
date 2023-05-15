from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain import OpenAI
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
    "http://localhost:3001",
    "localhost:3001",
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
    prompt: str

@app.post("/gpt")
def gpt(message: Message):
    global llm
    res = llm(message.prompt)
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)