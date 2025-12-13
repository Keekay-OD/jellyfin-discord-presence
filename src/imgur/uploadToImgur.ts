import axios from "axios";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "poster_cache");

// ensure cache dir
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

export async function uploadToImgur(imageUrl: string, type: "large" | "small") {
    console.log(`\n[Imgur] Starting upload (${type})`);
    console.log(`[Imgur] Source URL: ${imageUrl}`);

    const hash = crypto.createHash("md5").update(imageUrl + type).digest("hex");
    const cacheFile = path.join(CACHE_DIR, `${hash}.cache`);

    if (fs.existsSync(cacheFile)) {
        const cached = fs.readFileSync(cacheFile, "utf8");
        console.log(`[Imgur] Cache hit → ${cached}`);
        if (cached !== "FAILED") return cached;
        console.log("[Imgur] Cached result was FAILED. Not retrying.");
        return null;
    }

    try {
        console.log("[Imgur] Downloading poster from Jellyfin…");

        const imgResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
        console.log(`[Imgur] Download status: ${imgResp.status}`);
        console.log(`[Imgur] Downloaded bytes: ${imgResp.data.length}`);

        const base64 = Buffer.from(imgResp.data).toString("base64");

        console.log("[Imgur] Uploading to Imgur…");

        const response = await axios.post(
            "https://api.imgur.com/3/image",
            { image: base64, type: "base64" },
            { headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
        );

        console.log("[Imgur] Imgur Response:");
        console.log(response.data);

        const link = response.data?.data?.link;

        if (!link) {
            console.log("[Imgur] ❌ NO LINK returned by Imgur!");
            console.log(response.data);
            fs.writeFileSync(cacheFile, "FAILED");
            return null;
        }

        console.log(`[Imgur] SUCCESS → ${link}`);

        fs.writeFileSync(cacheFile, link);
        return link;

    } catch (err: any) {
        console.log("\n[Imgur] ❌ UPLOAD FAILED");
        console.log(err.response?.data || err.message);

        fs.writeFileSync(cacheFile, "FAILED");
        return null;
    }
}
