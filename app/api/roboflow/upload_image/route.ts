import { put } from "@vercel/blob"
import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")

  const blob = await put(filename!, request.body!, {
    access: "public",
  })

  const { url } = blob

  const roboflowResponse = await axios.post(
    "https://detect.roboflow.com/face-detection-mik1i/21",
    undefined,
    { params: { api_key: process.env.ROBOFLOW_API_KEY, image: url } }
  )

  return NextResponse.json({ image: blob, modelResult: roboflowResponse.data })
}
