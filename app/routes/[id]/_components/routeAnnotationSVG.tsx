import { gray } from "@ant-design/colors"
import hexToRgba from "hex-to-rgba"
import { MouseEventHandler, useMemo } from "react"
import { footHoldColor, handHoldColor } from "../edit/constants"
import { RouteHoldType } from "../edit/types"

interface Props {
  x: number
  y: number
  width: number
  height: number
  holdType?: RouteHoldType
  onClick: MouseEventHandler<SVGRectElement>
}

export default function RouteAnnotationSVG(props: Props) {
  const color = useMemo(() => {
    if (!props.holdType) return hexToRgba(gray[3], 0.2)

    return props.holdType === "hand"
      ? hexToRgba(handHoldColor, 0.7)
      : hexToRgba(footHoldColor, 0.7)
  }, [props.holdType])

  return (
    <rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      fill={color}
      stroke={hexToRgba("#fff", 0.5)}
      strokeWidth={2}
      onClick={props.onClick}
    />
  )
}
