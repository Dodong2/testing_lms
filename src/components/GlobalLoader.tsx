'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function GlobalLoader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // show loader immediately when user clicks any internal link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href.startsWith(window.location.origin)) {
        setIsLoading(true)
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  // hide loader after route has changed and rendered
  useEffect(() => {
    // Add a tiny delay so it looks smooth and ensures new page is mounted
    const timeout = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <>
      {isLoading && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
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
