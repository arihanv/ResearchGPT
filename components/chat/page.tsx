"use client"

import React from "react"
import { run } from "@/api/serverNext"
import Cookie from "js-cookie"
import { OpenAI } from "langchain/llms/openai"
import { Loader2, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ComboboxDemo } from "./models"

type Message = {
  id: number
  text: string
}

// async function getData(query: string) {
//   const res = await model.call(query);
//   return res
// }

export default function Chat(data: any) {
  const [vectorStore, setVectorStore] = React.useState({ ss: "ss" })
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState<string>("")
  const chatDivRef = React.useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false)
  const [completedTyping, setCompletedTyping] = React.useState(false)
  const [displayResponse, setDisplayResponse] = React.useState("")

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.5,
    openAIApiKey: Cookie.get("key"),
  })

  const bot = async (input: string) => {
    setIsProcessing(true)
    const data = await model.call(input)
    console.log(data)
    setMessages((prevMessages) => [...prevMessages, { id: 0, text: data }])
    setIsProcessing(false)
  }

  const send = (input: string) => {
    if (isProcessing) {
      return
    }
    setMessages((prevMessages) => [...prevMessages, { id: 1, text: input }])
    bot(input)
    setInput("")
  }

  React.useEffect(() => {
    // setVectorStore({})
    // if (data.length === 0) return;
    // const fetchVectorStore = async () => {
    //   const result = await run(data.pdf_url, process.env.NEXT_PUBLIC_OPENAIKEY as string);
    //   setVectorStore(result);
    // };
    // fetchVectorStore();
    console.log(data.data)
  }, [data.data])

  // React.useEffect(() => {
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

  React.useEffect(() => {
    setMessages([
      {
        id: 0,
        text: "Ask me about " + data.data.title,
      },
      // {
      //   id: 1,
      //   text: "I want to know more about you.",
      // },
      // {
      //   id: 0,
      //   text: "I'm a chatbot powered by GPT-3. I can answer questions, tell jokes, and more.",
      // },
    ])
  }, [data.data])

  React.useEffect(() => {
    setCompletedTyping(false)

    if (messages.length === 0) {
      return
    }

    let i = 0
    const words =
      messages[messages.length - 1].id === 0
        ? messages[messages.length - 1].text.split(" ")
        : []

    const intervalId = setInterval(() => {
      setDisplayResponse(words.slice(0, i).join(" "))
      i++

      if (i > words.length) {
        clearInterval(intervalId)
        setCompletedTyping(true)
      }
    }, 60)

    return () => clearInterval(intervalId)
  }, [messages])

  React.useEffect(() => {
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight
    }
  }, [messages, displayResponse])

  if (Object.keys(vectorStore).length === 0) {
    return (
      <div className="flex h-[425px] max-w-3xl items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-100 p-1 font-medium text-gray-400 drop-shadow-xl dark:bg-gray-900 dark:text-gray-500 ">
        <div className="animate-spin text-gray-400 repeat-infinite dark:text-gray-600">
          <Loader2 size={30} />
        </div>
        Indexing...
      </div>
    )
  }

  return (
    <>
      <div className="max-w-3xl rounded-xl border border-gray-700 bg-white p-1 drop-shadow-xl dark:bg-black">
        <div className="flex flex-col">
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 rounded-t-lg border border-gray-700 bg-white p-2 dark:bg-black sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/14957082?s=200&v=4"
                  alt="@shadcn"
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="font-semibold tracking-tight transition-colors">
                Chat
              </div>
              <Badge
                variant="secondary"
                className="ml-2 bg-green-200 bg-opacity-[0.6] dark:bg-green-900"
              >
                Connected
              </Badge>
            </div>
            <div>
              <ComboboxDemo></ComboboxDemo>
            </div>
          </div>
          <div
            ref={chatDivRef}
            className="h-[300px] overflow-y-scroll border-x border-b border-gray-700 p-2"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.id === 1 ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`max-w-[80%] rounded-lg bg-gray-200 p-2 dark:bg-gray-800 ${
                    message.id === 0 && index === messages.length - 1
                      ? "ml-2"
                      : message.id === 0
                      ? "ml-2"
                      : "mesUser mr-2"
                  }`}
                >
                  {message.id === 0 && index === messages.length - 1 ? (
                    <div className="!text-sm">
                      {displayResponse}
                      {!completedTyping && (
                        <svg
                          viewBox="8 4 8 16"
                          xmlns="http://www.w3.org/2000/svg"
                          className="cursor !filter-invert"
                        >
                          <rect
                            x="10"
                            y="6"
                            width="4"
                            height="12"
                            fill="#fff"
                          />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="my-2.5 flex justify-center">
                <div className="animate-spin text-sm text-gray-500 repeat-infinite">
                  <Loader2 />
                </div>
              </div>
            )}
          </div>
          <div
            id="anchor"
            className="flex rounded-b-lg border-x border-b border-gray-700 bg-white p-2 dark:bg-black"
          >
            <Input
              className="rounded-r-none focus-visible:ring-0"
              type="text"
              placeholder="Enter message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
            />
            <Button className="flex gap-3 rounded-l-none" type="submit">
              <Send onClick={() => send(input)}></Send>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
