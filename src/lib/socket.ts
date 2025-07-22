/* step: 5 real-time
Ito ang Socket.IO client ng frontend. Dito nakakonekta ang Next.js browser client sa Socket.IO server. */
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    transports: ['websocket'],
  withCredentials: true,
})

export default socket