'use client'
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [redirecting, setRedirecting] = useState(false)


    // Auto-redirect if logged in
    useEffect(() => {
    if (status === 'authenticated') {
      setRedirecting(true)
      router.replace('/home')
    }
  }, [status, router])

    if (status === "loading" || redirecting) return <div>Loading...</div>

    return (
        <div>
            <div>
                <h1>Welcome to the LMs</h1>
                <button onClick={() => signIn("google", {prompt: "consent select_account",})}>Continue with Google</button>
            </div>
        </div>
    )
}