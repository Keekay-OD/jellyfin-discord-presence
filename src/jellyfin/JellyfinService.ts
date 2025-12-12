import axios from "axios";
import { config } from "../index.js";

export const JellyfinService = {
    async getSessions() {
        const res = await axios.get(
            `${config.jellyfin.url}/Sessions?api_key=${config.jellyfin.api_key}`
        );
        return res.data;
    },

    async getNowPlaying() {
        const sessions = await this.getSessions();
        const active = sessions.find(s => s.NowPlayingItem && !s.PlayState?.IsPaused);
        return active || sessions[0] || null;
    }
};
