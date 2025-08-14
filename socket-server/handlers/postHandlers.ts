import { Server } from 'socket.io'

export const handlePostEvents = (io: Server, type: string, payload: unknown) => {
    switch(type) {
        case 'post-created':
            io.emit("post-created", payload)
            break
        case 'comment-created':
            io.emit("comment-created", payload)
            break
        default:
            console.log("Unknown post event type")
    }
}