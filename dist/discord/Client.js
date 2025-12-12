// src/discord/Client.ts
import RPC from "discord-rpc";
export const DiscordRPC = new RPC.Client({ transport: "ipc" });
export async function connectRPC() {
    return new Promise((resolve, reject) => {
        DiscordRPC.on("ready", () => {
            console.log("[Discord] RPC Connected!");
            resolve();
        });
        DiscordRPC.login({ clientId: process.env.DISCORD_CLIENT_ID })
            .catch(err => {
            console.error("[Discord] RPC Login Error:", err);
            reject(err);
        });
    });
}
