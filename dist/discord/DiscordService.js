// src/discord/DiscordService.ts
import { JellyfinService } from "../jellyfin/JellyfinService.js";
import { DiscordRPC } from "./Client.js";
import { uploadToImgur } from "../imgur/uploadToImgur.js";
import Tags from "../utils/Tags.js";
export const DiscordService = {
    UpdateRPC: async () => {
        const session = await JellyfinService.GetMySession();
        if (!session)
            return;
        const np = session.NowPlayingItem;
        const isPaused = session.PlayState.IsPaused;
        let details = "On Homepage";
        let state = "Browsing…";
        let largeImageKey;
        let smallImageKey;
        let startTimestamp = Date.now();
        if (np) {
            const start = Date.now() - Math.floor(session.PlayState.PositionTicks / 10000);
            const shortSeason = "S" + (np.SeasonName?.split(" ")[1] || "0");
            details = np.SeriesName ?? "Watching";
            state = `${shortSeason}:E${np.IndexNumber} - ${np.Name}`;
            const poster = `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Primary?tag=${np.ImageTags?.Primary}`;
            const thumb = np.ImageTags?.Thumb
                ? `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Thumb?tag=${np.ImageTags.Thumb}`
                : null;
            largeImageKey = await uploadToImgur(poster, "large");
            smallImageKey = thumb ? await uploadToImgur(thumb, "small") : undefined;
            startTimestamp = isPaused ? undefined : start;
        }
        DiscordRPC.setActivity({
            details,
            state,
            startTimestamp,
            largeImageKey,
            smallImageKey,
            largeImageText: "VibesFlix",
            smallImageText: isPaused ? "Paused" : "Playing"
        });
        console.log(`[${Tags.Discord}] Updated Rich Presence`);
    }
};
