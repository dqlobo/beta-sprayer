"use client"

import { Route } from "@prisma/client"
import { Breadcrumb, BreadcrumbItem, Spinner } from "flowbite-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchRoute } from "./server"

export default function EditRoute() {
  const [route, setRoute] = useState<Route>()
  const { id: routeId } = useParams()

  useEffect(() => {
    fetchRoute(parseInt(routeId as string)).then((r) => setRoute(r!))
  }, [])

  if (!route) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Edit route</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="text-2xl font-bold mt-5">{route?.title}</h2>
    </div>
  )
}
