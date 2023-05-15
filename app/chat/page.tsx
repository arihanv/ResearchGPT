"use client"

import React from "react"
import { Send, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ComboboxDemo } from "./models"

type Props = {
  name: string
  age: number
}

type Message = {
  id: number
  text: string
}

async function getData(prompt: string) {
  const res = await fetch("http://localhost:8000/gpt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    console.error(await res.json())
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default function Chat({ name, age }: Props) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState<string>("")
  const chatDivRef = React.useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false)
  const [completedTyping, setCompletedTyping] = React.useState(false)
  const [displayResponse, setDisplayResponse] = React.useState("")

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const bot = async (input: string) => {
    setIsProcessing(true)
    const data = await getData(input)
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
    setMessages([
      {
        id: 0,
        text: "Hello, I'm GPT-3. How can I help you?",
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
  }, [])

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
  }, [messages])

  return (
    <>
      <div className="bg-white dark:bg-black w-[90vw] max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl">
        <div className="flex flex-col">
          <div className="bg-white dark:bg-black rounded-t-lg p-2 border-gray-700 border flex flex-row justify-center sm:justify-between items-center flex-wrap gap-2">
            <div className="flex gap-3 items-center">
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
                className="dark:bg-green-900 bg-green-200 bg-opacity-60 ml-2"
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
            className="2xl:h-[600px] h-[500px] border-gray-700 border-b border-l border-r p-2 overflow-y-scroll"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.id === 1 ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`rounded-lg p-2 bg-gray-200 dark:bg-gray-800 max-w-[80%] ${
                    message.id === 0 && index === messages.length - 1
                      ? "ml-2"
                      : message.id === 0
                      ? "ml-2"
                      : "mr-2 mesUser"
                  }`}
                >
                  {message.id === 0 && index === messages.length - 1 ? (
                    <div className="!text-sm">
                      {/* {message} */}
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
            <div className="flex justify-center mb-2">
              <div className="text-sm text-gray-500 animate-spin repeat-infinite"><Loader2/></div>
            </div>
          )}
          </div>
          <div
            id="anchor"
            className="bg-white dark:bg-black rounded-b-lg p-2 border-gray-700 border-b border-l border-r flex"
          >
            <Input
              className="rounded-r-none focus-visible:ring-0"
              type="text"
              placeholder="Enter message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
            />
            <Button className="rounded-l-none flex gap-3" type="submit">
              <Send onClick={() => send(input)}></Send>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
