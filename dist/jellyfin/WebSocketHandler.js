import WebSocket from "ws";
import { DiscordService } from "../discord/DiscordService.js";
console.log("[Jellyfin] WebSocketHandler loaded");
function getEnv() {
    const url = process.env.JELLYFIN_URL;
    const key = process.env.JELLYFIN_API_KEY;
    if (!url)
        console.log("[Jellyfin] ERROR: JELLYFIN_URL is missing in .env");
    if (!key)
        console.log("[Jellyfin] ERROR: JELLYFIN_API_KEY is missing in .env");
    return { url, key };
}
function buildWSUrl() {
    const { url, key } = getEnv();
    if (!url || !key)
        return null;
    return `${url}/socket?api_key=${key}`;
}
let ws = null;
function connectWS() {
    const wsUrl = buildWSUrl();
    if (!wsUrl) {
        console.log("[Jellyfin] Cannot connect WebSocket — missing env values.");
        return;
    }
    console.log("[Jellyfin] Connecting WebSocket →", wsUrl);
    ws = new WebSocket(wsUrl);
    ws.on("open", () => {
        console.log("[Jellyfin] WebSocket CONNECTED!");
    });
    ws.on("error", (err) => {
        console.log("[Jellyfin] WebSocket ERROR:", err.message);
    });
    ws.on("close", () => {
        console.log("[Jellyfin] WebSocket CLOSED. Reconnecting in 5s…");
        setTimeout(connectWS, 5000);
    });
    ws.on("message", async (data) => {
        console.log("[Jellyfin] WS MESSAGE:", data.toString());
        try {
            const json = JSON.parse(data.toString());
            if (json.MessageType === "Sessions") {
                console.log("[Jellyfin] Sessions Update → Calling DiscordService.UpdateRPC");
                await DiscordService.UpdateRPC();
            }
        }
        catch (err) {
            console.log("[Jellyfin] Failed to parse WS message:", err);
        }
    });
}
connectWS();
