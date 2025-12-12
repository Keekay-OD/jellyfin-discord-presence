import rpc from "discord-rich-presence";

const DiscordRPC = rpc(process.env.DISCORD_CLIENT_ID || "");

export default DiscordRPC;
