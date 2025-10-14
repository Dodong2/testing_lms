'use client'
export const dynamic = 'force-dynamic'

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
/* icons */
import { IoLogoGoogle } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
/* component */
import Loading from "@/components/Loading"

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

  if (status === "loading" || redirecting) return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
        <Loading size={45}/>
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-sm transition-transform duration-300 hover:scale-[1.02] transform-gpu">

        {/* EduLink Logo */}
        <div className="flex justify-center mb-6">
          {/* <EduLinkLogo className="h-12 w-12 text-blue-600 dark:text-blue-400" /> */}
          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">EduLink</span>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Welcome back!
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Please select your account type.
        </p>

        {/* Student Login Button */}
        <button
          onClick={() => signIn("google", { prompt: "consent select_account", })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full flex justify-center items-center gap-2 mb-4 transition-colors duration-300"
        >
          <IoLogoGoogle className="text-2xl" />
          <span className="text-base">Continue with Google</span>
        </button>

      </div>
    </div>


  )
}