"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiFilter } from "@/components/apiFilter"
import Footer from "@/components/footer"
import Chat from "./chat/page"
import InfoBox from "./infoBox"

export default function IndexPage() {
  const [input, setInput] = useState<string>("")
  const send = (input: string) => {
    console.log(input)
  }
  return (
    <section className="grid items-center gap-6 pt-6 pb-8 md:py-10 max-w-[1200px] m-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-center sm:text-3xl md:text-5xl lg:text-6xl">
          Research GPT
        </h1>
        <p className="text-lg text-center text-muted-foreground sm:text-xl">
          Chat with research articles
        </p>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link href={"#anchor"}>
          <Button
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Get Started
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-[1.25fr,1fr] items-center justify-center gap-8">
        <div className="flex flex-col h-full w-full gap-3">
        <ApiFilter></ApiFilter>
        <div className="bg-white dark:bg-black max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl h-full w-full">
          <div className="bg-white dark:bg-black rounded-lg p-2 border-gray-700 border gap-2 h-full">
            s
          </div>
        </div>
        </div>
        <div className="flex flex-col gap-5 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="bg-white dark:bg-black max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl h-full">
          <div
            id="anchor"
            className="bg-white dark:bg-black rounded-lg flex border-gray-700 border"
          >
            <Input
              className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              type="password"
              placeholder="Enter Open API key"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
            />
            <Button className="rounded-l-none flex gap-3" type="submit">
              <Bot onClick={() => send(input)}></Bot>
            </Button>
          </div>
          </div>
          <InfoBox />
          <Chat></Chat>
        </div>
      </div>
      <Footer></Footer>
    </section>
  )
}
