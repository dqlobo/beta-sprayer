import prisma from "@/lib/prisma"
import { Route } from "@prisma/client"
import { put } from "@vercel/blob"
import axios, { AxiosResponse } from "axios"
import { NextResponse } from "next/server"

interface RoboflowInferenceResponse {
  predictions: any
}

export interface PostUploadImage {
  route: Route
}

export async function POST(
  request: Request
): Promise<NextResponse<PostUploadImage>> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  const blob = await put(filename!, request.body!, {
    access: "public",
  })

  const { url } = blob

  const roboflowResponse = await axios.post<
    any,
    AxiosResponse<RoboflowInferenceResponse>
  >("https://detect.roboflow.com/face-detection-mik1i/21", undefined, {
    params: { api_key: process.env.ROBOFLOW_API_KEY, image: url },
  })

  const route = await prisma.route.create({
    data: {
      title: filename!,
      imageUrl: url,
      annotations: roboflowResponse.data as any,
      grade: 2,
    },
  })
  return NextResponse.json({
    route,
  })
}
