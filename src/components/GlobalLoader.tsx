'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function GlobalLoader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement | null

      if (
        link && 
        link.href.startsWith(window.location.origin) && 
        link.pathname !== window.location.pathname // ✅ skip if same page
      ) {
        setIsLoading(true)
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  // hide loader when route changes
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(70,70,70,0.3)' }}
        >
          <div className="flex flex-col items-center justify-center h-full py-10 animate-pulse">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full animate-spin border-y-8 border-dashed border-amber-500 border-t-transparent" />
            </div>
            <p className="text-amber-300 text-center mt-2">Loading</p>
          </div>
        </div>
      )}
    </>
  )
}
