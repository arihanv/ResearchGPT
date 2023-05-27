"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { run } from "@/api/serverNext"
import example from "@/public/example.json"
import axios from "axios"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { ArrowUp, Bot, Info, Loader2 } from "lucide-react"
import { Page } from "react-pdf"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Cookie from "js-cookie"
import { ApiFilter } from "@/components/apiFilter"
import Footer from "@/components/footer"

import DispPDF from "./DispPDF"
import Chat from "../components/chat/page"
import InfoBox from "./infoBox"


export default function PageContent(data:any) {
    const [vectorStore, setVectorStore] = useState({})
    const [input, setInput] = useState<string>("")
    const send = (input: string) => {
      console.log(input)
    }

    {
      console.log(data)
    }
  
    // useEffect(() => {
    //   // console.log(run)
    //   console.log(example)
    //   setData([example])
    // }, [])
  
    // useEffect(() => {
    //   if (data.length === 0) return;
    //   const fetchVectorStore = async () => {
    //     const result = await run(data[0].pdf_url); // Pass data[0].pdf_url as an argument to the run function
    //     setVectorStore(result); // Set the vectorStore in the component state
    //   };
    //   fetchVectorStore();
    // }, [data]);
  
    // useEffect(() => {
    //   // Ensure vectorStore is available before accessing its methods
    //   if (vectorStore) {
    //     const searchSimilarity = async () => {
    //       try {
    //         const resultOne = await vectorStore.similaritySearch("Therefore, for this model, making model-\ngenerated attention more human-like is the best choice", 3);
    //         console.log(resultOne);
    //       } catch (error) {
    //         console.error("Error in similarity search:", error);
    //       }
    //     };
  
    //     searchSimilarity();
    //   }
    // }, [vectorStore]);

    return (
      <>
        {Object.keys(data.data[0]).length != 0 ? (
          <div className="grid grid-cols-[1.25fr,1fr] items-center justify-center gap-8">
            <div className="flex h-full w-full flex-col gap-3">
              {/* <ApiFilter setData={setData}></ApiFilter> */}
              <div className="h-full w-full max-w-3xl rounded-xl border border-gray-700 bg-white p-1 drop-shadow-xl dark:bg-black">
                <div className="h-full max-w-fit gap-2 rounded-lg border border-gray-700 bg-white dark:bg-black">
                  {/*@ts-ignore*/}
                  <DispPDF url={data.data[0].pdf_url}></DispPDF>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 rounded-xl bg-gray-100 p-3 dark:bg-gray-900">
              <div className="m-auto h-full w-fit rounded-xl bg-white p-1 drop-shadow-xl dark:bg-black">
                <div className="flex rounded-xl border bg-white p-1 dark:bg-black">
                  <ApiFilter disabled={false} setData={data.setData}></ApiFilter>
                </div>
              </div>
              {Object.keys(data.data[0]).length > 0 && (
                <>
                  <InfoBox data={data.data[0]} />
                  {/* <div className="h-full max-w-3xl rounded-xl border border-gray-700 bg-white p-1 drop-shadow-xl dark:bg-black">
                    <div className="flex rounded-lg border border-gray-700 bg-white dark:bg-black">
                      <Input
                        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="password"
                        placeholder="Enter Open API key"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send(input)}
                      />
                      <Button className="flex gap-3 rounded-l-none" type="submit">
                        <Bot onClick={() => send(input)}></Bot>
                      </Button>
                    </div>
                  </div> */}
                  <Chat data={data.data[0]}></Chat>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-[769px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
            <div className="animate-spin text-gray-400 repeat-infinite dark:text-gray-600">
              <Loader2 size={30} />
            </div>
          </div>
        )}
      </>
    )
  }