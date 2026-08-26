"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicController = void 0;
const axios_1 = __importDefault(require("axios"));
const musicService_1 = require("../services/musicService");
const audius = __importStar(require("../integrations/audius/client"));
const response_1 = require("../utils/response");
const getExactPreviewUrl = async (song) => {
    const artist = song?.artists?.primary?.[0]?.name || '';
    const query = `${song?.name || ''} ${artist}`.trim();
    if (!query)
        return null;
    try {
        const { data } = await axios_1.default.get('https://api.deezer.com/search', {
            params: { q: query, limit: 10 },
            timeout: 5000,
        });
        const match = data?.data?.find((item) => item?.preview &&
            item?.title?.toLowerCase() === song.name.toLowerCase() &&
            item?.artist?.name?.toLowerCase().includes(artist.split(',')[0].trim().toLowerCase()));
        return match?.preview || null;
    }
    catch {
        return null;
    }
};
const normaliseText = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const getAlternateSongUrls = async (song) => {
    const artist = song?.artists?.primary?.[0]?.name?.split(',')[0]?.trim() || '';
    try {
        const result = await audius.searchTracks(`${song.name} ${artist}`, 1, 20);
        const match = result.data?.results?.find((candidate) => normaliseText(candidate.name) === normaliseText(song.name) &&
            normaliseText(candidate.artists?.primary?.[0]?.name).includes(normaliseText(artist)) &&
            candidate.id !== song.id);
        return match?.downloadUrl?.map((item) => item.url).filter(Boolean) || [];
    }
    catch {
        return [];
    }
};
exports.musicController = {
    getTrending: async (req, res) => {
        try {
            const songs = await musicService_1.musicService.getTrending();
            return (0, response_1.sendSuccess)(res, songs);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    search: async (req, res) => {
        try {
            const query = (req.query.q || req.query.query);
            const type = req.query.type || 'all';
            const page = parseInt(req.query.page) || 1;
            if (!query?.trim())
                return (0, response_1.sendError)(res, 'Query is required', 400);
            const results = await musicService_1.musicService.search(query.trim(), type, page);
            return (0, response_1.sendSuccess)(res, results);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    getSong: async (req, res) => {
        try {
            const id = req.params.id;
            const song = await musicService_1.musicService.getSong(id);
            return (0, response_1.sendSuccess)(res, song);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    streamSong: async (req, res) => {
        try {
            const song = await musicService_1.musicService.getSong(req.params.id, true);
            const streamUrls = song?.downloadUrl?.map((item) => item.url).filter(Boolean) || [];
            let lastError;
            for (const streamUrl of streamUrls) {
                try {
                    const upstream = await axios_1.default.get(streamUrl, {
                        responseType: 'stream',
                        headers: {
                            ...(req.headers.range ? { Range: req.headers.range } : {}),
                            'User-Agent': 'Mozilla/5.0',
                        },
                        validateStatus: (status) => status >= 200 && status < 400,
                    });
                    res.status(upstream.status);
                    for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
                        const value = upstream.headers[header];
                        if (value)
                            res.setHeader(header, value);
                    }
                    upstream.data.on('error', () => res.destroy());
                    upstream.data.pipe(res);
                    return;
                }
                catch (err) {
                    lastError = err;
                }
            }
            const alternateUrls = await getAlternateSongUrls(song);
            for (const streamUrl of alternateUrls) {
                try {
                    const upstream = await axios_1.default.get(streamUrl, {
                        responseType: 'stream',
                        headers: {
                            ...(req.headers.range ? { Range: req.headers.range } : {}),
                            'User-Agent': 'Mozilla/5.0',
                        },
                        validateStatus: (status) => status >= 200 && status < 400,
                    });
                    res.status(upstream.status);
                    for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
                        const value = upstream.headers[header];
                        if (value)
                            res.setHeader(header, value);
                    }
                    upstream.data.on('error', () => res.destroy());
                    upstream.data.pipe(res);
                    return;
                }
                catch (err) {
                    lastError = err;
                }
            }
            const exactPreviewUrl = await getExactPreviewUrl(song);
            if (exactPreviewUrl)
                return res.redirect(302, exactPreviewUrl);
            if (lastError || streamUrls.length === 0) {
                return res.status(404).json({ success: false, message: 'Audio stream not found for this song' });
            }
            return res.status(404).json({ success: false, message: 'Audio stream not found for this song' });
        }
        catch (err) {
            if (!res.headersSent)
                return res.status(502).json({ success: false, message: 'Audio stream unavailable' });
            res.destroy(err);
        }
    },
    getAlbum: async (req, res) => {
        try {
            const id = req.params.id;
            const album = await musicService_1.musicService.getAlbum(id);
            return (0, response_1.sendSuccess)(res, album);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    getArtist: async (req, res) => {
        try {
            const id = req.params.id;
            const artist = await musicService_1.musicService.getArtist(id);
            return (0, response_1.sendSuccess)(res, artist);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    getGenres: async (req, res) => {
        return (0, response_1.sendSuccess)(res, musicService_1.musicService.getGenres());
    },
    getGenreSongs: async (req, res) => {
        try {
            const genre = req.params.genre;
            const songs = await musicService_1.musicService.getGenreSongs(genre);
            return (0, response_1.sendSuccess)(res, songs);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    getLyrics: async (req, res) => {
        try {
            const id = req.params.id;
            const lyrics = await musicService_1.musicService.getLyrics(id);
            return (0, response_1.sendSuccess)(res, lyrics);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
    getNewReleases: async (req, res) => {
        try {
            const songs = await musicService_1.musicService.getNewReleases();
            return (0, response_1.sendSuccess)(res, songs);
        }
        catch (err) {
            return (0, response_1.sendError)(res, err.message);
        }
    },
};
//# sourceMappingURL=musicController.js.map