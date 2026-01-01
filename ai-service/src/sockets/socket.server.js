const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { agent, getLastAIText } = require("../agent/agent");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer);

  // ---------------- AUTH ----------------
  io.use((socket, next) => {
    const cookies = socket.handshake.headers?.cookie;
    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) return next(new Error("token not provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      socket.user = decoded;
      socket.token = token;
      next();
    } catch (err) {
      next(new Error("invalid token"));
    }
  });

  // ---------------- CONNECTION ----------------
  io.on("connection", (socket) => {
    console.log(
      `User connected: ${socket.user?.username || socket.user?.id}, socketId: ${socket.id}`
    );

    socket.on("message", async (data) => {
      try {
        // Invoke the agent with a safe recursion limit
        const result = await agent.invoke(
          {
            messages: [
              {
                role: "user",
                content: data,
              },
            ],
          },
          {
            metadata: { token: socket.token },
            recursionLimit: 3, // Avoid infinite tool recursion
          }
        );

        // Extract the last AI text message
        const aiText = getLastAIText(result.messages);

        // Send AI response back to client
        socket.emit("ai_response", { text: aiText || "No response from AI" });

      } catch (err) {
        console.error("AI error:", err);
        socket.emit("ai_response", { error: "AI failed to respond" });
      }
    });
  });
}

module.exports = { initSocketServer };
