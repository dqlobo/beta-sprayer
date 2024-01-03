import prisma from "@/lib/prisma"
import { transformAnnotations } from "@/prisma/utils"
import { Route } from "@prisma/client"
import { put } from "@vercel/blob"
import axios from "axios"
import { NextResponse } from "next/server"

export interface PostUploadImage {
  route: Route
}

const CLIMBING_MODEL_URL = "https://detect.roboflow.com/climbing-replica-test/1"

export async function POST(
  request: Request
): Promise<NextResponse<PostUploadImage>> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  const blob = await put(filename!, request.body!, {
    access: "public",
  })

  const { url } = blob

  const roboflowResponse = await axios.post(CLIMBING_MODEL_URL, undefined, {
    params: { api_key: process.env.ROBOFLOW_API_KEY, image: url },
  })

  const route = await prisma.route.create({
    data: {
      title: filename!,
      imageUrl: url,
      annotations: transformAnnotations(roboflowResponse.data) as any,
      grade: 2,
    },
  })
  return NextResponse.json({
    route,
  })
}
