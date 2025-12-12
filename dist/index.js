import dotenv from "dotenv";
dotenv.config(); // MUST load first
console.log("[ENV DEBUG]", {
    JELLYFIN_URL: process.env.JELLYFIN_URL,
    JELLYFIN_API_KEY: process.env.JELLYFIN_API_KEY
});
import { connectRPC } from "./discord/Client.js";
import { DiscordService } from "./discord/DiscordService.js";
// ⛔ DO NOT import WebSocketHandler here yet
// It MUST be imported LAST after env is loaded
console.log("[Discord] Starting Jellyfin Discord RPC...");
await connectRPC();
// NOW safe to load WebSocketHandler
await import("./jellyfin/WebSocketHandler.js");
setInterval(() => {
    DiscordService.UpdateRPC().catch(console.error);
}, 5000);
