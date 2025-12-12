"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildActivity = buildActivity;
function buildActivity(_a) {
    var details = _a.details, state = _a.state, startTimestamp = _a.startTimestamp, paused = _a.paused, username = _a.username, deviceName = _a.deviceName, largeImageUrl = _a.largeImageUrl, smallImageUrl = _a.smallImageUrl;
    return {
        details: details,
        state: state,
        startTimestamp: startTimestamp,
        largeImageText: "Jellyfin on ".concat(deviceName),
        smallImageText: paused ? "Paused" : "Playing | ".concat(username),
        largeImageUrl: largeImageUrl,
        smallImageUrl: smallImageUrl
    };
}
