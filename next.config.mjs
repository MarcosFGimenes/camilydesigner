import http from "http";
import { initSocket } from "./server/socketServer.js";
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

const server = http.createServer();
const io = initSocket(server);

server.listen(3001, () => {
  console.log("🚀 WebSocket rodando na porta 3001");
});