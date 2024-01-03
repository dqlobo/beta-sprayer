"use client"

import {
  CaretLeftFilled,
  CaretRightFilled,
  CheckSquareOutlined,
  DeleteFilled,
  PlusCircleFilled,
} from "@ant-design/icons"
import { Route } from "@prisma/client"
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Label,
  Spinner,
  Textarea,
} from "flowbite-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import ImageMapper, { MapAreas } from "react-img-mapper"
import { TagsInput } from "react-tag-input-component"
import { fetchRoute } from "./server"
import { buildAnnotationsMap } from "./utils"

export default function EditRoute() {
  const [route, setRoute] = useState<Route>()
  const [annotationsMap, setAnnotationsMap] = useState<MapAreas[]>([])
  const [selectedHolds, setSelectedHolds] = useState<number[]>([])
  const { id: routeId } = useParams()
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    fetchRoute(parseInt(routeId as string)).then((r) => {
      setRoute(r!)
      setAnnotationsMap(buildAnnotationsMap(r?.annotations))
      console.log(buildAnnotationsMap(r?.annotations))
    })
  }, [routeId])

  function clearSelectedHolds() {
    const containerRefTypeWorkaround = containerRef.current as any
    containerRefTypeWorkaround.clearHighlightedArea()
    // setSelectedHolds([])
  }
  function appendSelection(e: any) {
    setSelectedHolds([...selectedHolds, e])
  }
  console.log(selectedHolds.length)
  if (!route) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Edit route</BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-row gap-4 mt-4">
        <ImageMapper
          containerRef={containerRef as { current: HTMLDivElement }}
          // Note - ImageMapper doesn't work with HMR
          src={route.imageUrl}
          parentWidth={300}
          responsive
          active
          stayMultiHighlighted
          stayHighlighted
          onClick={(e) => setSelectedHolds([...selectedHolds, 1])}
          map={{
            name: "holds",
            areas: annotationsMap,
          }}
        />
        <div className="flex-grow">
          {selectedHolds.length > 0 && (
            <div className="flex justify-between mb-2 min-h-4">
              <div className="flex items-center gap-2 cursor-pointer">
                <CaretLeftFilled /> <div>Previous move</div>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <div>Next move</div>
                <CaretRightFilled />
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold">{route?.title}</h2>
          {selectedHolds.length === 0 && (
            <div>Select a hold to annotate the starting position</div>
          )}
          {selectedHolds.length > 0 && (
            <div className="flex gap-2 flex-col">
              <div className="flex items-center gap-2 my-2">
                <span className="font-bold text-gray-400 text-xs uppercase">
                  Now describing:
                </span>
                <Badge color="gray">Move 1 of 1</Badge>
              </div>

              {/* <hr className="mb-2" /> */}
              <div className="text-xs flex items-center gap-1">
                <CheckSquareOutlined />
                {selectedHolds.length} hold
                {selectedHolds.length != 1 ? "s" : ""} selected
              </div>

              <div className="flex-grow">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  value=""
                  placeholder="Add a note about how to get into this position..."
                ></Textarea>
                <TagsInput value={[]} onChange={() => {}} />
              </div>
              <div className="cursor-pointer my-1">
                <div className="flex gap-4 items-center justify-between">
                  <div className="font-light text-sm flex items-center gap-1 text-red-500">
                    <DeleteFilled /> <div>Delete this move</div>
                  </div>
                  <div className="font-light text-sm flex items-center gap-1 text-blue-500">
                    <PlusCircleFilled /> <div>Add another move</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button>Save route</Button>
      </div>
    </div>
  )
}
