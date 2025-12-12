import { JellyfinService } from "../jellyfin/JellyfinService.js";
import DiscordRPC from "./Client.js";
import Tags from "../utils/Tags.js";
import { uploadToImgur } from "./AssetUploader.js";

export const DiscordService = {
    UpdateRPC: async () => {
        const session = await JellyfinService.GetMySession();
        if (!session) return;

        const np = session.NowPlayingItem;
        const paused = session.PlayState.IsPaused;

        let details = "On Homepage";
        let state = "Idle";
        let largeImageUrl = undefined;
        let smallImageUrl = undefined;

        if (np) {
            const series = np.SeriesName || np.Name;
            const ep = np.Name;
            const season = np.SeasonName?.split(" ")[1] || "0";
            const epNum = np.IndexNumber ?? 0;

            details = series;
            state = `S${season}:E${epNum} - ${ep}`;

            const poster = `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Primary?tag=${np.ImageTags?.Primary}`;
            console.log("[Jellyfin] Poster URL:", poster);

            largeImageUrl = await uploadToImgur(poster, "large");
        }

        DiscordRPC.updatePresence({
            details,
            state,
            largeImageUrl,
            smallImageUrl,
            largeImageText: "Jellyfin Activity",
            smallImageText: paused ? "Paused" : "Playing"
        });

        console.log(`[${Tags.Discord}] Updated Presence`);
    }
};
