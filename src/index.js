"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client_js_1 = require("./discord/Client.js");
var DiscordService_js_1 = require("./discord/DiscordService.js");
console.log("[Discord] Starting Jellyfin Discord RPC...");
await (0, Client_js_1.connectRPC)();
setInterval(function () {
    DiscordService_js_1.DiscordService.UpdateRPC().catch(console.error);
}, 5000);
