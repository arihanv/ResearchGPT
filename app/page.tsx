import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import Chat from "./chat/page"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10 max-w-[1000px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-center sm:text-3xl md:text-5xl lg:text-6xl">
          Chat With GPT-3
        </h1>
        <p className="text-lg text-center text-muted-foreground sm:text-xl">
          A clean UI to experiment with Open AI APIs
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </Link>
        <Button
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Click Me
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <Chat name={"hello"} age={18}></Chat>
      </div>
    </section>
  )
}
