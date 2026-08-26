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
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicService = void 0;
const audius = __importStar(require("../integrations/audius/client"));
const cacheService_1 = require("./cacheService");
const FALLBACK_SONGS = [
    {
        id: 'rjkrTnma',
        name: 'Kesariya (From "Brahmastra")',
        duration: 268,
        year: '2022',
        language: 'Hindi',
        album: { id: 'alb_2', name: 'Brahmastra' },
        artists: { primary: [{ id: 'art_2', name: 'Arijit Singh, Pritam' }] },
        image: [
            { quality: '500x500', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop' },
            { quality: '150x150', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop' },
        ],
        downloadUrl: [{ quality: '320kbps', url: 'https://jiotunepreview.jio.com/content/Converted/010910141580615.mp3' }],
    },
    {
        id: 'yDnFw7my',
        name: 'Chaleya (From "Jawan")',
        duration: 200,
        year: '2023',
        language: 'Hindi',
        album: { id: 'alb_1', name: 'Jawan' },
        artists: { primary: [{ id: 'art_1', name: 'Arijit Singh, Shilpa Rao' }] },
        image: [
            { quality: '500x500', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop' },
            { quality: '150x150', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop' },
        ],
        downloadUrl: [{ quality: '320kbps', url: 'https://jiotunepreview.jio.com/content/Converted/010910143754812.mp3' }],
    },
    {
        id: 'vxARvIBX',
        name: 'Heeriye (feat. Arijit Singh)',
        duration: 233,
        year: '2023',
        language: 'Hindi',
        album: { id: 'alb_3', name: 'Heeriye' },
        artists: { primary: [{ id: 'art_3', name: 'Jasleen Royal, Arijit Singh' }] },
        image: [
            { quality: '500x500', url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&h=500&fit=crop' },
            { quality: '150x150', url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=150&h=150&fit=crop' },
        ],
        downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }],
    },
    {
        id: 'koWi7GRH',
        name: 'Apna Bana Le (From "Bhediya")',
        duration: 261,
        year: '2022',
        language: 'Hindi',
        album: { id: 'alb_4', name: 'Bhediya' },
        artists: { primary: [{ id: 'art_4', name: 'Arijit Singh, Sachin-Jigar' }] },
        image: [
            { quality: '500x500', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=500&fit=crop' },
            { quality: '150x150', url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=150&h=150&fit=crop' },
        ],
        downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }],
    },
    {
        id: 'mPTrDSun',
        name: 'Raataan Lambiyan (From "Shershaah")',
        duration: 230,
        year: '2021',
        language: 'Hindi',
        album: { id: 'alb_5', name: 'Shershaah' },
        artists: { primary: [{ id: 'art_5', name: 'Jubin Nautiyal, Asees Kaur' }] },
        image: [
            { quality: '500x500', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=500&fit=crop' },
            { quality: '150x150', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=150&h=150&fit=crop' },
        ],
        downloadUrl: [{ quality: '320kbps', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }],
    },
];
const GENRES = [
    { id: 'bollywood', name: 'Bollywood', query: 'bollywood hits', color: '#FF6B9D' },
    { id: 'punjabi', name: 'Punjabi', query: 'punjabi hits 2024', color: '#6C63FF' },
    { id: 'romantic', name: 'Romantic', query: 'romantic hindi songs', color: '#FF4757' },
    { id: 'party', name: 'Party', query: 'party songs hindi', color: '#FFA502' },
    { id: 'devotional', name: 'Devotional', query: 'devotional songs hindi', color: '#2ED573' },
    { id: 'classical', name: 'Classical', query: 'indian classical music', color: '#1E90FF' },
    { id: 'indie', name: 'Indie', query: 'hindi indie songs', color: '#A29BFE' },
    { id: 'retro', name: 'Retro', query: 'bollywood retro classic songs', color: '#FD79A8' },
    { id: 'workout', name: 'Workout', query: 'gym workout songs hindi', color: '#00CEC9' },
    { id: 'sad', name: 'Sad Songs', query: 'sad hindi songs', color: '#636E72' },
    { id: 'tamil', name: 'Tamil', query: 'tamil hits 2024', color: '#E17055' },
    { id: 'telugu', name: 'Telugu', query: 'telugu hits 2024', color: '#FDCB6E' },
];
exports.musicService = {
    async getTrending() {
        const cacheKey = 'trending';
        const cached = cacheService_1.cacheService.get(cacheKey);
        if (cached && cached.length > 0)
            return cached;
        try {
            const result = await audius.searchTracks('bollywood hits', 1, 30);
            const songs = result.data?.results || [];
            const finalSongs = songs.length > 0 ? songs : FALLBACK_SONGS;
            cacheService_1.cacheService.set(cacheKey, finalSongs, 1800);
            return finalSongs;
        }
        catch (err) {
            console.error('Trending fetch error:', err);
            return FALLBACK_SONGS;
        }
    },
    async search(query, type = 'all', page = 1) {
        const cacheKey = `search:${query}:${type}:${page}`;
        const cached = cacheService_1.cacheService.get(cacheKey);
        if (cached)
            return cached;
        try {
            const result = await audius.searchTracks(query, page, 20);
            const songs = result.data?.results || [];
            const finalSongs = songs.length > 0 ? songs : FALLBACK_SONGS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
            const data = { songs: finalSongs.length > 0 ? finalSongs : FALLBACK_SONGS, albums: [], artists: [] };
            cacheService_1.cacheService.set(cacheKey, data, 300);
            return data;
        }
        catch (err) {
            console.error('Search error:', err);
            return { songs: FALLBACK_SONGS, albums: [], artists: [] };
        }
    },
    async getSong(id, refresh = false) {
        const cacheKey = `song:${id}`;
        const cached = cacheService_1.cacheService.get(cacheKey);
        if (cached && !refresh)
            return cached;
        try {
            const result = await audius.getTrackById(id);
            const song = result.data?.[0] || FALLBACK_SONGS.find(s => s.id === id) || FALLBACK_SONGS[0];
            cacheService_1.cacheService.set(cacheKey, song, 3600);
            return song;
        }
        catch {
            return FALLBACK_SONGS[0];
        }
    },
    async getAlbum(id) {
        return { name: 'Album', songs: FALLBACK_SONGS };
    },
    async getArtist(id) {
        return { name: 'Artist', topSongs: { results: FALLBACK_SONGS } };
    },
    async getGenreSongs(genre) {
        const cacheKey = `genre:${genre}`;
        const cached = cacheService_1.cacheService.get(cacheKey);
        if (cached)
            return cached;
        try {
            const genreData = GENRES.find((g) => g.id === genre);
            const query = genreData?.query || `${genre} songs`;
            const result = await audius.searchTracks(query, 1, 30);
            const songs = result.data?.results || [];
            const finalSongs = songs.length > 0 ? songs : FALLBACK_SONGS;
            cacheService_1.cacheService.set(cacheKey, finalSongs, 1800);
            return finalSongs;
        }
        catch {
            return FALLBACK_SONGS;
        }
    },
    getGenres() {
        return GENRES;
    },
    async getLyrics(id) {
        return null;
    },
    async getNewReleases() {
        const cacheKey = 'new_releases';
        const cached = cacheService_1.cacheService.get(cacheKey);
        if (cached && cached.length > 0)
            return cached;
        try {
            const result = await audius.searchTracks('latest hindi songs 2024', 1, 20);
            const songs = result.data?.results || [];
            const finalSongs = songs.length > 0 ? songs : FALLBACK_SONGS;
            cacheService_1.cacheService.set(cacheKey, finalSongs, 3600);
            return finalSongs;
        }
        catch {
            return FALLBACK_SONGS;
        }
    },
};
//# sourceMappingURL=musicService.js.map