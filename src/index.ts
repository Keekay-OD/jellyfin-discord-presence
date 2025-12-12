import { loadConfig } from "./config/loadConfig.js";
import { JellyfinWebSocket } from "./jellyfin/WebSocketHandler.js";
import { DiscordService } from "./discord/DiscordService.js";

console.log("[System] Loading config...");
export const config = loadConfig();

console.log("[System] Connecting to Discord...");
await DiscordService.connect();

console.log("[System] Starting Jellyfin WebSocket listener...");
JellyfinWebSocket.start();
