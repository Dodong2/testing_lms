'use client'
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import AuthGuard from "@/components/AuthGuard"
import CreateProgramForm from "@/components/admin/CreateProgramForm"
import AddProgramMembers from "@/components/admin/AddProgramMembers"
// import Loading from "@/components/Loading"
import { useProgram } from "@/hooks/program/useProgram"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function UserHomePage() {
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()
  const router = useRouter()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

  const { data: programData, isLoading } = usePrograms()

  if (status === "loading") return <div>Loading...</div>
  if(!session) return null // Prevent render flicker


  const { name, email, role } = session.user

  /* main page */
  return (
    <AuthGuard>
    <div>
      <h1>Welcome, {name}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p>

    {session.user.image && (
      <Image src={session.user.image} alt="Profile" width={100} height={100} />
      )}

      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>

      {session.user.role === 'ADMIN' && (
        <>
          <CreateProgramForm/>
        </>
      )}
        
      <h2>Your Programs</h2>
       {/* Dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        programData?.programs?.map(program => (
        <div key={program.id}>
          <Link href={`/program/${program.id}`}>
            <h3 className="cursor text-blue">{program.title}</h3>
          </Link>
          
        {session.user.role === 'ADMIN' && (<>
          <AddProgramMembers programId={program.id}/>
        </>)}
          
        </div>
      ))
      )}
      </div>

      
    </div>
    </AuthGuard>
  )
}
