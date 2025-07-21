/*step 2: real-time
Pinapadala nito ang event + data sa Socket.IO server (nasa localhost:3001) para i-broadcast sa ibang users.
nasa socket-server yung step 1 */
export const emitSocketEvent = async (
  type: string,
  payload: unknown // or a stricter type if desired
): Promise<void> => {
  try {
    await fetch("http://localhost:3001/emit-program", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });
  } catch (error) {
    console.error("Failed to emit socket event:", error);
  }
};
