/*step 2: real-time
Pinapadala nito ang event + data sa Socket.IO server (nasa localhost:3001) para i-broadcast sa ibang users.
nasa socket-server yung step 1 */
export const emitSocketEvent = async (
  category: "program" | "user" | "post" | "feedback",
  type: string,
  payload: unknown // or a stricter type if desired
): Promise<void> => {
  try {
    await fetch("http://localhost:3001/emit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, type, payload }),
    });
  } catch (error) {
    console.error("Failed to emit socket event:", error);
  }
};
