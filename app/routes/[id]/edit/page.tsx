"use client"

import { Route } from "@prisma/client"
import { Breadcrumb, BreadcrumbItem, Spinner } from "flowbite-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ImageMapper, { MapAreas } from "react-img-mapper"
import { fetchRoute } from "./server"
import { buildAnnotationsMap } from "./utils"

export default function EditRoute() {
  const [route, setRoute] = useState<Route>()
  const [annotationsMap, setAnnotationsMap] = useState<any>()
  const { id: routeId } = useParams()
  const [selectedHold, setSelectedHold] = useState<MapAreas>()

  useEffect(() => {
    fetchRoute(parseInt(routeId as string)).then((r) => {
      setRoute(r!)
      setAnnotationsMap(buildAnnotationsMap(r?.annotations))
      console.log(buildAnnotationsMap(r?.annotations))
    })
  }, [])

  if (!route) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }
  console.log(selectedHold?.coords)
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Edit route</BreadcrumbItem>
      </Breadcrumb>
      <h2 className="text-2xl font-bold mt-5">{route?.title}</h2>
      <div className="flex flex-row gap-2">
        <ImageMapper
          // Note - ImageMapper doesn't work with HMR
          src={route.imageUrl}
          fillColor="#ccc"
          parentWidth={400}
          active
          responsive
          strokeColor="#fff000"
          onClick={(e) => setSelectedHold(e)}
          map={{
            name: "holds",
            areas: annotationsMap,
          }}
        />
        {!selectedHold && <div>Select a hold to get started</div>}
        {selectedHold && (
          <div>
            Hold selected: {selectedHold.id}
            <div
              style={{
                minHeight: 150,
                width: 150,
                background: `url(${route.imageUrl}) ${
                  (selectedHold.coords[0] /
                    (route.annotations as any).meta.width) *
                  100
                }% ${
                  (selectedHold.coords[1] /
                    (route.annotations as any).meta.height) *
                  100
                }%`,
                backgroundSize: `auto ${
                  ((route.annotations as any).meta.height * 150) /
                  (selectedHold.coords[3] - selectedHold.coords[1])
                }px`,
                // backgroundPositionX: `${
                //   (selectedHold.coords[0] /
                //     (route.annotations as any).meta.width) *
                //   100
                // }%`,
                // backgroundPositionY: `${
                //   (selectedHold.coords[1] /
                //     (route.annotations as any).meta.height) *
                //   100
                // }%`,
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* <img
                src={route.imageUrl}
                width={200}
                style={{
                  clipPath: "inset(20%, 20%, 40%, 50%)",
                }}
              /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
