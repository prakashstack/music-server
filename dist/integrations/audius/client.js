"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrackById = exports.searchTracks = exports.normalizeTrack = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const audiusClient = axios_1.default.create({
    baseURL: env_1.env.AUDIUS_API_URL || 'https://api.audius.co/v1',
    timeout: 10000,
});
const artworkUrl = (artwork, size) => {
    if (!artwork)
        return '';
    if (typeof artwork === 'string')
        return artwork;
    return artwork[size] || artwork['1000x1000'] || artwork['480x480'] || artwork['150x150'] || artwork['100x100'] || '';
};
const getStreamUrl = (id) => {
    const url = `/tracks/${encodeURIComponent(id)}/stream`;
    return `${env_1.env.AUDIUS_API_URL || 'https://api.audius.co/v1'}${url}?app_name=${encodeURIComponent(env_1.env.AUDIUS_APP_NAME)}`;
};
const normalizeTrack = (raw) => {
    if (!raw)
        return null;
    const id = String(raw.track_id || raw.id || '');
    if (!id)
        return null;
    const image = artworkUrl(raw.artwork, '150x150');
    const releaseDate = raw.release_date || raw.created_at || '';
    return {
        id,
        name: raw.title || 'Unknown Song',
        duration: Number(raw.duration) || 210,
        year: releaseDate ? String(releaseDate).slice(0, 4) : '2024',
        language: raw.genre || 'Music',
        label: raw.publisher || '',
        album: { id: raw.album_id || '', name: raw.album_name || raw.title || 'Single' },
        artists: {
            primary: [{ id: String(raw.user?.user_id || raw.user?.id || ''), name: raw.user?.name || 'Unknown Artist' }],
        },
        image: [
            { quality: '500x500', url: artworkUrl(raw.artwork, '1000x1000') || image },
            { quality: '150x150', url: image },
            { quality: '50x50', url: artworkUrl(raw.artwork, '100x100') || image },
        ].filter((item) => item.url),
        downloadUrl: [{ quality: 'stream', url: getStreamUrl(id) }],
        url: raw.permalink || '',
    };
};
exports.normalizeTrack = normalizeTrack;
const searchTracks = async (query, page = 1, limit = 20) => {
    try {
        const { data } = await audiusClient.get('/tracks/search', {
            params: {
                query,
                limit,
                offset: Math.max(0, (page - 1) * limit),
                app_name: env_1.env.AUDIUS_APP_NAME,
            },
        });
        const tracks = Array.isArray(data?.data) ? data.data : [];
        return { data: { results: tracks.map(exports.normalizeTrack).filter(Boolean) } };
    }
    catch {
        return { data: { results: [] } };
    }
};
exports.searchTracks = searchTracks;
const getTrackById = async (id) => {
    try {
        const { data } = await audiusClient.get(`/tracks/${encodeURIComponent(id)}`, {
            params: { app_name: env_1.env.AUDIUS_APP_NAME },
        });
        const track = data?.data;
        return { data: track ? [(0, exports.normalizeTrack)(track)] : [] };
    }
    catch {
        return { data: [] };
    }
};
exports.getTrackById = getTrackById;
//# sourceMappingURL=client.js.map