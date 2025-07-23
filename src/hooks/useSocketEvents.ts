// hooks/useSocketEvents.ts
import { useEffect } from "react"
import socket from "@/lib/socket"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

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

export const useSocketEvents = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  useEffect(() => {
    console.log("🧲 useSocketEvents mounted")
    /* step: 4 real-time
    Kapag may broadcast na "program-created" galing sa server, mag-iinvalidate ang cache (["programs"]) para magre-fetch via React Query. 💥*/
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id)
    })

    socket.on("program-created", (newProgram: Program & { adminId: string }) => {
      console.log("🔥 REALTIME RECEIVED:", newProgram)
      const currentUserId = session?.user?.id

      const isMember = newProgram.adminId === currentUserId

      if(!isMember) return

      queryClient.setQueryData<{ programs: Program[] }>(
        ["programs"],
        (oldData) => {
          if (!oldData) return { programs: [newProgram] }
          return {
            programs: [newProgram, ...oldData.programs]
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
    socket.on("member-added", (payload: { programId: string, newMembers: [] }) => {
      const { programId, newMembers } = payload
      const currentUserId = session?.user?.id

      const isNewMember = newMembers.some((member: Member) => member.id === currentUserId) 

      if(!isNewMember) return

      queryClient.invalidateQueries({ queryKey: ["programs"] })

      queryClient.invalidateQueries({ queryKey: ["program", programId] })
    })

    return () => {
      socket.off("program-created")
      socket.off("program-updated")
      socket.off("program-deleted")
      socket.off("member-added")
    }
  }, [queryClient])
}
