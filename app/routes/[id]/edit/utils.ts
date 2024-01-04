import { RouteAnnotation } from "@/prisma/utils"
import { RouteHold } from "./types"

export function buildHoldsDisplayAttributes(
  rawAnnotations: any,
  fitToWidth: number
): RouteHold[] {
  if (!rawAnnotations) return []

  const { predictions, meta } = rawAnnotations as RouteAnnotation

  return predictions.map((p, i) => ({
    id: i,
    x: ((p.x - p.width / 2) * fitToWidth) / meta.width,
    y: ((p.y - p.height / 2) * fitToWidth) / meta.width,
    width: (p.width * fitToWidth) / meta.width,
    height: (p.height * fitToWidth) / meta.width,
    holdType: null,
  }))
}
