"use client"

import {
  CaretLeftFilled,
  CaretRightFilled,
  CheckSquareOutlined,
  DeleteFilled,
  PlusCircleFilled,
} from "@ant-design/icons"
import { Route } from "@prisma/client"
import { Button, Form, Spin, Tag } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { MapAreas } from "react-img-mapper"
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
        <Spin />
      </div>
    )
  }
  console.log(annotationsMap)
  return (
    <div>
      {/* <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Edit route</BreadcrumbItem>
      </Breadcrumb> */}

      <div className="flex flex-row gap-4 mt-4">
        <div style={{ position: "relative" }}>
          <img src={route.imageUrl} style={{ maxWidth: 200 }} />
          <svg
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
            }}
          >
            {annotationsMap.map((a) => (
              <rect
                key={a.id}
                x={(a.coords[0] * 200) / 3024}
                y={(a.coords[1] * 200) / 3024}
                width={((a.coords[2] - a.coords[0]) * 200) / 3024}
                height={((a.coords[3] - a.coords[1]) * 200) / 3024}
              />
            ))}
          </svg>
        </div>
        {/* <ImageMapper
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
        /> */}
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

          <div className="text-2xl font-bold mb-2">{route?.title}</div>
          {selectedHolds.length === 0 && (
            <div>Select a hold to annotate the starting position</div>
          )}
          {selectedHolds.length > 0 && (
            <div className="flex gap-2 flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400 text-xs uppercase">
                  Now describing:
                </span>
                <Tag color="gray">Move 1 of 1</Tag>
              </div>

              <div className="text-xs flex items-center gap-1">
                <CheckSquareOutlined />
                {selectedHolds.length} hold
                {selectedHolds.length != 1 ? "s" : ""} selected
              </div>

              <Form layout="vertical" className="mt-2">
                <Form.Item label="Description">
                  <TextArea
                    value=""
                    placeholder="Add a note about how to get into this position..."
                  />
                </Form.Item>
                <Form.Item label="Tags">
                  <TagsInput
                    separators={[","]}
                    value={[]}
                    onChange={() => {}}
                  />
                </Form.Item>
              </Form>
              <div className="cursor-pointer">
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
      <div className="text-right mt-4">
        <Button type="primary">Save route</Button>
      </div>
    </div>
  )
}
