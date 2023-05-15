import React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {}

export default function InfoBox({}: Props) {
  const date = {
    pub: "2021-08-01",
    update: "2021-08-01",
  }

  const authors = {
    0: "Michael",
    1: "Mark",
    2: "Damien",
  }
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
                <h1 className="font-extrabold tracking-tighter sm:text-xl">
                  Semi-Supervised Semantic Segmentation With High- and Low-Level
                  Consistency
                </h1>
                <div className="grid grid-cols-2">
                  <div className="tracking-tighter text-sm text-gray-500">
                  Pub Date: {date.pub}
                  </div>
                  <div className="tracking-tighter text-sm text-gray-500">
                  Update: {date.update}
                  </div> 
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
