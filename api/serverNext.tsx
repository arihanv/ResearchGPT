import axios from "axios"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

async function getData(query: string) {
    const url = `https://test-1-z9723294.deta.app/splits?url=${encodeURIComponent(query)}`;
    
    const res = await fetch(url);
  
    if (!res.ok) {
      console.error(await res.json());
      throw new Error("Failed to fetch data");
    }
    await new Promise(r => setTimeout(r, 2000));
    return res.json();
}

export const run = async (url: string, key: string) => {

  const response = await getData(url, )
  console.log(response)
  // const vectorStore = await MemoryVectorStore.fromTexts(
  //   response.text,
  //   response.meta,
  //   new OpenAIEmbeddings({
  //     openAIApiKey: process.env.NEXT_PUBLIC_OPENAIKEY, // In Node.js defaults to process.env.OPENAI_API_KEY
  //   })
  // )
  // return vectorStore
  const vectorStore = await MemoryVectorStore.fromTexts(
    ["Hello world", "Bye bye", "hello nice world"],
    [{ id: 2 }, { id: 1 }, { id: 1 }],
    new OpenAIEmbeddings({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAIKEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    })
  )
  return vectorStore

  //   const resultOne = await vectorStore.similaritySearch("hello world", 1);
  //   console.log(resultOne);
}
