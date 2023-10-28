import Link from "next/link"
import { ArrowBigUp, ArrowUp, ChevronUp, UploadCloud } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { Animation } from "@/components/lottie/animation"
import { Search } from "lucide-react"

export default function IndexPage() {
  return (
    <section className="container flex flex-col items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col py-10">
        <div className="flex items-center justify-between gap-10">
          <div>
            <h1 className=" whitespace-nowrap text-8xl font-extrabold leading-tight tracking-tighter lg:text-[150px]">
              <span>
                KoiosGPT <b className="text-5xl tracking-normal">v1.5</b>
              </span>
            </h1>
            <h1 className="ml-2 text-xl font-semibold tracking-tight">
              Analyze research articles and your PDFs easily with AI
            </h1>
          </div>
          <div className="grayscale invert dark:invert-0">
            <Animation />
          </div>
        </div>
        <div className="ml-2 flex justify-between">
          <div className="flex flex-col">
            <div className="grid grid-cols-[2fr,4fr,1fr]">
              <Link href="/nav" className="w-full">
                <Button className="p-7 w-full text-xl" size={"lg"}>
                  Try Now
                </Button>
              </Link>
              <span className="m-5 flex-grow border-y "></span>
              <div className="flex justify-center items-center gap-5">
              <Link href={"/search"}>
              <Search size={45} className="inline-block" />
              </Link>
              <div className="border h-full"></div>
              <Link href={"/myfiles"}>
              <UploadCloud size={45} />
              </Link>
              </div>
            </div>
            {/* <div className="mt-10 flex w-[60%] items-center gap-2 ">
              <ChevronUp size={200}></ChevronUp>
              <div className="rounded-xl">
                *Koios is free but requires an Open AI Key to work. Your API Key
                is never shared or stored on our servers
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}
