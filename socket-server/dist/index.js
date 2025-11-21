"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//step 1 for realtime. ang step 2 ay nasa lib
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
//handlers
const programHandlers_1 = require("./handlers/programHandlers");
const userHandlers_1 = require("./handlers/userHandlers");
const postHandlers_1 = require("./handlers/postHandlers");
const feedbackHandlers_1 = require("./handlers/feedbackHandlers");
const notificationHandlers_1 = require("./handlers/notificationHandlers");
const submissionHandlers_1 = require("./handlers/submissionHandlers");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000", // Frontend address
        methods: ["GET", "POST"],
        credentials: true
    },
});
// Listen for connections
io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});
/*step 3: Ito ang tagatanggap ng request mula sa Next.js backend (emitSocketEvent()), at nagba-broadcast ng event sa lahat ng connected clients.
 nasa backend yung step 3 create program*/
// Centralized emit events for program changes
app.post("/emit", express_1.default.json(), (req, res) => {
    const { category, type, payload } = req.body;
    switch (category) {
        case 'program':
            (0, programHandlers_1.handleProgramEvents)(io, type, payload);
            break;
        case 'user':
            (0, userHandlers_1.handleUserEvent)(io, type, payload);
            break;
        case 'post':
            (0, postHandlers_1.handlePostEvents)(io, type, payload);
            break;
        case 'feedback':
            (0, feedbackHandlers_1.handlefeedbackEvents)(io, type, payload);
            break;
        case 'notification':
            (0, notificationHandlers_1.handleNotifEvents)(io, type, payload);
            break;
        case 'submission':
            (0, submissionHandlers_1.handleSubmissionEvents)(io, type, payload);
            break;
        default:
            console.log("❓ Unknown category:", category);
    }
    res.status(200).send("Event emitted");
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
