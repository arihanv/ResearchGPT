import React from 'react'

type Props = {}

export default function Footer({}: Props) {
  return (
    <div className='text-sm w-full flex flex-col dark:border-gray-800 border-t-[1px] items-center p-5 text-gray-400 dark:text-gray-600 gap-4'>
        <div className='text-center'>
            Made By <a href='https://www.linkedin.com/in/arihanvaranasi/' className='underline'>Arihan Varanasi</a>
        </div>
        <div className='text-start w-full text-xs'>
            Thank you to arXiv for use of its open access interoperability.
        </div>
    </div>
  )
}