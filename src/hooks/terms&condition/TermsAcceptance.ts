'use client'

import { useState, useEffect } from 'react'

export const useTermsAcceptance = () => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('termsAccepted') === 'true'
      setTermsAccepted(accepted)
      setIsLoading(false)
    }
  }, [])

  const acceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true')
    setTermsAccepted(true)
  }

  const resetTerms = () => {
    localStorage.removeItem('termsAccepted')
    setTermsAccepted(false)
  }

  return {
    termsAccepted,
    isLoading,
    acceptTerms,
    resetTerms
  }
}