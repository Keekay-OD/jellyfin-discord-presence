import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { config } from "../index.js";

const CACHE_DIR = path.join(process.cwd(), "poster_cache");
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

export async function uploadToImgur(url: string) {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const cacheFile = path.join(CACHE_DIR, `${hash}.cache`);

    if (fs.existsSync(cacheFile)) {
        return fs.readFileSync(cacheFile, "utf8");
    }

    try {
        const img = await axios.get(url, { responseType: "arraybuffer" });
        const base64 = Buffer.from(img.data).toString("base64");

        const res = await axios.post(
            "https://api.imgur.com/3/image",
            { image: base64, type: "base64" },
            { headers: { Authorization: `Client-ID ${config.imgur.client_id}` } }
        );

        const link = res.data.data.link;
        fs.writeFileSync(cacheFile, link);
        return link;

    } catch (e) {
        console.error("[Imgur] Upload failed:", e.message);
        return null;
    }
}
