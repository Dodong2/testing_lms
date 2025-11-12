'use client'

import { useState } from 'react'
import { IoClose } from "react-icons/io5"
import Image from 'next/image'


interface TermsModalProps {
  isOpen: boolean
  onAccept: () => void
  onClose: () => void
}

export default function TermsAndConditionsModal({ isOpen, onAccept, onClose }: TermsModalProps) {
  const [isChecked, setIsChecked] = useState(false)

  const handleAccept = () => {
    if (isChecked) {
      // Store acceptance in localStorage
      localStorage.setItem('termsAccepted', 'true')
      onAccept()
    }
  }

  const handleClose = () => {
    setIsChecked(false) // Reset checkbox when closing
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(70, 70, 70, 0.3)' }}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Image src="/logo.png" alt='logo' width={50} height={50}/>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Terms & Conditions
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-white">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-4">Account Registration Terms</h3>
            
            <p className="mb-4">
              Welcome to EduLink. By creating an account, you agree to the following terms and conditions:
            </p>

            <div className="space-y-4">
              <section>
                <h4 className="font-semibold mb-2">1. Account Authentication</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Only Gmail accounts are permitted for login</li>
                  <li>You must use Google OAuth for authentication</li>
                  <li>You are responsible for maintaining the security of your Google account</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold mb-2">2. User Responsibilities</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must provide accurate information during registration</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold mb-2">3. Privacy & Data</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We collect only necessary information for service provision</li>
                  <li>Your data is protected in accordance with our privacy policy</li>
                  <li>Google authentication data is handled securely</li>
                </ul>
              </section>

              <section>
                <h4 className="font-semibold mb-2">4. Acceptance Requirement</h4>
                <p>
                  You must read and accept these terms and conditions to proceed with account registration 
                  and access the EduLink system.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label 
              htmlFor="terms-checkbox" 
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              I have read, understood, and agree to the Terms & Conditions
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!isChecked}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  )
}