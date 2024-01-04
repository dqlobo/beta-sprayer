"use client"

import axios, { AxiosResponse } from "axios"
import classNames from "classnames"

import { Breadcrumb, Button, Input, Slider } from "antd"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { PostUploadImage } from "../api/roboflow/upload_image/route"
import DifficultyTag from "./_components/difficultyTag"
import Dropzone from "./_components/dropzone"

const MAX_DIFFICULTY = 12

export default function NewRoute() {
  const [image, setImage] = useState<{ file: File; preview: string }>()
  const [routeName, setRouteName] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (!image?.preview) return
      URL.revokeObjectURL(image.preview)
    }
  }, [])

  const [sliderControlValue, setSliderControlValue] = useState(0)

  const router = useRouter()

  const runRoboflow = useCallback(async () => {
    setLoading(true)

    const { data } = await axios.post<any, AxiosResponse<PostUploadImage>>(
      `/api/roboflow/upload_image?filename=${routeName!}`,
      image!.file
    )
    setLoading(false)
    router.push(`/routes/${data.route.id}/edit`)
    // todo save route in db and route to edit page
  }, [image, routeName, router])
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>New route</Breadcrumb.Item>
      </Breadcrumb>
      <div className="text-2xl font-bold mb-4 mt-2">
        {!image ? "Upload Image" : "Add Route Details"}
      </div>
      {!image && (
        <>
          <div className="text-light text-md text-gray-400 mb-2">
            Add a photo of the entire route below. For best results, take the
            picture with good lighting.
          </div>
          <Dropzone
            onImageReceived={(img) => {
              setImage({ file: img, preview: URL.createObjectURL(img) })
            }}
          />
        </>
      )}
      {image && (
        <>
          <div className="flex gap-4 max-w-fill flex-col lg:flex-row">
            <img
              src={image.preview}
              alt="User uploaded image preview"
              width={200}
              className="rounded-lg"
              onLoad={() => {
                URL.revokeObjectURL(image.preview)
              }}
            />
            <div className="flex-grow flex flex-col gap-2">
              <div>
                <div>
                  <label htmlFor="routeName">Route name</label>
                </div>
                <Input
                  id="routeName"
                  placeholder="My route"
                  required
                  autoFocus
                  onChange={(e) => setRouteName(e.target.value)}
                  value={routeName}
                  disabled={loading}
                />
              </div>
              <div className="self-stretch">
                <div>
                  <label htmlFor="gradeSlider">Difficulty</label>
                </div>
                <div className="flex items-center gap-4">
                  <DifficultyTag grade={sliderControlValue} />
                  <Slider
                    id="gradeSlider"
                    className="flex-grow sm-range"
                    value={sliderControlValue}
                    max={MAX_DIFFICULTY}
                    disabled={loading}
                    onChange={(e) => setSliderControlValue(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-start gap-4 mt-4">
              <Button type="primary" onClick={runRoboflow} loading={loading}>
                {!loading ? "Analyze route" : "Analyzing..."}
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
