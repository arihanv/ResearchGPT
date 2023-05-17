import React from "react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
  data: Record<string, any>
}

export default function InfoBox({ data }: Props) {
  const date = {
    published: "2021-08-01",
    update: "2021-08-01",
  }

  React.useEffect(() => {
    console.log(typeof(data.pdf_url))
  }, [data])

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
                  <Badge className="w-fit text-xs overflow dark:hover:bg-white hover:bg-black">
                    Computer Science
                  </Badge>
                  <div className="tracking-tighter text-xs text-gray-500 flex flex-col ">
                    <div>
                      Pub Date:{" "}
                      {new Date(data.published).toISOString().split("T")[0]}
                    </div>
                  </div>
                  <div className="tracking-tighter text-xs text-gray-500 flex flex-col ">
                    <div>
                      Update:{" "}
                      {new Date(data.updated).toISOString().split("T")[0]}
                    </div>
                  </div>
                </div>
                <Separator />
                <h1 className="font-extrabold tracking-tighter sm:text-xl cursor-pointer w-fit" onClick={() => window.open(data.pdf_url, '_blank')}>
                  {data.title}
                </h1>
                <Separator />
                <div className="flex flex-wrap gap-1">
                  {Object.entries(data.authors).map(([index, author]) => (
                    <Badge
                      key={index}
                      onClick={() => window.open(`https://scholar.google.com/scholar?hl=en&as_sdt=0%2C44&q=${author.name.toLowerCase().replace(/\s+/g, "%20")}`, '_blank')}
                      variant={"outline"}
                      className="tracking-tighter text-sm text-gray-500 cursor-pointer"
                    >
                      {author.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="summary" className="overflow-y-scroll h-[80%]">
              <div className="flex flex-col gap-2 p-1 text-sm">
                {data.summary}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
