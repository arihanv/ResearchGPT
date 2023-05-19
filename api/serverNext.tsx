import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export const run = async () => {
  const vectorStore = await MemoryVectorStore.fromTexts(
    ["Hello world", "Bye bye", "hello nice world"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAIKEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    }
  ));
  return vectorStore;

//   const resultOne = await vectorStore.similaritySearch("hello world", 1);
//   console.log(resultOne);
};