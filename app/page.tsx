"use client"

import { PlusCircleOutlined } from "@ant-design/icons"
import { Route } from "@prisma/client"
import { Button, Spin } from "antd"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { listRecentRoutes } from "./server"
export default function Home() {
  const router = useRouter()
  const [recentRoutes, setRecentRoutes] = useState<Route[]>()
  useEffect(() => {
    async function fetchRouteData() {
      const resp = await listRecentRoutes()
      setRecentRoutes(resp)
    }
    fetchRouteData()
  }, [])
  return (
    <>
      <h2 className="text-2xl font-bold">Welcome to BetaSprayer!</h2>{" "}
      <Link href="/new">
        <Button type="primary" icon={<PlusCircleOutlined />}>
          Add route
        </Button>
      </Link>
      <div className="text-md mt-4 font-light text-gray-400">
        Recently added
      </div>
      {!recentRoutes && <Spin />}
      {recentRoutes && (
        <table>
          {recentRoutes!.map((route) => (
            <tr key={route.id} className="border-b-2  border-black border">
              <td width={300}>{route.title}</td>
              <td>
                <Link href={`/routes/${route.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </table>
      )}
    </>
  )
}
