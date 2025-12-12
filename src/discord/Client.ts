import rpc from "discord-rich-presence";
import { config } from "../index.js";

let client: any = null;

export default {
    connect() {
        client = rpc(config.discord.client_id);
        console.log("[Discord] RPC Ready");
    },

    setActivity(payload: any) {
        if (!client) return;
        client.updatePresence(payload);
    }
};
