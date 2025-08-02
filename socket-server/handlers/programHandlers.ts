import { Server } from "socket.io";

export const handleProgramEvents = (io: Server, type: string, payload: unknown) => {
    switch(type) {
    case "program-created":
      io.emit("program-created", payload);
      break;
    case "program-deleted":
      io.emit("program-deleted", payload);
      break;
    case "program-updated":
      io.emit("program-updated", payload);
      break;
    case "member-added":
      io.emit("member-added", payload);
      break;
    case "remove-member":
      io.emit("remove-member", payload)
      break;
    default:
      console.log("Unknown event type");
    }
}