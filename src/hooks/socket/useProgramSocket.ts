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

interface MemberAddedPayload {
  programId: string
  newMembers: { id: string; email: string; name?: string }[]
}

interface ProgramType {
  id: string
  members: {
    user: {
      id: string
      email: string
    }
  }[]
}

export const useProgramEvents = () => {
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
      // console.log("🔥 REALTIME RECEIVED:", newProgram)
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
    socket.on("member-added", async(payload: MemberAddedPayload) => {
      const currentUserId = session?.user?.id

      console.log("📩 member-added received:", payload)
      console.log("🔍 currentUserId:", currentUserId)
      
      await queryClient.invalidateQueries({ queryKey: ["programs"], refetchType: "active" }) 

    })

    //for remove member
    socket.on("remove-member", async({ programId, removedUserId }) => {
      const currentUserId = session?.user?.id

      queryClient.setQueryData<ProgramType>(["program", programId], (oldData) => {
        if(!oldData) return oldData

        const updatedMembers = oldData.members.filter(
          (member) => member.user.id !== removedUserId
        )

        return {
          ...oldData, 
          members: updatedMembers
        }
      })

      if (currentUserId === removedUserId) {
        queryClient.setQueryData<{ programs: Program[] }>(["programs"], (oldData) => {
          if(!oldData) return { programs: [] }
          return {
            programs: oldData.programs.filter(p => p.id !== programId)
          }
        })
      }


    })

    return () => {
      socket.off("program-created")
      socket.off("program-updated")
      socket.off("program-deleted")
      socket.off("member-added")
      socket.off("remove-member")
    }
  }, [queryClient, session?.user?.id])
}
