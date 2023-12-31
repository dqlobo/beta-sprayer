import { Button } from "flowbite-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <h2 className="text-2xl font-bold">Welcome to BetaSprayer!</h2>
      <Link href="/upload">
        <Button>Get started</Button>
      </Link>
    </>
  )
}
