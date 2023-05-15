import React from "react"
import { Search as SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"

export function ApiFilter() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState<string>("")
  const [example, setExample] = React.useState<string>("")
  const [results, setResults] = React.useState<string[]>([])

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

  const filter = (input: string) => {
    setResults(["hello", "world", input])
  }

  function handleOpen() {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }
    setResults([])
    setExample("")
  }

  return (
    <>
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
        <div className="flex items-center px-3 border-b-[1px] gap-2">
          <SearchIcon color="gray" size={20}></SearchIcon>
          <Input
            className="placeholder:text-foreground-muted flex h-12 w-[80%] rounded-md bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-b-none border-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
          />
          <div>hello</div>
        </div>
        {results.length > 0 && (
          <CommandList>
            <div className="flex flex-col gap-1 p-2">
              {results.map((result) => (
                <div
                  className="relative flex cursor-default select-none hover:bg-gray-100 items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 p-1"
                  key={result}
                >
                  {result}
                </div>
              ))}
            </div>
          </CommandList>
        )}
      </CommandDialog>
    </>
  )
}
