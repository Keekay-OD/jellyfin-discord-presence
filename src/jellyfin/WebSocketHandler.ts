import WebSocket from "ws";
import { config } from "../index.js";
import { JellyfinService } from "./JellyfinService.js";
import { DiscordService } from "../discord/DiscordService.js";

export const JellyfinWebSocket = {
    ws: null,

    start() {
        const url =
            `${config.jellyfin.url}/socket?api_key=${config.jellyfin.api_key}`;

        console.log("[Jellyfin] Connecting WebSocket:", url);

        this.ws = new WebSocket(url);

        this.ws.on("open", () => {
            console.log("[Jellyfin] WebSocket connected.");
        });

        this.ws.on("message", async (msg) => {
            const data = JSON.parse(msg.toString());

            if (!data) return;

            if (data.MessageType === "UserDataChanged" ||
                data.MessageType === "PlaybackProgress" ||
                data.MessageType === "PlaybackStarted" ||
                data.MessageType === "PlaybackStopped") 
            {
                await DiscordService.updateFromJellyfin();
            }
        });

        this.ws.on("close", () => {
            console.log("[Jellyfin] WebSocket closed, reconnecting in 5s...");
            setTimeout(() => this.start(), 5000);
        });
    }
};
