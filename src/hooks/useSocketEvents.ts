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

type Member = {
  id: string
  name: string
  email: string
  role: string
}

type MemberPayload = {
  programId: string
  newMember: Member
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

    // for program created
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

    // for program-updated
    socket.on("program-updated", (payload: {updatedProgram: Program}  ) => {
      const updated = payload.updatedProgram
      // console.log("✏️ Program updated:", updatedProgram)

      queryClient.setQueryData<{ programs: Program[] }>(["programs"], (oldData) => {
        if(!oldData) return { programs: [] }

        return {
          programs: oldData.programs.map((program) => 
            program.id === updated.id ? updated : program
          ),
        }
      })
    })

    // for program-deleted
    socket.on("program-deleted", (deletedProgram: Program) => {
      console.log("🗑️ Program deleted:", deletedProgram)

      queryClient.setQueryData<{ programs: Program[] }>(
        ["programs"],
        (oldData) => {
          if (!oldData) return { programs: [] }
          return {
            programs: oldData.programs.filter(p => p.id !== deletedProgram.id),
          }
        }
      )
    })

    // for member-added
    socket.on("member-added", (payload: MemberPayload) => {
      console.log("👤 Member added to program:", payload.programId)

      // Update member cache
      queryClient.setQueryData<Member[]>(
        ["program-members", payload.programId],
        (oldMembers) => {
          if (!oldMembers) return [payload.newMember]
          const alreadyExists = oldMembers.some(m => m.id === payload.newMember.id)
          if (alreadyExists) return oldMembers
          return [...oldMembers, payload.newMember]
        }
      )

      // Optionally: refresh program detail too
      queryClient.invalidateQueries({
        queryKey: ["program", payload.programId],
      })
    })

    return () => {
      socket.off("program-created")
      socket.off("program-updated")
      socket.off("program-deleted")
      socket.off("member-added")
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
