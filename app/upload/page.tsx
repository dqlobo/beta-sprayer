"use client"
import axios from "axios"
import { Button } from "flowbite-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import Dropzone from "./dropzone"

export default function Upload() {
  const [image, setImage] = useState<{ file: File; preview: string }>()

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (!image?.preview) return
      URL.revokeObjectURL(image.preview)
    }
  }, [])
  const runRoboflow = useCallback(async () => {
    const r = await axios.post(
      `/api/roboflow/upload_image?filename=${image!.file.name}`,
      image!.file
    )
    console.log(r.data)
  }, [image])
  return (
    <>
      <h2 className="text-2xl font-bold">Upload Image</h2>
      {!image && (
        <Dropzone
          onImageReceived={(img) => {
            console.log(img)
            setImage({ file: img, preview: URL.createObjectURL(img) })
          }}
        />
      )}
      {image && (
        <>
          <Image
            src={image.preview}
            alt="User uploaded image preview"
            className="max-h-80"
            height={20}
            width={200}
            // style={{ objectFit: "contain" }}
            onLoad={() => {
              URL.revokeObjectURL(image.preview)
            }}
          />
          <Button onClick={runRoboflow}>Use this image</Button>
        </>
      )}
    </>
  )
}
