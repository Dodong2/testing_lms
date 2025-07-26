//step 1 for realtime. ang step 2 ay nasa lib
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
//handlers
import { handleProgramEvents } from './handlers/programHandlers'
import { handleUserEvent } from './handlers/userHandlers'

const app = express()
app.use(cors())
app.use(express.json()) 
const server = http.createServer(app)

const io = new Server(server, {
 cors: {
    origin: "http://localhost:3000", // Frontend address
    methods: ["GET", "POST"],
    credentials: true
  },      
})

// Listen for connections
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id)
  })
})

/*step 3: Ito ang tagatanggap ng request mula sa Next.js backend (emitSocketEvent()), at nagba-broadcast ng event sa lahat ng connected clients.
 nasa backend yung step 3 create program*/
// Centralized emit events for program changes
// app.post("/emit-program", express.json(), (req, res) => {
//   const { type, payload } = req.body;

//   switch (type) {
//     case "program-created":
//       io.emit("program-created", payload);
//       break;
//     case "program-deleted":
//       io.emit("program-deleted", payload);
//       break;
//     case "program-updated":
//       io.emit("program-updated", payload);
//       break;
//     case "member-added":
//       io.emit("member-added", payload);
//       break;
//     default:
//       console.log("Unknown event type");
//   }

//   res.status(200).send("Event emitted");
// });


app.post("/emit", express.json(), (req, res) => {
  const { category, type, payload } = req.body

  switch(category) {
    case 'program':
      handleProgramEvents(io, type, payload)
      break
    case 'user':
      handleUserEvent(io, type, payload)
      break
    default:
      console.log("❓ Unknown category:", category)
  }

  res.status(200).send("Event emitted");
})


server.listen(3001, () => {
    console.log("Socket.IO server running on http://localhost:3001")
})