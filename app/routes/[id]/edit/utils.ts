import { RouteAnnotation } from "@/prisma/utils"
import { MapAreas } from "react-img-mapper"

export function buildAnnotationsMap(rawAnnotations: any): MapAreas[] {
  /* {
              id: "test",
              shape: "rect",
              coords: [10, 100, 100, 200],
              fillColor: "rgba(200,200,100,0.3)",
              preFillColor: "rgba(200,200,0,0.3)", */

  if (!rawAnnotations) return []

  const annotations = rawAnnotations as RouteAnnotation
  const preFillColor = "rgba(200,200,100,0.3)"
  const fillColor = "rgba(200,200,0,0.3)"
  return annotations.predictions.map((p, i) => ({
    id: i.toString(),
    shape: "rect",
    coords: [
      p.x - p.width / 2,
      p.y - p.height / 2,
      p.x + p.width / 2,
      p.y + p.height / 2,
    ],
    fillColor,
    preFillColor,
  }))
}
