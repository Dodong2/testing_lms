'use client'
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface Props {
    children: React.ReactNode
}

export default function QueryProvider({ children }: Props) {
    const [queryClient] = useState(() => new QueryClient())
    return (
    <SessionProvider><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></SessionProvider>
    )
}