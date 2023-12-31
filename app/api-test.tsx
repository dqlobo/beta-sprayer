"use client"

import { useEffect, useState } from "react"

export const Uploader = () => {
  const [data, setData] = useState<any | null>(null)

  useEffect(() => {
    // on load
    const fetchAPI = async () => {
      const d = await fetch("/api/mirror")
      const response = await d.json()
      setData(response)
    }
    fetchAPI()
  }, [])
  return <div>{data?.status}asdf</div>
}
