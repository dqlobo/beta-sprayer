"use server"

import prisma from "@/lib/prisma"

export async function fetchRoute(id: number) {
  return await prisma.route.findUnique({
    where: { id },
  })
}
