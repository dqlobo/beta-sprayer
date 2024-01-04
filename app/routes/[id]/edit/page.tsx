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
import { useEffect, useState } from "react"
import RouteAnnotationSVG from "../_components/routeAnnotationSVG"
import { fetchRoute } from "./server"
import { RouteHold, RouteHoldType, RouteStep } from "./types"
import { buildHoldsDisplayAttributes } from "./utils"

const ROUTE_DISPLAY_WIDTH = 300
const MAX_HAND_FOOT_HOLDS = 2

const BLANK_STEP: RouteStep = {
  handHoldIds: [],
  footHoldIds: [],
  description: "",
}

export default function EditRoute() {
  const [route, setRoute] = useState<Route>()
  const [holdsList, setHoldsList] = useState<RouteHold[]>([])
  const [steps, setSteps] = useState<RouteStep[]>([BLANK_STEP])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

  const { id: routeId } = useParams()

  useEffect(() => {
    fetchRoute(parseInt(routeId as string)).then((r) => {
      setRoute(r!)
      setHoldsList(
        buildHoldsDisplayAttributes(r?.annotations, ROUTE_DISPLAY_WIDTH)
      )
    })
  }, [routeId])

  const selectedAnnotations = holdsList.filter((h) => h.holdType)

  function updateHold(holdToUpdate: RouteHold) {
    setHoldsList(
      holdsList.map((h) => {
        if (h.id === holdToUpdate.id) {
          return holdToUpdate
        }
        return h
      })
    )
  }

  function toggleHoldType(holdToUpdate: RouteHold) {
    // State progression: hand -> foot -> null (not selected)
    const holdProgression: RouteHoldType[] = ["hand", "foot", null]
    let nextIndex = (holdProgression.indexOf(holdToUpdate.holdType) + 1) % 3

    while (
      holdProgression[nextIndex] &&
      holdsList.filter((h) => h.holdType === holdProgression[nextIndex])
        .length >= MAX_HAND_FOOT_HOLDS
    ) {
      nextIndex += 1
    }

    updateHold({ ...holdToUpdate, holdType: holdProgression[nextIndex] })
  }

  if (!route) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Spin />
      </div>
    )
  }

  return (
    <div>
      {/* <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Edit route</BreadcrumbItem>
      </Breadcrumb> */}

      <div className="flex flex-row gap-4 mt-4">
        <div style={{ position: "relative" }}>
          <img
            src={route.imageUrl}
            style={{ maxWidth: ROUTE_DISPLAY_WIDTH, userSelect: "none" }}
          />
          <svg
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
            }}
          >
            {holdsList.map((hold) => (
              <RouteAnnotationSVG
                key={hold.id}
                holdType={hold.holdType}
                x={hold.x}
                y={hold.y}
                width={hold.width}
                height={hold.height}
                onClick={() => toggleHoldType(hold)}
              />
            ))}
          </svg>
        </div>

        <div className="flex-grow">
          {selectedAnnotations.length > 0 && (
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
          {selectedAnnotations.length === 0 && (
            <div>Select a hold to annotate the starting position</div>
          )}
          {selectedAnnotations.length > 0 && (
            <div className="flex gap-2 flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400 text-xs uppercase">
                  Now describing:
                </span>
                <Tag color="gray">
                  Move {currentStepIndex + 1} of {steps.length}
                </Tag>
              </div>

              <div className="text-xs flex items-center gap-1">
                <CheckSquareOutlined />
                {selectedAnnotations.length} hold
                {selectedAnnotations.length != 1 ? "s" : ""} selected
              </div>

              <Form layout="vertical" className="mt-2">
                <Form.Item label="Description">
                  <TextArea
                    value=""
                    placeholder="Add a note about how to get into this position..."
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
