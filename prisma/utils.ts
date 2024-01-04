import { Prisma } from "@prisma/client"

export interface RouteAnnotation {
  meta: {
    width: number
    height: number
  }
  predictions: {
    x: number
    y: number
    width: number
    height: number
    confidence: number
    tags: string[]
  }[]
}

export function transformAnnotations(
  annotations: Prisma.JsonObject | Prisma.JsonArray
): RouteAnnotation | undefined {
  /* Sample stored inference response from Roboflow
    {
        "time": 0.8370022379995135,
        "image": { "width": 3024, "height": 4032 },
        "frame_id": null,
        "predictions": [
            {
            "x": 1354,
            "y": 2063.5,
            "class": "hold",
            "width": 404,
            "height": 349,
            "class_id": 0,
            "confidence": 0.9256292581558228,
            "tracker_id": null,
            "class_confidence": null
            },
            ...
        ]
    }
    todo consider just storing raw
    */
  if (typeof annotations !== "object") return
  const annotationsObject = annotations as any

  return {
    meta: {
      width: annotationsObject.image.width,
      height: annotationsObject.image.height,
    },
    predictions: annotationsObject.predictions.map((p: any) => ({
      x: p.x,
      y: p.y,
      width: p.width,
      height: p.height,
      confidence: p.confidence,
      tags: [],
    })),
  } as RouteAnnotation
}
