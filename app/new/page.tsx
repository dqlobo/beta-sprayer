"use client"

import axios, { AxiosResponse } from "axios"
import classNames from "classnames"
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Label,
  RangeSlider,
  TextInput,
} from "flowbite-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { PostUploadImage } from "../api/roboflow/upload_image/route"
import Dropzone from "./dropzone"

const MAX_SLIDER = 100
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
  const routeGrade = useMemo(
    () => Math.round((sliderControlValue / MAX_SLIDER) * MAX_DIFFICULTY),
    [sliderControlValue]
  )

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
      {" "}
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Add route</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="text-2xl font-bold">
        {!image ? "Upload Image" : "Add Route Details"}
      </h2>
      {!image && (
        <>
          <div className="text-light text-sm text-gray-400">
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
            <Image
              src={image.preview}
              alt="User uploaded image preview"
              width={200}
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
                  onChange={(e) => setRouteName(e.target.value)}
                  value={routeName}
                  disabled={loading}
                />
              </div>
              <div className="self-stretch">
                <div>
                  <Label htmlFor="gradeSlider" value="Difficulty" />
                </div>
                <div className="flex gap-4">
                  <Badge color="gray" className="text-lg font-semibold">
                    v{routeGrade}
                  </Badge>
                  <RangeSlider
                    id="gradeSlider"
                    className="flex-grow sm-range"
                    value={sliderControlValue}
                    disabled={loading}
                    onChange={(e) =>
                      setSliderControlValue(e.target.valueAsNumber)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-start gap-4 mt-4">
              <Button onClick={runRoboflow} isProcessing={loading}>
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
