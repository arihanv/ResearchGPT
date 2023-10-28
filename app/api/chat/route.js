import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function iteratorToStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
 
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

async function* makeIterator(response) {
  for await (const part of response) {
    yield part.choices[0]?.delta?.content || ''
  }
}

export async function POST(req) {
  const body = await req.json()

  const response = await openai.chat.completions.create(
    {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "user",
          content: body.prompt,
        },
      ],
    },
    { responseType: "stream" }
  );
  const iterator = makeIterator(response)
  const stream = iteratorToStream(iterator)
  return new NextResponse(stream)
}