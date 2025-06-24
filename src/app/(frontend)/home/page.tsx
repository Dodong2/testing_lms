'use client'
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session, status } = useSession()

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

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <p>Email: {email}</p>
      <p>Role: {role}</p>

    {session.user.image && (
      <Image src={session.user.image} alt="Profile" width={100} height={100} />
      )}

      {session.user.role === 'BENEFICIARY' && (
        <button>for BENEFICIARY</button>
      )}

      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
    </div>
  )
}
