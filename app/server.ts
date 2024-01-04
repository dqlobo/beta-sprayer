"use server"

import prisma from "@/lib/prisma"
import { Route } from "@prisma/client"

export async function listRecentRoutes() {
  return (await prisma.route.findMany({
    take: 5,
    orderBy: { id: "desc" },
  })) as Route[]
}
