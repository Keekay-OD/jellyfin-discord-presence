import axios from "axios";

export const JellyfinService = {
    async GetSessions() {
        try {
            const res = await axios.get(
                `${process.env.JELLYFIN_URL}/Sessions?activeWithinSeconds=960`,
                {
                    headers: {
                        "Authorization":
                            `MediaBrowser Client="Jellyfin Discord RPC", Device="Windows", DeviceId="DiscordRPC123", Version="1.0", Token="${process.env.JELLYFIN_API_KEY}"`
                    }
                }
            );

            return res.data;
        } catch (err: any) {
            console.log("[Jellyfin] Error fetching sessions:", err.message);
            return null;
        }
    },
    async GetImageAsBase64(url: string): Promise<string> {
    const img = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(img.data).toString("base64");
    },




    async GetMySession() {
        const all = await this.GetSessions();
        if (!all) return null;

        const userId = process.env.JELLYFIN_TARGET_USERID;
        if (!userId) {
            console.log("[Jellyfin] ERROR: JELLYFIN_TARGET_USERID missing in .env");
            return null;
        }

        // Find YOUR session
        const session = all.find((s: any) => s.UserId === userId);

        if (!session) {
            console.log("[Jellyfin] No active session found for user:", userId);
        }

        return session;
    }
};
