"use client"
import axios from "axios"
import classNames from "classnames"
import { Badge, Button, Label, RangeSlider, TextInput } from "flowbite-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import Dropzone from "./dropzone"

const MAX_SLIDER = 100
const MAX_DIFFICULTY = 12

export default function Upload() {
  const [image, setImage] = useState<{ file: File; preview: string }>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (!image?.preview) return
      URL.revokeObjectURL(image.preview)
    }
  }, [])

  const [difficultySlide, setDifficultySlider] = useState(0)
  const humanReadableDifficulty = useMemo(
    () => `v${Math.round((difficultySlide / MAX_SLIDER) * MAX_DIFFICULTY)}`,
    [difficultySlide]
  )
  const runRoboflow = useCallback(async () => {
    setLoading(true)
    // todo disable form state
    const r = await axios.post(
      `/api/roboflow/upload_image?filename=${image!.file.name}`,
      image!.file
    )
    setLoading(false)
    console.log(r.data)
    // todo save route in db and route to edit page
  }, [image])
  return (
    <>
      <h2 className="text-2xl font-bold">
        {!image ? "Upload Image" : "Add Route Details"}
      </h2>
      {!image && (
        <Dropzone
          onImageReceived={(img) => {
            setImage({ file: img, preview: URL.createObjectURL(img) })
          }}
        />
      )}
      {image && (
        <>
          <div className="flex gap-4 max-w-md flex-col">
            <Image
              src={image.preview}
              alt="User uploaded image preview"
              width={150}
              height={20}
              className="rounded-lg"
              onLoad={() => {
                URL.revokeObjectURL(image.preview)
              }}
            />
            <div className="flex-grow flex flex-col gap-2">
              <div>
                <div>
                  <Label htmlFor="routeName" value="Route name" />
                </div>
                <TextInput
                  id="routeName"
                  type="text"
                  placeholder="My route"
                  required
                  autoFocus
                  disabled={loading}
                />
              </div>
              <div className="self-stretch">
                <div>
                  <Label htmlFor="password1" value="Difficulty" />
                </div>
                <div className="flex gap-4">
                  <Badge color="gray" className="text-lg font-semibold">
                    {humanReadableDifficulty}
                  </Badge>
                  <RangeSlider
                    id="gradeSlider"
                    className="flex-grow sm-range"
                    value={difficultySlide}
                    disabled={loading}
                    onChange={(e) =>
                      setDifficultySlider(e.target.valueAsNumber)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-start gap-4 mt-4">
              <Button onClick={runRoboflow} isProcessing={loading}>
                Analyze route
              </Button>
              <Link
                className={classNames("text-sm", {
                  "cursor-not-allowed pointer-events-none text-gray-300":
                    loading,
                  "text-gray-500": !loading,
                })}
                href="#"
                onClick={() => setImage(undefined)}
              >
                Use another image
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
