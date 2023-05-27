import Cookie from "js-cookie"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import {
  MemoryVectorStore,
} from "langchain/vectorstores/memory"
import drive from "./det"

async function getData(query: string) {
  const url = `https://test-1-z9723294.deta.app/splits?url=${encodeURIComponent(
    query
  )}`

  const res = await fetch(url)

  if (!res.ok) {
    console.error(await res.json())
    throw new Error("Failed to fetch data")
  }
  // await new Promise((r) => setTimeout(r, 2000))
  return res.json()
}

async function checkExist(id: string) {
  try {
    const file = await drive.get(id)
    if (file === null) return null
    console.log("File exists:", id)
    const content = await file.text()
    console.log(content)
    const jsonData = JSON.parse(content)
    return jsonData
  } catch (error: any) {
    if (error.status === 404) {
      console.log("File does not exist:", id)
    } else {
      console.error("Error retrieving file:", error)
    }
  }
}

function cleanData(data: any) {
  const cleanedData = data.map((obj:any) => {
    const cleanedContent = obj.content.replace(/\n/g, "");
    const encodedContent = cleanedContent.replace(/[^\x00-\x7F]/g, "");
    return { content: encodedContent, embedding: obj.embedding, metadata: obj.metadata};
  });
  return cleanedData
}

export const run = async (url: string) => {
  const parts = url.split("/")
  console.log(parts[parts.length - 1])
  const loadDeta = await checkExist(parts[parts.length - 1])

  if (loadDeta !== null) {
    console.log("Already exists")
    const loadStore = await MemoryVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: Cookie.get("key"),
      })
    )
    loadStore.memoryVectors = loadDeta
    console.log(loadStore, loadDeta)
    return loadStore
  } else {
    console.log("Does not exist")
    const response = await getData(url)
    const vectorStore = await MemoryVectorStore.fromTexts(
      response.text,
      response.meta,
      new OpenAIEmbeddings({
        openAIApiKey: Cookie.get("key"),
      })
    )
    console.log(vectorStore)
    await drive.put(parts[parts.length - 1], {
      data: JSON.stringify(cleanData(vectorStore.memoryVectors)),
    })
    return vectorStore
  }
}
