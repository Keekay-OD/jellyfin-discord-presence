import DiscordRPC from "./Client.js";
import { buildActivity } from "./ActivityBuilder.js";
import { JellyfinService } from "../jellyfin/JellyfinService.js";
import { uploadToImgur } from "../imgur/uploadToImgur.js";

export const DiscordService = {
    async connect() {
        DiscordRPC.connect();
    },

    async updateFromJellyfin() {
        const session = await JellyfinService.getNowPlaying();
        if (!session) return;

        const np = session.NowPlayingItem;
        const isPaused = session.PlayState?.IsPaused;
        const username = session.UserName;
        const device = session.DeviceName;

        let poster = null;
        let thumb = null;

        if (np?.Id && np?.ImageTags?.Primary) {
            poster = `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Primary?tag=${np.ImageTags.Primary}`;
            poster = await uploadToImgur(poster);
        }

        if (np?.ImageTags?.Thumb) {
            thumb = `${process.env.JELLYFIN_URL}/Items/${np.Id}/Images/Thumb?tag=${np.ImageTags.Thumb}`;
            thumb = await uploadToImgur(thumb);
        }

        const activity = buildActivity({
            details: np?.SeriesName || np?.Name,
            state: np?.EpisodeTitle || "",
            startTimestamp: isPaused ? undefined :
                Date.now() - Math.floor(session.PlayState.PositionTicks / 10000),
            paused: isPaused,
            username,
            deviceName: device,
            largeImageUrl: poster,
            smallImageUrl: thumb
        });

        DiscordRPC.setActivity(activity);
    }
};
