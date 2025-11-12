'use client'
export const dynamic = 'force-dynamic'
import Image from "next/image"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
/* hooks */
import { useTermsAcceptance } from "@/hooks/terms&condition/TermsAcceptance"
/* icons */
import { IoLogoGoogle } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
/* component */
import Loading from "@/components/Loading"
import TermsAndConditionsModal from "@/components/modals/TermsAndConditionsModal"

// Object Factory Function ang tawag dito
const createContents = () => ({
  message1: {
    title: "Account Login",
    icon: <IoPerson className="text-2xl" />,
    description: "Please select your account type"
  },
  loginButton: {
    title: "Continue with Google",
    icon: <IoLogoGoogle className="text-2xl" />,
    href: "/beneficiary"
  },
});

export default function LoginPage() {
  const contents = createContents();
  const { data: session, status } = useSession()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)
  const [toastShown, setToastShown] = useState(false)
  const { termsAccepted, isLoading: termsLoading, acceptTerms } = useTermsAcceptance()
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Auto-redirect if logged in and terms accepted
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !toastShown && termsAccepted) {
      setToastShown(true)

      toast.success(`Successfully entered as, ${session.user.name || 'User'}!`, {
        duration: 3000
      })

      setRedirecting(true)
      router.replace('/home')
    }
  }, [status, router, toastShown, session, termsAccepted])

  const handleLoginClick = () => {
    if (termsAccepted) {
      // Terms already accepted, proceed with login
      signIn("google", { prompt: "consent select_account" })
    } else {
      // Show terms modal for new users
      handleToggle()
    }
  }

  const handleTermsAccept = () => {
    acceptTerms() // Use the hook function
    handleToggle()
    // Now proceed with login after terms acceptance
    signIn("google", { prompt: "consent select_account" })
  }

  const handleToggle = () => {
    setShowTermsModal((prev) => !prev)
  }

  // Show loading while checking terms or session
  if (status === "loading" || redirecting || termsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        <Loading size={45} />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm transition-transform duration-300 hover:scale-[1.02] transform-gpu">

          {/* EduLink Logo */}
          <div className="flex justify-center items-center gap-2 mb-5">
            <Image src="/logo.png" alt='logo' width={50} height={50} />
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">EduLink</span>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Let's Get Started
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-5 text-sm">
            Please select your account type.
          </p>

          {/* Terms Info for New Users */}
          {!termsAccepted && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-600 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300 text-center">
              New users must accept our Terms & Conditions before proceeding.
            </p>
          </div>
          )}

          {/* Student Login Button */}
          <button
            onClick={handleLoginClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-full flex justify-center items-center gap-2 mb-1 transition-colors duration-300"
          >
            <IoLogoGoogle className="text-2xl" />
            <span className="text-base">Continue with Google</span>
          </button>

        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
        onClose={handleToggle}
      />
    </>
  )
}