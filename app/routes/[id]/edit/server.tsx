"use server"

import prisma from "@/lib/prisma"

export async function fetchRoute(id: number) {
  return await prisma.route.findUnique({
    where: { id },
  })
}

export async function saveMoves(routeId: number, moves: any) {
  return await prisma.route.update({
    where: { id: routeId },
    data: { moves },
  })
}
