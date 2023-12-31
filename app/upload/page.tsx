"use client"
import { Button } from "flowbite-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import Dropzone from "./dropzone"

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
}

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
}

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
}

const img = {
  display: "block",
  width: "auto",
  height: "100%",
}

export default function Upload() {
  const [image, setImage] = useState<string>()

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (!image) return
      URL.revokeObjectURL(image!)
    }
  }, [])
  return (
    <>
      <h2 className="text-2xl font-bold">Upload Image</h2>
      {!image && (
        <Dropzone
          onImageReceived={(img) => setImage(URL.createObjectURL(img))}
        />
      )}
      {image && (
        <>
          <Image
            src={image}
            style={img}
            alt="User uploaded image preview"
            // Revoke data uri after image is loaded
            width={200}
            height={200}
            onLoad={() => {
              URL.revokeObjectURL(image)
            }}
          />
          <Button>Use this image</Button>
        </>
      )}
    </>
  )
}
