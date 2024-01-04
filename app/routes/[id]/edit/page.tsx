"use client"

import {
  BulbFilled,
  CaretLeftFilled,
  CaretRightFilled,
  CheckSquareFilled,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import { Route } from "@prisma/client"
import { Button, Input, Spin, Tag } from "antd"
import classNames from "classnames"
import { useParams } from "next/navigation"
import percentile from "percentile"
import { useCallback, useEffect, useMemo, useState } from "react"
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

const FORM_HEADER_STYLE = "font-bold text-gray-400 text-xs uppercase mr-2 mb-1"

export default function EditRoute() {
  const [route, setRoute] = useState<Route>()
  const [holdsList, setHoldsList] = useState<RouteHold[]>([])
  const [steps, setSteps] = useState<RouteStep[]>([BLANK_STEP])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const currentStep = useMemo(
    () => steps[currentStepIndex],
    [steps, currentStepIndex]
  )
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
    // TODO figure out better data structure for this...
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

  if (!route) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Spin />
      </div>
    )
  }

  return (
    <div>
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
          <div className="text-2xl font-bold mb-2">{route?.title}</div>
          <div className="flex justify-between mb-2 min-h-4">
            <div
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              className={classNames("flex items-center gap-2", {
                "cursor-pointer text-blue-500": currentStepIndex > 0,
                "cursor-not-allowed text-gray-400 pointer-events-none":
                  currentStepIndex === 0,
              })}
            >
              <CaretLeftFilled /> <div>Previous move</div>
            </div>

            <div
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              className={classNames("flex items-center gap-2", {
                "cursor-pointer text-blue-500":
                  currentStepIndex < steps.length - 1,
                "cursor-not-allowed text-gray-400 pointer-events-none":
                  currentStepIndex === steps.length - 1,
              })}
            >
              <div>Next move</div>
              <CaretRightFilled />
            </div>
          </div>
          <div className="flex gap-4 flex-col mt-4">
            <div>
              <div className={FORM_HEADER_STYLE}>Now labeling</div>
              <div className="text-lg font-semibold">
                Move {currentStepIndex + 1} of {steps.length}
              </div>
            </div>
            <div>
              <div className={FORM_HEADER_STYLE}>Placements</div>

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
            <div>
              <div className={FORM_HEADER_STYLE}>Description</div>
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
            </div>
            <div className="cursor-pointer">
              <div className="flex gap-4 items-center justify-between">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  type="dashed"
                  disabled={steps.length <= 1}
                  onClick={() => {
                    setSteps([
                      ...steps.slice(0, currentStepIndex),
                      ...steps.slice(currentStepIndex + 1),
                    ])
                    setCurrentStepIndex(
                      Math.min(steps.length - 2, currentStepIndex)
                    )
                  }}
                >
                  Delete this move
                </Button>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSteps([
                      ...steps.slice(0, currentStepIndex + 1),
                      BLANK_STEP,
                      ...steps.slice(currentStepIndex + 1),
                    ])
                    setCurrentStepIndex(currentStepIndex + 1)
                  }}
                >
                  Add another move
                </Button>
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
