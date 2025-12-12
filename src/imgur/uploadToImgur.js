"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToImgur = uploadToImgur;
var axios_1 = require("axios");
var fs_1 = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
var index_js_1 = require("../index.js");
var CACHE_DIR = path_1.default.join(process.cwd(), "poster_cache");
if (!fs_1.default.existsSync(CACHE_DIR))
    fs_1.default.mkdirSync(CACHE_DIR);
function uploadToImgur(url) {
    return __awaiter(this, void 0, void 0, function () {
        var hash, cacheFile, img, base64, res, link, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hash = crypto_1.default.createHash("md5").update(url).digest("hex");
                    cacheFile = path_1.default.join(CACHE_DIR, "".concat(hash, ".cache"));
                    if (fs_1.default.existsSync(cacheFile)) {
                        return [2 /*return*/, fs_1.default.readFileSync(cacheFile, "utf8")];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get(url, { responseType: "arraybuffer" })];
                case 2:
                    img = _a.sent();
                    base64 = Buffer.from(img.data).toString("base64");
                    return [4 /*yield*/, axios_1.default.post("https://api.imgur.com/3/image", { image: base64, type: "base64" }, { headers: { Authorization: "Client-ID ".concat(index_js_1.config.imgur.client_id) } })];
                case 3:
                    res = _a.sent();
                    link = res.data.data.link;
                    fs_1.default.writeFileSync(cacheFile, link);
                    return [2 /*return*/, link];
                case 4:
                    e_1 = _a.sent();
                    console.error("[Imgur] Upload failed:", e_1.message);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
