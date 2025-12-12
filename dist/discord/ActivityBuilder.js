export function buildActivity({ details, state, startTimestamp, paused, username, deviceName, largeImageUrl, smallImageUrl }) {
    return {
        details,
        state,
        startTimestamp,
        largeImageText: `VibesFlix on ${deviceName}`,
        smallImageText: paused ? "Paused" : `Playing | ${username}`,
        largeImageUrl,
        smallImageUrl
    };
}
