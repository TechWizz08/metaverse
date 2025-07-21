let socket;

function connectWebSocket() {
  return new Promise((resolve, reject) => {
    socket = new WebSocket("ws://localhost:5000");

    socket.addEventListener("open", () => {
      console.log("✅ WebSocket connected");
      resolve(socket);
    });

    socket.addEventListener("close",() => {
      console.log("Web socket disconnected")
      
    }
    )

    socket.addEventListener("error", (err) => {
      console.error("❌ WebSocket error", err);
      reject(err);
    });
  });
}

export default connectWebSocket;
