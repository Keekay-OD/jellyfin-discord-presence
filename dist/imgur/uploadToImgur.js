import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";
const CACHE_DIR = path.join(process.cwd(), "poster_cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
}
export async function uploadToImgur(imageUrl, type) {
    try {
        const clientId = process.env.IMGUR_CLIENT_ID;
        const hash = crypto.createHash("md5")
            .update(imageUrl + type)
            .digest("hex");
        const cacheFile = path.join(CACHE_DIR, `${hash}.cache`);
        if (fs.existsSync(cacheFile)) {
            return fs.readFileSync(cacheFile, "utf8");
        }
        const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const base64 = Buffer.from(img.data).toString("base64");
        const response = await axios.post("https://api.imgur.com/3/image", { image: base64, type: "base64" }, { headers: { Authorization: `Client-ID ${clientId}` } });
        const link = response.data.data.link;
        fs.writeFileSync(cacheFile, link);
        return link;
    }
    catch (e) {
        console.error("[Imgur Upload Error]", e);
        return null;
    }
}
