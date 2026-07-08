import { io } from "socket.io-client";

let socket;

export default function getSocket(token) {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_API_URL,
      {
        auth: {
          token,
        },
      }
    );
  }

  return socket;
}