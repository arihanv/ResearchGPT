"use client"

import React, { useEffect } from "react"
import { runDown } from "@/app/api/serverDownload"
import { run } from "@/app/api/serverNext"
import { useSetAtom } from "jotai"
import { useToast } from "@/components/ui/use-toast"
import Cookie from "js-cookie"
import { RetrievalQAChain } from "langchain/chains"
import { OpenAI } from "langchain/llms/openai"
import { Info, Loader2, Send, ServerCrash, Trash } from "lucide-react"
import GPT3Tokenizer from 'gpt3-tokenizer';
import {useUser} from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { pageNumberAtom } from "@/components/shared/sharedState"

import { ComboboxDemo } from "./models"

type Message = {
  id: number
  text: string
  pages?: {}
}

export default function Chat(data: any) {
  const setPageNumber = useSetAtom(pageNumberAtom)
  const [retrievalChain, setRetrievalChain] = React.useState({} as any)
  const [vectorStore, setVectorStore] = React.useState({} as any)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState<string>("")
  const chatDivRef = React.useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false)
  const [completedTyping, setCompletedTyping] = React.useState(false)
  const [displayResponse, setDisplayResponse] = React.useState("")
  // const [modelType, setModelType] = React.useState("gpt-3.5-turbo")
  const [failed, setFailed] = React.useState(false)
  const [long, setLong] = React.useState(false)

  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
  const { toast } = useToast()

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.8,
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAIKEY,
  })

  const { user } = useUser();

  const showToast = () => {  
    toast({
      variant: "destructive",
      title: "Error",
      description: <div>You have reached the limit of usage. Contact <a>arihan.dev@gmail.com</a> for more credits</div>,
    });
  }

  const bot = async (input: string) => {
    if (input === "" || Object.keys(retrievalChain).length === 0) return
    setIsProcessing(true)
    try {
      const res = await retrievalChain.call({
        query: input,
      })
      console.log(res)
      const pageNumbers = new Set()
      let contextT = ""
      res.sourceDocuments.forEach((document: any) => {
        const pageNumber = document.metadata.page
        pageNumbers.add(pageNumber)
        contextT += document.pageContent
      })
      const cost = tokenizer.encode(input + contextT).text.length * 0.0015 + tokenizer.encode(res.text).text.length * 0.002
      console.log(cost/1000, user?.unsafeMetadata.cost)
      user?.update({
        unsafeMetadata: {
          cost: cost/1000 + (user?.unsafeMetadata.cost ? (user?.unsafeMetadata.cost as number) : 0)
        }
      })
      const pageNums = Array.from(pageNumbers)
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: 0, text: res.text, pages: pageNums },
      ])
    } catch (e) {
      console.log(e)
      let reason = ""
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: 0,
          text: "An error occured. Please try again later." + reason,
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const send = (input: string) => {
    if(user?.unsafeMetadata.cost as number > 0.9){
      showToast()
      return
    }
    if(tokenizer.encode(input).text.length > 1500){
      setMessages((prevMessages) => [...prevMessages, { id: 0, text: "Your query is too long" }])
      return
    }
    if (input === "") return
    if (isProcessing) {
      return
    }
    setMessages((prevMessages) => [...prevMessages, { id: 1, text: input }])
    bot(input)
    setInput("")
  }

  useEffect(() => {
    if (Object.keys(vectorStore).length === 0) return
    const newModel = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.5,
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAIKEY,
    })
    let chain = null


    if (data.data.summary === undefined) {
      chain = RetrievalQAChain.fromLLM(newModel, vectorStore.asRetriever(3), {
        returnSourceDocuments: true,
      })
    } else {
      console.log("chain making.summary")
      chain = RetrievalQAChain.fromLLM(newModel, vectorStore.asRetriever(3), {
        inputKey: ` Paper Info:
        Summary: ${data.data.summary}
        Title: ${data.data.title}
        Authors:  ${data.data.authors
          .map((obj: { name: string }) => obj.name)
          .join(", ")}
      `,
        returnSourceDocuments: true,
      })
    }
    setRetrievalChain(chain)
  }, [])

  React.useEffect(() => {
    setLong(false)
    setRetrievalChain({})
    if (data.data !== undefined && data.data.length === 0) return
    if (data.data === undefined) return
    console.log(data.data)
    const fetchVectorStore = async () => {
      let result = null
      if (data.path !== undefined) {
        console.warn("runDown", data.path)
        result = await runDown(data.path)
      } else {
        result = await run(data.data.pdf_url)
      }
      if (result === null) {
        setLong(true)
        setRetrievalChain({ error: "too long" })
        return
      }
      setVectorStore(result)
      const chain = RetrievalQAChain.fromLLM(model, result.asRetriever(), {
        returnSourceDocuments: true,
        inputKey: "query",
      })
      setRetrievalChain(chain)
    }
    try {
      fetchVectorStore()
    } catch (e) {
      console.log(e)
      setFailed(true)
    }
  }, [data.data])

  function resetMessages() {
    const titleText = !data.path
      ? `Ask me about "${data.data.title}"`
      : "Ask me about this document"
    setMessages([
      {
        id: 0,
        text: titleText,
      },
    ])
  }

  React.useEffect(() => {
    resetMessages()
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

  if (Object.keys(retrievalChain).length === 0) {
    return (
      <div
        className={`flex max-w-3xl items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-100 p-1 font-medium text-gray-400 drop-shadow-xl dark:bg-gray-900 dark:text-gray-500 min-h-[475px] ${
          data.data.pdf_url ? "h-700px" : "h-525px"
        }`}
      >
        <div className="animate-spin text-gray-400 repeat-infinite dark:text-gray-600">
          <Loader2 size={30} />
        </div>
        Indexing...
      </div>
    )
  }
  if (failed) {
    return (
      <div
        className={`flex max-w-3xl items-center min-h-[475px] justify-center gap-2 rounded-xl border border-gray-700 bg-gray-100 p-1 font-medium text-gray-400 drop-shadow-xl dark:bg-gray-900 dark:text-gray-500 ${
          data.data.pdf_url ? "h-700px" : "h-525px"
        }`}
      >
        <div className="flex max-w-[200px] flex-col items-center gap-2 text-center">
          <ServerCrash size={30} />
          <div className="font-semibold">Failed to Index</div>
          <p className="text-sm">
            Error: Server timeout (exceeded 20-second limit)
          </p>
          <p className="text-sm">Maybe try again later?</p>
        </div>
      </div>
    )
  }

  if (long) {
    return (
      <div
        className={`flex max-w-3xl min-h-[475px] items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-100 p-1 font-medium text-gray-400 drop-shadow-xl dark:bg-gray-900 dark:text-gray-500 ${
          data.data.pdf_url ? "h-700px" : "h-525px"
        }`}
      >
        <div className="flex max-w-[150px] flex-col items-center gap-2 text-center">
          <ServerCrash size={30} />
          <div className="font-semibold">Too Large</div>
          <p className="text-sm">Error: Paper is more than 20 pages</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-3xl rounded-xl border border-gray-700 bg-white p-1 drop-shadow-xl dark:bg-black">
        <div className="flex flex-col">
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 rounded-t-lg border border-gray-700 bg-white p-2 dark:bg-black sm:justify-between">
            <div className="flex items-center gap-2">
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
                className="ml-2 flex items-center bg-green-200 bg-opacity-[0.6] text-sm dark:bg-green-900 pb-0 pt-0"
              >
                <div>Connected</div>
              </Badge>
            </div>
            {/* <div>
              <ComboboxDemo setModelType={setModelType}></ComboboxDemo>
            </div> */}
          </div>
          <div
            ref={chatDivRef}
            className={`overflow-y-scroll border-x border-b border-gray-700 p-2 ${
              data.path ? "h-[575px]" : "h-[400px]"
            }`}
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
                    <>
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
                      <>
                        {message.pages !== undefined && message.id === 0 && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <div className="flex">
                              <Popover>
                                <PopoverTrigger>
                                  <Info size={13} />{" "}
                                </PopoverTrigger>
                                <PopoverContent side="left" className="text-sm">
                                  These are the pages that GPT used to answer
                                  your question in order of relevance
                                </PopoverContent>
                              </Popover>
                            </div>
                            <p className="mt-[0.12rem]">
                              Pages:{" "}
                              {Array.isArray(message.pages) &&
                                message.pages.map((page, index) => (
                                  <React.Fragment key={index}>
                                    <button
                                      className="font-semibold italic underline"
                                      onClick={() => setPageNumber(page)}
                                    >
                                      {page}
                                    </button>
                                    {index !==
                                      (message.pages as Array<any>).length -
                                        1 && ", "}
                                  </React.Fragment>
                                ))}
                            </p>
                          </div>
                        )}
                      </>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">{message.text}</p>
                      {message.pages !== undefined && message.id === 0 && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <div className="flex">
                            <Popover>
                              <PopoverTrigger>
                                <Info size={13} />{" "}
                              </PopoverTrigger>
                              <PopoverContent side="left">
                                Place content for the popover here.
                              </PopoverContent>
                            </Popover>
                          </div>
                          <p className="mt-[0.12rem]">
                            {" "}
                            Pages:{" "}
                            {Array.isArray(message.pages) &&
                              message.pages.map((page, index) => (
                                <React.Fragment key={index}>
                                  <button
                                    className="font-semibold italic underline"
                                    onClick={() => setPageNumber(page)}
                                  >
                                    {page}
                                  </button>
                                  {index !==
                                    (message.pages as Array<any>).length - 1 &&
                                    ", "}
                                </React.Fragment>
                              ))}
                          </p>
                        </div>
                      )}
                    </>
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
              disabled={isProcessing}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
            />
            <Button
              className="flex gap-3 rounded-l-none"
              onClick={() => send(input)}
              type="submit"
              disabled={isProcessing}
            >
              <Send></Send>
            </Button>
            <Button
              disabled={isProcessing}
              className="ml-2 flex gap-3 bg-red-400 bg-opacity-100"
              type="submit"
              onClick={() => resetMessages()}
            >
              <Trash></Trash>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
