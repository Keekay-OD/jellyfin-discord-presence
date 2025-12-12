import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = path.join(process.cwd(), "poster_cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

export async function uploadToImgur(imageUrl: string, type: "large" | "small") {
    try {
        const clientId = process.env.IMGUR_CLIENT_ID;
        if (!clientId) return null;

        const hash = crypto.createHash("md5").update(imageUrl + type).digest("hex");
        const cacheFile = path.join(CACHE_DIR, `${hash}.cache`);

        if (fs.existsSync(cacheFile)) {
            const cached = fs.readFileSync(cacheFile, "utf8");
            if (cached !== "FAILED") return cached;
            return null;
        }

        const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const base64 = Buffer.from(img.data).toString("base64");

        const res = await axios.post(
            "https://api.imgur.com/3/image",
            { image: base64, type: "base64" },
            { headers: { Authorization: `Client-ID ${clientId}` } }
        );

        if (res.data?.data?.link) {
            fs.writeFileSync(cacheFile, res.data.data.link);
            return res.data.data.link;
        }

        fs.writeFileSync(cacheFile, "FAILED");
        return null;
    } catch (err: any) {
        console.error("[Imgur] Upload failed:", err.response?.data || err.message);
        return null;
    }
}
