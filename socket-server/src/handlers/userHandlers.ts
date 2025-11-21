import { Server } from "socket.io"

export const handleUserEvent = (io: Server, type: string, payload: unknown) => {
  switch (type) {
    case "user-created":
      io.emit("user-created", payload)
      break
    case "user-deleted":
      io.emit("user-deleted", payload)
      break
    case "user-updated":
      io.emit("user-updated", payload)
      break
    default:
      console.log("❗ Unknown user event type:", type)
  }
}
