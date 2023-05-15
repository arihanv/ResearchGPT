"use client"
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { ComboboxDemo } from './models'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
    name: string
    age: number
}

type Message = {
  sender: string;
  text: string;
};

// async function getData(prompt: string) {
// 	const res = await fetch("/api/query", {
// 		method: "POST",
// 		body: superjson.stringify({ prompt }),
// 	});

// 	if (!res.ok) {
// 		console.error(await res.json());
// 		throw new Error("Failed to fetch data");
// 	}

// 	return res.json();
// }

export default function Chat({name, age}: Props) {
    
  return (
    <>
    <div className="bg-white dark:bg-black w-[90vw] max-w-3xl rounded-xl p-1 border-gray-700 border drop-shadow-xl">
        <div className='flex flex-col'>
          <div className='bg-white dark:bg-black rounded-t-lg p-2 border-gray-700 border flex flex-row justify-between items-center'>
            <div className='flex gap-3'>
              <div className='font-semibold tracking-tight transition-colors'>
                Chat
              </div>
              <Badge variant="secondary" className='dark:bg-green-900 bg-green-200 bg-opacity-60'>Connected</Badge>
            </div>
            <div>
            <ComboboxDemo></ComboboxDemo>
            </div>
            {/* <ComboboxDemo></ComboboxDemo> */}
          </div>
          <div className='min-h-[600px] border-gray-700 border-b border-l border-r p-2'>
            chat window
          </div>
          <div className='bg-white dark:bg-black rounded-b-lg p-2 border-gray-700 border-b border-l border-r flex'>
          <Input className='rounded-r-none' type="text" placeholder="Enter message" />
          <Button className="rounded-l-none flex" type="submit">
            <div>Send</div>
          </Button>
          </div>
        </div>
    </div>
    </>
  )
}