export type RouteHoldType = "hand" | "foot" | null

export interface RouteHold {
  id: number
  x: number
  y: number
  width: number
  height: number
  holdType: RouteHoldType
  //   confidence
}

export interface RouteMove {
  holds: RouteHold[]
  description: string
  tags: string[]
}
