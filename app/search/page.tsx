"use client"

import { useEffect, useState } from "react"
import Cookie from "js-cookie"
import { Search } from "lucide-react"

import { ApiFilter } from "@/components/apiFilter"

import PageContent from "./pageContent"

export default function IndexPage() {
  const [data, setData] = useState<any[]>([])

  // useEffect(() => {
  //   if (!Cookie.get("key")) {
  //     window.location.href = "/auth"
  //   }
  // }, [])

  return (
    <section className="m-auto grid max-w-[1200px] items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Search <Search size={35} className="inline-block" />
        </h1>
        <p className="text-center text-lg text-muted-foreground sm:text-xl">
          Search for articles here.
        </p>
      </div>

      {data.length != 0 ? (
        <PageContent data={data} setData={setData}></PageContent>
      ) : (
        <div className="flex h-[769px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
          <div className="flex flex-col gap-5 text-gray-400 dark:text-gray-600">
            <div className="flex justify-center">
              <div className="flex w-fit justify-center rounded-xl bg-gray-300 dark:bg-gray-800 px-3 py-0.5 text-sm font-medium text-gray-500 drop-shadow-md">
                Search For A Paper To Get Started
              </div>
            </div>
        
            <div>
              <div className="m-auto h-full w-fit rounded-xl bg-white p-1 drop-shadow-xl dark:bg-black">
                <div className="flex rounded-xl border bg-white p-1 dark:bg-black">
                  <ApiFilter disabled={false} setData={setData}></ApiFilter>
                </div>
              </div>
            </div>
            <div className="text-xs text-center">
              *Currently Koios GPT only has support for Arvix papers, but more are
              soon to come!
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
