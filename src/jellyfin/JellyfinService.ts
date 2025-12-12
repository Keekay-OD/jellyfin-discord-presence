import axios from "axios";

export const JellyfinService = {
    async GetMySession() {
        try {
            const server = process.env.JELLYFIN_URL;
            const userId = process.env.JELLYFIN_TARGET_USERID;
            const token = process.env.JELLYFIN_ACCESS_TOKEN;

            const res = await axios.get(`${server}/Sessions`, {
                headers: { "X-Emby-Token": token }
            });

            return res.data.find((s: any) => s.UserId === userId) || null;
        } catch (e) {
            console.error("[Jellyfin] Error fetching sessions:", e.message);
            return null;
        }
    }
};
