// hooks/useSocketEvents.ts
import { useEffect } from "react"
import socket from "@/lib/socket"
import { useQueryClient } from "@tanstack/react-query"

type Program = {
  id: string
  title: string
  subtitle: string
  explanation: string
}

export const useSocketEvents = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    console.log("🧲 useSocketEvents mounted")
    /* step: 4 real-time
    Kapag may broadcast na "program-created" galing sa server, mag-iinvalidate ang cache (["programs"]) para magre-fetch via React Query. 💥*/
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id)
    })

    socket.on("program-created", (newProgram: Program) => {
      console.log("🔥 REALTIME RECEIVED:", newProgram)

      queryClient.setQueryData<{ programs: Program[] }>(
        ["programs"],
        (oldData) => {
          if (!oldData) return { programs: [newProgram] }
          return {
            programs: [newProgram, ...oldData.programs],
          }
        }
      )
    })

    return () => {
      socket.off("program-created")
    }
  }, [queryClient])
}


// // hooks/useSocketEvents.ts
// 'use client'

// import { useEffect } from "react"
// import socket from "@/lib/socket"
// import { useQueryClient } from "@tanstack/react-query"

// export const useSocketEvents = () => {
//   const queryClient = useQueryClient()

//   useEffect(() => {
//     //Kapag may broadcast na "program-created" galing sa server, mag-iinvalidate ang cache (["programs"]) para magre-fetch via React Query. 💥
//     const handleProgramCreated = () => {
//       console.log("🧲 Program created event received")
//       queryClient.invalidateQueries({ queryKey: ["programs"] })
//     }

//     const handleProgramDeleted = () => {
//       console.log("🧲 Program deleted event received")
//       queryClient.invalidateQueries({ queryKey: ["programs"] })
//     }

//     socket.on("program-created", handleProgramCreated)
//     socket.on("program-deleted", handleProgramDeleted)

//     return () => {
//       socket.off("program-created", handleProgramCreated)
//       socket.off("program-deleted", handleProgramDeleted)
//     }
//   }, [queryClient])
// }
