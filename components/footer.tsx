import React from "react"

export default function Footer() {
  return (
    <div className="flex w-full flex-col items-center gap-4 border-t-[1px] p-5 text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
      <div className="text-center">
        Made By{" "}
        <a
          href="https://www.linkedin.com/in/arihanvaranasi/"
          className="underline text-gray-700 dark:text-gray-300"
        >
          Arihan Varanasi
        </a>
      </div>
      <div className="w-full text-xs text-center">
        Thank you to arXiv for use of its open access interoperability.
      </div>
    </div>
  )
}
