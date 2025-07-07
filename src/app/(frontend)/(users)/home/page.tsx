'use client'
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import AuthGuard from "@/components/AuthGuard"
// import Loading from "@/components/Loading"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
/* main page view depends on roles */
import Admin from "./admin/page"
import Programs from "./participants/page"


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
  if(!session) return null // Prevent render flicker


  // const { name, email, role } = session.user

  /* main page */
  return (
    <AuthGuard>
    <div>
      {/* <h1>Welcome, {name}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p> */}

    {session.user.image && (
      <Image src={session.user.image} alt="Profile" width={100} height={100} />
      )}

      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>

      {/* if yung beneficiary or instructors yung naka-sign-in ito yung main page */}
      {(session.user.role === 'BENEFICIARY' || session.user.role === 'INSTRUCTOR') && (
        <Programs/>
      )}  

      {/* if yung admin lang yung naka sign-in ito yung main page */}
      {session.user.role === 'ADMIN' && (
        <Admin/>
      )}
      
      
    </div>
    </AuthGuard>
  )
}
