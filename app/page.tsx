"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import example from "@/public/example.json"
import axios from "axios"
import { Bot, Loader2 } from "lucide-react"
import { run } from "@/api/serverNext"
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
    console.log(run())
    console.log(example)
    setData([example])
  }, [])

  async function handleIndex() {
    fetch("http://localhost:8000/index")
      .then((response) => {
        // Request sent successfully
        console.log("GET request sent")
        return response.text() // Extract the response body as text
      })
      .then((responseData) => {
        // Log the response
        console.log("Response:", responseData)
      })
      .catch((error) => {
        // Handle error
        console.error("Error sending GET request:", error)
      })
  }

  return (
    <section className="m-auto grid max-w-[1200px] items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Research GPT
        </h1>
        <p className="text-center text-lg text-muted-foreground sm:text-xl">
          Chat with research articles
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={handleScroll}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Get Started
        </Button>
        <Button
          onClick={handleIndex}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Index
        </Button>
      </div>
      {data.length != 0 ? (
        <div className="grid grid-cols-[1.25fr,1fr] items-center justify-center gap-8">
          <div className="flex h-full w-full flex-col gap-3">
            {/* <ApiFilter setData={setData}></ApiFilter> */}
            <div className="h-full w-full max-w-3xl rounded-xl border border-gray-700 bg-white p-1 drop-shadow-xl dark:bg-black">
              <div className="h-full max-w-fit gap-2 rounded-lg border border-gray-700 bg-white dark:bg-black">
                {/*@ts-ignore*/}
                {/* <DispPDF url={data[0].pdf_url}></DispPDF> */}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 rounded-xl bg-gray-100 p-3 dark:bg-gray-900">
            <div className="m-auto h-full w-fit rounded-xl bg-white p-1 drop-shadow-xl dark:bg-black">
              <div className="flex rounded-xl border bg-white p-1 dark:bg-black">
                <ApiFilter setData={setData}></ApiFilter>
              </div>
            </div>
            {/* <div className="h-full max-w-3xl p-1 bg-white border border-gray-700 dark:bg-black rounded-xl drop-shadow-xl">
              <div className="flex bg-white border border-gray-700 rounded-lg dark:bg-black">
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
            {data.length > 0 && (
              <>
                <InfoBox data={data[0]} />
                <div className="h-full max-w-3xl rounded-xl border border-gray-700 bg-white p-1 drop-shadow-xl dark:bg-black">
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
                </div>
                <Chat></Chat>
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
      <Footer></Footer>
    </section>
  )
}
