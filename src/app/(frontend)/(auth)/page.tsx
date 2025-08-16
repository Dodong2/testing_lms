'use client'
export const dynamic = 'force-dynamic'

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
/* icons */
import { IoLogoGoogle } from "react-icons/io";
import { IoPerson } from "react-icons/io5";

// Object Factory Function ang tawag dito
const createContents = () => ({
  message1: {
    title: "Account Login",
    icon: <IoPerson className="text-2xl" />, // JSX element 
    description: "Please select your account type"
  },
  loginButton: {
    title: "Continue with Google",
    icon: <IoLogoGoogle className="text-2xl" />, // JSX element 
    href: "/beneficiary"
  },
});


export default function LoginPage() {
  const contents = createContents();
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-gray-200 p-3">
            {contents.message1.icon} {/* Use account icon */}
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {contents.message1.title}
        </h2>
        <p className="text-center text-gray-500 mb-4">
          {contents.message1.description}
        </p>
        <button onClick={() => signIn("google", { prompt: "consent select_account", })}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center gap-1.5"
        >{contents.loginButton.icon} {contents.loginButton.title} </button>
      </div>
    </div>
  )
}