/* step: 5 real-time
Ito ang Socket.IO client ng frontend. Dito nakakonekta ang Next.js browser client sa Socket.IO server. */

import { io } from "socket.io-client";

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001"

const socket = io(socketURL, {
  transports: ['websocket'],
  withCredentials: true,
})

export default socket