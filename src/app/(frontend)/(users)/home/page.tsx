'use client'
// import Image from "next/image"
import { useSession } from "next-auth/react"
import AuthGuard from "@/components/AuthGuard"
// import Loading from "@/components/Loading"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
/* main page view depends on roles */
import Admin from "./admin/page"
import Programs from "./participants/page"
import Instructor from "./instructors/page"

export default function UserHomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

  if (status === "loading") return <div>Loading...</div>
  if (!session) return null // Prevent render flicker


  // const { name, email, role } = session.user

  /* main page */
  return (
    <AuthGuard>
      <div>

        {/* if yung beneficiary or instructors yung naka-sign-in ito yung main page */}
        {session.user.role === 'BENEFICIARY' && (
          <Programs />
        )}

        {session.user.role === 'INSTRUCTOR' && (
          <Instructor/>
        )}

        {/* if yung admin lang yung naka sign-in ito yung main page */}
        {session.user.role === 'ADMIN' && (
          <Admin />
        )}


      </div>
    </AuthGuard>
  )
}
