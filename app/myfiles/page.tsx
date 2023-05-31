"use client"

import React from "react"
import { pdfDb, pdfStore } from "@/api/det"
import { generateRandomStringWithSeed } from "@/api/utils"
import Cookie from "js-cookie"
import { Loader2, Upload } from "lucide-react"

import Thumbnail from "@/components/pdfDash/thumbnail"

type Props = {}

export default function Hello({}: Props) {
  const [key, setKey] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [docInfo, setDocInfo] = React.useState<any>({})
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false)

  async function test() {
    let result = await pdfStore.list()
    console.log(result)
    const apikey = Cookie.get("key")
    setKey(generateRandomStringWithSeed(apikey as string, apikey as string, 5))
  }

  const handleFileChange = async (event: any) => {
    if (key == "") return
    const res = await pdfDb.get(key)
    if (res != null) {
      if (res.numDocs != null && (res.numDocs as number) > 2) {
        console.log("too many docs")
        return
      }
    }
    setUploading(true)
    const file = event.target.files[0]
    const maxSize = 20 * 1024 * 1024 // 20 MB in bytes
    if (res != null) {
      if (file && file.size <= maxSize && file.type === "application/pdf") {
        const reader = new FileReader()
        // const num = res.numDocs
        // const docNum = `docs${num}`

        let missingDocNum = null

        for (let i = 0; i <= 2; i++) {
          const docNum = `docs${i}`
          if (!(docNum in res)) {
            missingDocNum = i
            break
          }
        }
        console.log(missingDocNum)

        const docNum = `docs${missingDocNum}`

        reader.onload = async () => {
          const fileData = reader.result

          if (typeof fileData === "string") {
            const buffer = Buffer.from(fileData, "binary")
            console.log("uploading file, please wait...")
            const driveFile = await pdfStore.put(`${key}/${docNum}.pdf`, {
              data: buffer,
            })
            const updatedDoc = {
              [`${docNum}`]: {
                name: "Sample file",
                path: `${key}/${docNum}.pdf`,
              },
              numDocs: pdfDb.util.increment(1),
            }
            await pdfDb.update(updatedDoc, key)
            console.log("File uploaded:", driveFile)
            // setUploading(false)
            window.location.href = `/myfiles/${key}/${docNum}.pdf`
          } else if (fileData instanceof ArrayBuffer) {
            const uint8Array = new Uint8Array(fileData)
            console.log("uploading file, please wait...")
            const driveFile = await pdfStore.put(`${key}/${docNum}.pdf`, {
              data: uint8Array,
            })
            const updatedDoc = {
              [`${docNum}`]: {
                name: "Sample file",
                path: `${key}/${docNum}.pdf`,
              },
              numDocs: pdfDb.util.increment(1),
            }
            await pdfDb.update(updatedDoc, key)
            console.log("File uploaded:", driveFile)
            // setUploading(false)
            window.location.href = `/myfiles/${key}/${docNum}.pdf`
          } else {
            console.log("Invalid file data format")
            // setUploading(false)
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        console.log("Invalid file")
      }
    }
  }

  React.useEffect(() => {
    test()
  }, [])

  React.useEffect(() => {
    if (!Cookie.get("key")) {
      window.location.href = "/auth"
    }
  }, [])

  React.useEffect(() => {
    console.log(key)
    if (key == "") return
    async function exp() {
      setLoading(true)
      const res = await pdfDb.get(key)
      if (res == null) {
        pdfDb.put({ numDocs: 0 }, key)
      } else {
        setDocInfo(await pdfDb.get(key))
        console.log(await pdfDb.get(key))
      }
      console.log("done")
      setLoading(false)
    }
    exp()
  }, [key])

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <section className="m-auto grid max-w-[1200px] items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Your Uploads
        </h1>
        <p className="text-center text-lg text-muted-foreground sm:text-xl">
          The files you have uploaded will be displayed here.
        </p>
      </div>
      <div className="flex h-[769px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
        {!loading ? (
          <div className="flex gap-4">
            {Object.keys(docInfo).map((key) => {
              if (key.substring(0, 4) == "docs") {
                const doc = docInfo[key]
                console.log(doc)
                return (
                  <div key={key}>
                    {/* <span>{doc.name}</span> */}
                    <Thumbnail
                      thumb_path={doc.thumb_path}
                      name={doc.name}
                      path={doc.path}
                    />
                  </div>
                )
              }
              return null
            })}

            {/* {Object.keys(docInfo).length - 2 < 3 && ( */}
            {Object.keys(docInfo).length - 2 < 3 && (
              <div
                onClick={handleButtonClick}
                className="flex h-[335px] w-[225px] cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-500 bg-gray-400 bg-opacity-40 dark:bg-gray-800"
              >
                {uploading ? (
                  <div className="m-auto animate-spin text-gray-400 repeat-infinite dark:text-gray-600">
                    <Loader2 size={30} />
                  </div>
                ) : (
                  <Upload />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full">
            <div className="m-auto animate-spin text-gray-400 repeat-infinite dark:text-gray-600">
              <Loader2 size={30} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
