import React from "react"
import { Loader2, Search as SearchIcon, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  setData: React.Dispatch<React.SetStateAction<any[]>>
}

export function ApiFilter({setData}: Props) {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState<string>("")
  const [example, setExample] = React.useState<string>("")
  const [results, setResults] = React.useState<string[]>([])
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSubmit = (text: string) => {
    console.log("submit")
    setExample(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(input)
      filter(input)
    }
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function getData(query: string) {
    const res = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!res.ok) {
      console.error(await res.json())
      throw new Error("Failed to fetch data")
    }

    return res.json()
  }

  const filter = async (input: string) => {
    setIsProcessing(true)
    // await sleep(500)
    const data = await getData(input)
    setResults(data)
    console.log(data)
    // setResults(["hello", "world", input])
    setIsProcessing(false)
  }

  function handleSelect(data: any[]){
    setData(data)
    setOpen(false)
  }

  function handleOpen() {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }
    // setResults([])
    setExample("")
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          asChild
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full pl-4 pr-2 md:w-80"
        >
          <div className="flex flex-row justify-between h-10">
            <div className="flex flex-row gap-2">
              <SearchIcon className="w-4 h-4 my-auto" />
              Search...
            </div>

            <kbd className="hidden sm:block rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold">
              ⌘ K
            </kbd>
          </div>
        </Button>
        <CommandDialog open={open} onOpenChange={() => handleOpen()}>
          <div className="flex items-center px-3 border-b-[1px]">
            <SearchIcon color="gray" size={30}></SearchIcon>
            <Input
              className="placeholder:text-foreground-muted flex h-12 w-[90%] rounded-md bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-b-none border-0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
            />
            <Select defaultValue="relevance">
              <SelectTrigger className="w-[150px] mr-8">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-left">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Pub Date</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {!isProcessing ? (
            <>
              {results.length > 0 && (
                <CommandList>
                  <div className="flex flex-col gap-1 p-2">
                    {results.map((result, index) => (
                      <div
                        onClick={() => handleSelect([result])}
                        className="relative flex cursor-default select-none hover:bg-gray-200 dark:hover:bg-gray-800 items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 p-1"
                        key={index}
                      >
                        {result.title}
                      </div>
                    ))}
                  </div>
                </CommandList>
              )}
            </>
          ) : (
            <div className="flex justify-center m-4">
              <div className="text-sm text-gray-500 animate-spin repeat-infinite">
                <Loader2 />
              </div>
            </div>
          )}
        </CommandDialog>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 rounded-xl p-0">
              <Settings2 className="h-4 w-4" />
              <span className="sr-only">Open popover</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Search</h4>
                <p className="text-sm text-muted-foreground">
                  Change the default search settings
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Max Results</Label>
                  <Input
                    id="width"
                    defaultValue="5"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Database</Label>
                  <Select defaultValue="arvix">
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-left">
                        <SelectItem value="arvix">Arvix</SelectItem>
                        <SelectItem value="pubmed">Pubmed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Search By</Label>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-left">
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="date">Pub Date</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
