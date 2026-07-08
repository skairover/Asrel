import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem("token");

    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: {
        token,
      },
    });
  }

  return socket;
}