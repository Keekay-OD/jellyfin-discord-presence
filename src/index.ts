import { DiscordService } from "./discord/DiscordService.js";
import Tags from "./utils/Tags.js";

console.log(`[${Tags.Discord}] Starting Jellyfin Discord RPC...`);

setInterval(() => DiscordService.UpdateRPC(), 8000);
