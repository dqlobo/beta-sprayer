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
import { Breadcrumb, Button, Input, Spin, Tag, message } from "antd"
import classNames from "classnames"
import Link from "next/link"
import { useParams } from "next/navigation"
import percentile from "percentile"
import { useCallback, useEffect, useMemo, useState } from "react"
import RouteAnnotationSVG from "../_components/routeAnnotationSVG"
import { footHoldColor, handHoldColor } from "./constants"
import { fetchRoute, saveMoves } from "./server"
import { RouteHold, RouteHoldType, RouteMove } from "./types"
import { buildHoldsDisplayAttributes, updateArrayWithPredicate } from "./utils"

const ROUTE_DISPLAY_WIDTH = 500
const MAX_HAND_FOOT_HOLDS = 2

const BLANK_STEP: RouteMove = {
  handHoldIds: [],
  footHoldIds: [],
  description: "",
}

const FORM_HEADER_STYLE = "font-bold text-gray-400 text-xs uppercase mr-2 mb-1"

export default function EditRoute() {
  const [route, setRoute] = useState<Route>()
  const [holdsList, setHoldsList] = useState<RouteHold[]>([])
  const [moves, setMoves] = useState<RouteMove[]>([BLANK_STEP])
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0)
  const [loadingSave, setLoadingSave] = useState(false)
  const currentMove = useMemo(
    () => moves[currentMoveIndex],
    [moves, currentMoveIndex]
  )
  const [toaster, messageContextHolder] = message.useMessage()
  const selectedHoldCount =
    currentMove.handHoldIds.length + currentMove.footHoldIds.length

  const { id: routeId } = useParams()

  useEffect(() => {
    fetchRoute(parseInt(routeId as string)).then((r) => {
      if (!r) return

      setRoute(r!)
      setHoldsList(
        buildHoldsDisplayAttributes(r?.annotations, ROUTE_DISPLAY_WIDTH)
      )
      setMoves((r!.moves || [BLANK_STEP]) as unknown as RouteMove[])
    })
  }, [routeId])

  const holdTypeById = useCallback(
    (id: number): RouteHoldType => {
      if (currentMove.handHoldIds.includes(id)) return "hand"
      if (currentMove.footHoldIds.includes(id)) return "foot"

      return null
    },
    [currentMove]
  )

  const updateCurrentMove = useCallback(
    (changes: Partial<RouteMove>) => {
      setMoves(
        updateArrayWithPredicate(
          moves,
          (_, i) => i === currentMoveIndex,
          changes
        )
      )
    },
    [moves, currentMoveIndex]
  )

  function onClickHold(id: number) {
    const currentHoldType = holdTypeById(id)
    const allSelectedHolds = [
      ...currentMove.footHoldIds,
      ...currentMove.handHoldIds,
    ]
    console.log("click hold")
    if (allSelectedHolds.length === 4 && !allSelectedHolds.includes(id)) {
      toaster.error(
        "This move is out of holds. Try deselecting holds in the Placements section."
      )
    }

    const selectionSequence: RouteHoldType[] = ["hand", "foot", null]
    let nextIndex = (selectionSequence.indexOf(currentHoldType) + 1) % 3

    if (
      selectionSequence[nextIndex] === "hand" &&
      currentMove.handHoldIds.length >= MAX_HAND_FOOT_HOLDS
    ) {
      nextIndex += 1
    }

    if (
      selectionSequence[nextIndex] === "foot" &&
      currentMove.footHoldIds.length >= MAX_HAND_FOOT_HOLDS
    ) {
      nextIndex += 1
    }

    // TODO figure out better data structure for this...
    setMoves(
      moves.map((s, i) => {
        if (i === currentMoveIndex) {
          const handHoldIds =
            selectionSequence[nextIndex] === "hand"
              ? [...currentMove.handHoldIds, id]
              : currentMove.handHoldIds.filter((holdId) => holdId !== id)
          const footHoldIds =
            selectionSequence[nextIndex] === "foot"
              ? [...currentMove.footHoldIds, id]
              : currentMove.footHoldIds.filter((holdId) => holdId !== id)
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
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link href="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit route</Breadcrumb.Item>
        </Breadcrumb>
        <Button
          type="primary"
          loading={loadingSave}
          onClick={async () => {
            setLoadingSave(true)
            const r = await saveMoves(route.id, moves)
            toaster.success(`Saved "${route.title}"`)
            setLoadingSave(false)
          }}
        >
          Save route
        </Button>
      </div>
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
                onClick={() => !loadingSave && onClickHold(hold.id)}
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
              onClick={() => setCurrentMoveIndex(currentMoveIndex - 1)}
              className={classNames("flex items-center gap-2", {
                "cursor-pointer text-blue-500": currentMoveIndex > 0,
                "cursor-not-allowed text-gray-400 pointer-events-none":
                  currentMoveIndex === 0,
              })}
            >
              <CaretLeftFilled /> <div>Previous move</div>
            </div>

            <div
              onClick={() => setCurrentMoveIndex(currentMoveIndex + 1)}
              className={classNames("flex items-center gap-2", {
                "cursor-pointer text-blue-500":
                  currentMoveIndex < moves.length - 1,
                "cursor-not-allowed text-gray-400 pointer-events-none":
                  currentMoveIndex === moves.length - 1,
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
                Move {currentMoveIndex + 1} of {moves.length}
              </div>
            </div>
            <div>
              <div className={FORM_HEADER_STYLE}>Placements</div>

              {selectedHoldCount === 0 && (
                <span className="text-sm text-gray-400 italic">
                  Select up to 4 holds...
                </span>
              )}
              {currentMove.handHoldIds.length > 0 && (
                <Tag
                  color={handHoldColor}
                  closable={!loadingSave}
                  onClose={() => updateCurrentMove({ handHoldIds: [] })}
                >
                  {currentMove.handHoldIds.length} hand
                  {currentMove.handHoldIds.length != 1 ? "s" : ""}
                </Tag>
              )}
              {currentMove.footHoldIds.length > 0 && (
                <Tag
                  color={footHoldColor}
                  closable={!loadingSave}
                  onClose={() => updateCurrentMove({ footHoldIds: [] })}
                >
                  {currentMove.footHoldIds.length}{" "}
                  {currentMove.footHoldIds.length > 1 ? "feet" : "foot"}
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
                value={currentMove.description}
                onChange={(e) =>
                  updateCurrentMove({ description: e.target.value })
                }
                disabled={loadingSave}
                placeholder="Add a note about how to get into this position..."
              />
            </div>
            <div className="cursor-pointer">
              <div className="flex gap-4 items-center justify-between">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  type="dashed"
                  disabled={moves.length <= 1 || loadingSave}
                  onClick={() => {
                    setMoves([
                      ...moves.slice(0, currentMoveIndex),
                      ...moves.slice(currentMoveIndex + 1),
                    ])
                    setCurrentMoveIndex(
                      Math.min(moves.length - 2, currentMoveIndex)
                    )
                  }}
                >
                  Delete this move
                </Button>
                <Button
                  type="dashed"
                  disabled={loadingSave}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setMoves([
                      ...moves.slice(0, currentMoveIndex + 1),
                      { ...currentMove, description: "" }, // add the move again so UX is easier to tweak climber position
                      ...moves.slice(currentMoveIndex + 1),
                    ])
                    setCurrentMoveIndex(currentMoveIndex + 1)
                  }}
                >
                  Add another move
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {messageContextHolder}
    </div>
  )
}
