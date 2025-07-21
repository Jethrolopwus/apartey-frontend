import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
    auth: { token: "YOUR_JWT_TOKEN" },
  autoConnect: false, 
  withCredentials: true, 
});
export default socket;