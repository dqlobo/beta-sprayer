"use client"

import { PlusCircleOutlined } from "@ant-design/icons"
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "flowbite-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
export default function Home() {
  const router = useRouter()
  return (
    <>
      <h2 className="text-2xl font-bold">Welcome to BetaSprayer!</h2>{" "}
      <Link href="/new">
        <Button size="sm">
          <PlusCircleOutlined className="mr-2" />
          <span>Add route</span>
        </Button>
      </Link>
      <h3 className="text-md font-light text-gray-400">Recently added</h3>
      <Table striped hoverable>
        <TableBody>
          <TableRow
            className="cursor-pointerf"
            onClick={() => router.push("/routes/3/edit")}
          >
            <TableCell>Test</TableCell>
            <TableCell>asdf</TableCell>
            <TableCell>V4</TableCell>
          </TableRow>
          <TableRow
            className="cursor-pointerf"
            onClick={() => router.push("/routes/3/edit")}
          >
            <TableCell>Test</TableCell>
            <TableCell>asdf</TableCell>
            <TableCell>V4</TableCell>
          </TableRow>
        </TableBody>
      </Table>{" "}
      <div>
        <Pagination
          currentPage={15}
          totalPages={30}
          onPageChange={() => {}}
          className="text-sm flex flex-col justify-center items-center"
          layout="pagination"
        />
      </div>
    </>
  )
}
