import React from "react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {}

export default function InfoBox({}: Props) {
  const date = {
    pub: "2021-08-01",
    update: "2021-08-01",
  }

  const authors = ["Michael", "Mark", "Damien", "Damien", "Damien", "Damien"]
  return (
    <>
      <div className="bg-white dark:bg-black max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl">
        <div className="bg-white dark:bg-black rounded-lg p-2 border-gray-700 border gap-2">
          <Tabs defaultValue="quick" className="h-[200px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick">Quick Info</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="authors">Authors</TabsTrigger>
            </TabsList>
            <TabsContent value="quick" className="overflow-y-scroll h-[80%]">
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-4 items-center justify-start">
                  <Badge className="w-fit text-xs overflow">
                    Computer Science
                  </Badge>
                  <div className="tracking-tighter text-xs text-gray-500 flex flex-col ">
                    <div>Pub Date: {date.pub}</div>
                  </div>
                  <div className="tracking-tighter text-xs text-gray-500 flex flex-col ">
                    <div>Update: {date.update}</div>
                  </div>
                </div>
                <Separator />
                <h1 className="font-extrabold tracking-tighter sm:text-xl">
                  Semi-Supervised Semantic Segmentation With High- and Low-Level
                  Consistency
                </h1>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {authors.map((author, index) => (
                    <Badge
                      key={index}
                      variant={"outline"}
                      className="tracking-tighter text-sm text-gray-500"
                    >
                      {author}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="summary" className="overflow-y-scroll h-[80%]">
              <div className="flex flex-col gap-2 p-1 text-sm">
                Make changes to your account here. Find definitions and
                references for functions and other symbols in this file by
                clicking a symbol below or in the code.Find definitions and
                references for functions and other symbols in this file by
                clicking a symbol beloFind definitions and references for
                functions and other symbols in this file by clicking a symbol
                below or in the code.Find definitions and references for
                functions and other symbols in this file by clicking a symbol
                below or in the code.Find definitions and references for
                functions and other symbols in this file by clicking a symbol
                below or in the code.Find definitions and references for
                functions and other symbols in this file by clicking a symbol
                below or in the code.w or in the code.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
