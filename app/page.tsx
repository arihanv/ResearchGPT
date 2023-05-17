"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import example from "@/public/example.json"
import { Bot, Loader2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApiFilter } from "@/components/apiFilter"
import Footer from "@/components/footer"

import DispPDF from "./DispPDF"
import Chat from "./chat/page"
import InfoBox from "./infoBox"

export default function IndexPage() {
  const [input, setInput] = useState<string>("")
  const [data, setData] = useState<any[]>([])
  const send = (input: string) => {
    console.log(input)
  }

  const handleScroll = () => {
    window.scrollBy({
      top: 275,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  useEffect(() => {
    console.log(example)
    setData([example])
  }, [])

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
        <Button
          onClick={handleScroll}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Get Started
        </Button>
      </div>
      {data.length != 0 ? (
        <div className="grid grid-cols-[1.25fr,1fr] items-center justify-center gap-8">
          <div className="flex flex-col h-full w-full gap-3">
            {/* <ApiFilter setData={setData}></ApiFilter> */}
            <div className="bg-white dark:bg-black max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl h-full w-full">
              <div className="bg-white dark:bg-black rounded-lg border-gray-700 border gap-2 h-full max-w-fit">
                <DispPDF url={data[0].pdf_url}></DispPDF>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 p-3 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <div className="bg-white dark:bg-black w-fit rounded-xl p-1  drop-shadow-xl h-full m-auto">
              <div className="bg-white dark:bg-black rounded-xl flex  border p-1">
                <ApiFilter setData={setData}></ApiFilter>
              </div>
            </div>
            {/* <div className="bg-white dark:bg-black max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl h-full">
              <div className="bg-white dark:bg-black rounded-lg flex border-gray-700 border">
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
            </div> */}
            {data.length > 0 && (
              <>
                <InfoBox data={data[0]} />
                <div className="bg-white dark:bg-black max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl h-full">
              <div className="bg-white dark:bg-black rounded-lg flex border-gray-700 border">
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
                <Chat></Chat>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="h-[769px] bg-gray-100 dark:bg-gray-900 rounded-xl flex justify-center items-center">
          <div className="text-gray-400 dark:text-gray-600 animate-spin repeat-infinite">
            <Loader2 size={30} />
          </div>
        </div>
      )}
      <Footer></Footer>
    </section>
  )
}
