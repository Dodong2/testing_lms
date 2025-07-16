// app/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Error() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  const message = code === 'unauthorized'
    ? 'You do not have permission to access this page.'
    : 'An unknown error occurred.'

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-red-500 text-2xl font-bold">{message}</h1>
    </div>
  )
}
