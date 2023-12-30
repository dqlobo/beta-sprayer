"use client"

import { Card } from "flowbite-react"

export const Main = () => {
  return (
    <Card>
      <h2 className="text-2xl font-bold">Step 1: Photograph the route</h2>
      <div className="text-med text-gray-500 font-light rounded-md">
        Click or drag to upload your photos:
      </div>
      <div className="border-4 border-dashed border-gray-200 rounded-md flex justify-center items-center p-4 h-48">
        <svg
          className="w-12 h-12 text-gray-400 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
          <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>
      </div>
      {/* <div className="flex justify-end mt-4">
        <Button>Next</Button>
      </div> */}
    </Card>
  )
}
