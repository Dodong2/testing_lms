'use client'
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import CreateProgramForm from "@/components/admin/CreateProgramForm"
import AddProgramMembers from "@/components/admin/AddProgramMembers"
import { useProgram } from "@/hooks/program/useProgram"
import Link from "next/link"


export default function HomePage() {
  const { data: session, status } = useSession()
  const { usePrograms } = useProgram()
  

  const { data: programData, isLoading } = usePrograms()

  if (status === "loading") return <div>Loading...</div>

  if (!session) {
    return (
      <div>
        <h1>Welcome to the LMs</h1>
        <button onClick={() => signIn("google", {prompt: "consent select_account"})}>Continue with Google</button>
      </div>
    )
  }

  const { name, email, role } = session.user

  /* main page */
  return (
    <div>
      <h1>Welcome, {name}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p>

    {session.user.image && (
      <Image src={session.user.image} alt="Profile" width={100} height={100} />
      )}

      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>

      {/* for beneficiary */}
      {session.user.role === 'BENEFICIARY' && (
        <button>for BENEFICIARY</button>
      )}

      {session.user.role === 'ADMIN' && (
        <>
          <CreateProgramForm/>
        </>
      )}

      <h2>Your Programs</h2>
      {programData?.programs?.map(program => (
        <div key={program.id}>
          <Link href={`/program/${program.id}`}>
            <h3 className="cursor text-blue">{program.title}</h3>
          </Link>
          
        {session.user.role === 'ADMIN' && (<>
          <AddProgramMembers programId={program.id}/>
        </>)}
          
        </div>
      ))}

      {/* for Instructors */}
      {session.user.role === 'INSTRUCTOR' && (
        <button>for INSTRUCTOR</button>
      )}

      
    </div>
  )
}
