"use client"

import React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { ComboboxDemo } from "./models"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
  name: string
  age: number
}

type Message = {
  id: number
  text: string
}

// async function getData(prompt: string) {
// 	const res = await fetch("/api/query", {
// 		method: "POST",
// 		body: superjson.stringify({ prompt }),
// 	});

// 	if (!res.ok) {
// 		console.error(await res.json());
// 		throw new Error("Failed to fetch data");
// 	}

// 	return res.json();
// }


export default function Chat({ name, age }: Props) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState<string>("")

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const bot = async (input: string) => {
    await sleep(1000);
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: 0, text: "You said: " + input },
    ]);
  };

  const send = (input: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: 1, text: input },
    ]);
    bot(input);
    setInput("");
  };

  React.useEffect(() => {
    setMessages([
      {
        id: 0,
        text: "Hello, I'm GPT-3. How can I help you?",
      },
      {
        id: 1,
        text: "I want to know more about you.",
      },
      {
        id: 0,
        text: "I'm a chatbot powered by GPT-3. I can answer questions, tell jokes, and more.",
      },
    ])
  }, [])

  return (
    <>
      <div className="bg-white dark:bg-black w-[90vw] max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl">
        <div className="flex flex-col">
          <div className="bg-white dark:bg-black rounded-t-lg p-2 border-gray-700 border flex flex-row justify-between items-center">
            <div className="flex gap-3">
              <div className="font-semibold tracking-tight transition-colors">
                Chat
              </div>
              <Badge
                variant="secondary"
                className="dark:bg-green-900 bg-green-200 bg-opacity-60"
              >
                Connected
              </Badge>
            </div>
            <div>
              <ComboboxDemo></ComboboxDemo>
            </div>
          </div>
          <div className="min-h-[600px] border-gray-700 border-b border-l border-r p-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.id === 1 ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`rounded-lg p-2 bg-gray-200 dark:bg-gray-800 ${
                    message.id === 0
                      ? "ml-2"
                      : "mr-2 bg-blue-600 dark:bg-blue-600 text-white" 
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-black rounded-b-lg p-2 border-gray-700 border-b border-l border-r flex">
            <Input
              className="rounded-r-none focus-visible:ring-0"
              type="text"
              placeholder="Enter message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={
                (e) => e.key === "Enter" && send(input)
              }
            />
            <Button className="rounded-l-none flex gap-3" type="submit">
              <Send onClick={()=>send(input)} ></Send>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
