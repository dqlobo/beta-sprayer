"use client"

import {
  BulbFilled,
  CaretLeftFilled,
  CaretRightFilled,
  CheckSquareFilled,
  DeleteFilled,
  PlusCircleFilled,
} from "@ant-design/icons"
import { Route } from "@prisma/client"
import { Button, Input, Pagination, Spin, Tag } from "antd"
import { useParams } from "next/navigation"
import percentile from "percentile"
import { useCallback, useEffect, useState } from "react"
import RouteAnnotationSVG from "../_components/routeAnnotationSVG"
import { footHoldColor, handHoldColor } from "./constants"
import { fetchRoute } from "./server"
import { RouteHold, RouteHoldType, RouteStep } from "./types"
import { buildHoldsDisplayAttributes, updateArrayWithPredicate } from "./utils"

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
  const currentStep = steps[currentStepIndex]
  const selectedHoldCount =
    currentStep.handHoldIds.length + currentStep.footHoldIds.length

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

  const holdTypeById = useCallback(
    (id: number): RouteHoldType => {
      if (currentStep.handHoldIds.includes(id)) return "hand"
      if (currentStep.footHoldIds.includes(id)) return "foot"

      return null
    },
    [currentStep]
  )

  function updateHolds(
    predicate: (hold: RouteHold) => boolean,
    changes: Partial<RouteHold>
  ) {
    const newHoldsList = updateArrayWithPredicate<RouteHold>(
      holdsList,
      predicate,
      changes
    )
    setHoldsList(newHoldsList)
    setSteps(
      updateArrayWithPredicate<RouteStep>(
        steps,
        (s, i) => i === currentStepIndex,
        {
          handHoldIds: newHoldsList
            .filter((h) => h.holdType === "hand")
            .map((h) => h.id),
          footHoldIds: newHoldsList
            .filter((h) => h.holdType === "foot")
            .map((h) => h.id),
        }
      )
    )
  }

  function displayAnnotationsForStepIndex(index: number) {
    // const newStep = steps[index]
    // setHoldsList(
    //   holdsList.map((h) => {
    //     if (newStep.handHoldIds.includes(h.id)) {
    //       return { ...h, holdType: "hand" }
    //     } else if (newStep.footHoldIds.includes(h.id)) {
    //       return { ...h, holdType: "foot" }
    //     } else {
    //       return { ...h, holdType: null }
    //     }
    //   })
    // )
  }

  function onClickHold(id: number) {
    const currentHoldType = holdTypeById(id)

    const selectionSequence: RouteHoldType[] = ["hand", "foot", null]
    let nextIndex = (selectionSequence.indexOf(currentHoldType) + 1) % 3

    if (
      selectionSequence[nextIndex] === "hand" &&
      currentStep.handHoldIds.length >= MAX_HAND_FOOT_HOLDS
    ) {
      nextIndex += 1
    }

    if (
      selectionSequence[nextIndex] === "foot" &&
      currentStep.footHoldIds.length >= MAX_HAND_FOOT_HOLDS
    ) {
      nextIndex += 1
    }

    setSteps(
      steps.map((s, i) => {
        if (i === currentStepIndex) {
          const handHoldIds =
            selectionSequence[nextIndex] === "hand"
              ? [...currentStep.handHoldIds, id]
              : currentStep.handHoldIds.filter((holdId) => holdId !== id)
          const footHoldIds =
            selectionSequence[nextIndex] === "foot"
              ? [...currentStep.footHoldIds, id]
              : currentStep.footHoldIds.filter((holdId) => holdId !== id)
          return { ...s, handHoldIds, footHoldIds }
        }
        return s
      })
    )
  }

  function toggleHoldType(holdToUpdate: RouteHold) {
    // State progression: hand -> foot -> null (not selected)
    const holdProgression: RouteHoldType[] = ["hand", "foot", null]
    let nextIndex = (holdProgression.indexOf(holdToUpdate.holdType) + 1) % 3

    while (
      holdProgression[nextIndex] &&
      selectedAnnotations.filter(
        (h) => h.holdType === holdProgression[nextIndex]
      ).length >= MAX_HAND_FOOT_HOLDS
    ) {
      nextIndex += 1
    }

    updateHolds((h) => h.id === holdToUpdate.id, {
      holdType: holdProgression[nextIndex],
    })
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
                holdType={holdTypeById(hold.id)}
                x={hold.x}
                y={hold.y}
                width={hold.width}
                height={hold.height}
                onClick={() => onClickHold(hold.id)}
              />
            ))}
          </svg>
          <div className="text-xs text-gray-400 italic">
            <BulbFilled /> {holdsList.length} holds,{" "}
            {percentile(
              95,
              holdsList.map((h) => h.confidence || 0)
            ).toLocaleString("en-us", {
              style: "percent",
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            })}{" "}
            confidence (p95)
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex justify-between mb-2 min-h-4">
            <div className="flex items-center gap-2 cursor-pointer">
              <CaretLeftFilled /> <div>Previous move</div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <div>Next move</div>
              <CaretRightFilled />
            </div>
          </div>

          <div className="text-2xl font-bold mb-2">{route?.title}</div>

          <div className="flex gap-2 flex-col">
            <Pagination
              current={currentStepIndex + 1}
              total={steps.length}
              onChange={(p) => setCurrentStepIndex(p - 1)}
              defaultPageSize={1}
              showTotal={(t) => [t, ` step${t == 1 ? "" : "s"}`].join("")}
            />

            <div className="flex items-center min-h-6">
              <span className="font-bold text-gray-400 text-xs uppercase mr-2">
                Placements
              </span>

              {selectedHoldCount === 0 && (
                <span className="text-sm text-gray-400 italic">
                  Select up to 4 holds...
                </span>
              )}
              {currentStep.handHoldIds.length > 0 && (
                <Tag
                  color={handHoldColor}
                  closable
                  onClose={() =>
                    updateHolds((h) => h.holdType === "hand", {
                      holdType: null,
                    })
                  }
                >
                  {currentStep.handHoldIds.length} hand
                  {currentStep.handHoldIds.length != 1 ? "s" : ""}
                </Tag>
              )}
              {currentStep.footHoldIds.length > 0 && (
                <Tag
                  color={footHoldColor}
                  closable
                  onClose={() =>
                    updateHolds((h) => h.holdType === "foot", {
                      holdType: null,
                    })
                  }
                >
                  {currentStep.footHoldIds.length}{" "}
                  {currentStep.footHoldIds.length > 1 ? "feet" : "foot"}
                </Tag>
              )}
              {selectedHoldCount === 4 && (
                <Tag color="success" icon={<CheckSquareFilled />}>
                  Done
                </Tag>
              )}
            </div>
            <div className="font-bold text-gray-400 text-xs uppercase">
              Description
            </div>
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 7 }}
              value={currentStep.description}
              onChange={(e) =>
                setSteps(
                  updateArrayWithPredicate(
                    steps,
                    (s, i) => i === currentStepIndex,
                    { description: e.target.value }
                  )
                )
              }
              placeholder="Add a note about how to get into this position..."
            />

            <div className="cursor-pointer">
              <div className="flex gap-4 items-center justify-between">
                <div className="font-light text-sm flex items-center gap-1 text-red-500">
                  <DeleteFilled /> <div>Delete this move</div>
                </div>
                <div
                  className="font-light text-sm flex items-center gap-1 text-blue-500"
                  onClick={() => {
                    setSteps([
                      ...steps.slice(0, currentStepIndex),
                      BLANK_STEP,
                      ...steps.slice(currentStepIndex),
                    ])
                    setCurrentStepIndex(currentStepIndex + 1)
                  }}
                >
                  <PlusCircleFilled /> <div>Add another move</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right mt-4">
        <Button type="primary">Save route</Button>
      </div>
    </div>
  )
}
