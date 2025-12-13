import { JellyfinService } from "../jellyfin/JellyfinService.js";
import { DiscordRPC } from "./Client.js";
import Tags from "../utils/Tags.js";

export const DiscordService = {
    UpdateRPC: async () => {
        const session = await JellyfinService.GetMySession();
        if (!session) return;

        const np = session.NowPlayingItem;
        const ps = session.PlayState;

        // Base Activity
        let activity: any = {
            details: "Browsing VibesFlix",
            state: "Idle",
            assets: {
                large_text: "VibesFlix"
            }
        };

        if (np) {
            const posterUrl = `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Primary?tag=${np.ImageTags?.Primary}`;
            const thumbUrl = np.ImageTags?.Thumb
                ? `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Thumb?tag=${np.ImageTags.Thumb}`
                : null;

            // Titles
            const seasonNum = np.ParentIndexNumber ?? 0;
            const episodeNum = np.IndexNumber ?? 0;

            activity.details = np.SeriesName ?? np.Name ?? "Watching";
            activity.state = `S${seasonNum}E${episodeNum} – ${np.Name}`;

            //
            // 🔥 Convert Jellyfin images → BASE64 → Discord-compatible assets
            //
            try {
                const posterBase64 = await JellyfinService.GetImageAsBase64(posterUrl);
                activity.assets.large_image = `mp:base64,${posterBase64}`;
            } catch (err) {
                console.error("[Discord] Poster encode failed:", err);
            }

            if (thumbUrl) {
                try {
                    const thumbBase64 = await JellyfinService.GetImageAsBase64(thumbUrl);
                    activity.assets.small_image = `mp:base64,${thumbBase64}`;
                } catch (err) {
                    console.error("[Discord] Thumb encode failed:", err);
                }
            }

            //
            // Playback timestamps
            //
            if (!ps.IsPaused) {
                const now = Date.now();
                const start = now - Math.floor(ps.PositionTicks / 10000);
                const end = start + Math.floor(np.RunTimeTicks / 10000);

                activity.timestamps = { start, end };
            }
        }

        //
        // Send to Discord
        //
        DiscordRPC.setActivity(activity);
        console.log(`[${Tags.Discord}] Updated Rich Presence (IPC mode)`);
    }
};
