"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendationService = void 0;
const musicService_1 = require("./musicService");
const preferencesService_1 = require("./preferencesService");
exports.recommendationService = {
    async getPersonalizedSections(userId) {
        const sections = [];
        try {
            // 1. Trending (always first)
            const trending = (await musicService_1.musicService.getTrending()) || [];
            sections.push({
                id: 'trending',
                title: 'Trending Now',
                subtitle: 'Hot tracks everyone is listening to',
                type: 'songs',
                items: Array.isArray(trending) ? trending.slice(0, 20) : [],
            });
            // 2. New Releases
            const newReleases = (await musicService_1.musicService.getNewReleases()) || [];
            sections.push({
                id: 'new_releases',
                title: 'New Releases',
                subtitle: 'Fresh music just dropped',
                type: 'songs',
                items: Array.isArray(newReleases) ? newReleases.slice(0, 20) : [],
            });
            // 3. Genres
            sections.push({
                id: 'genres',
                title: 'Browse Genres',
                subtitle: 'Find music by mood or genre',
                type: 'genres',
                items: musicService_1.musicService.getGenres(),
            });
            // 4. Personalized sections based on user preferences
            const topGenres = await preferencesService_1.preferencesService.getTopGenres(userId, 3);
            const topArtists = await preferencesService_1.preferencesService.getTopArtists(userId, 3);
            const topLanguages = await preferencesService_1.preferencesService.getTopLanguages(userId, 2);
            // For each top genre, add a section
            for (const genre of topGenres.slice(0, 2)) {
                try {
                    const songs = (await musicService_1.musicService.getGenreSongs(genre)) || [];
                    if (Array.isArray(songs) && songs.length > 0) {
                        sections.push({
                            id: `genre_${genre}`,
                            title: `Top ${genre.charAt(0).toUpperCase() + genre.slice(1)} Picks`,
                            subtitle: 'Based on your listening history',
                            type: 'songs',
                            items: songs.slice(0, 20),
                        });
                    }
                }
                catch { }
            }
            // For each top artist, add a section
            for (const artist of topArtists.slice(0, 2)) {
                try {
                    const result = await musicService_1.musicService.search(artist.name, 'songs');
                    const songs = result?.songs || [];
                    if (Array.isArray(songs) && songs.length > 0) {
                        sections.push({
                            id: `artist_${artist.artistId}`,
                            title: `More from ${artist.name}`,
                            subtitle: 'Because you love this artist',
                            type: 'songs',
                            items: songs.slice(0, 20),
                        });
                    }
                }
                catch { }
            }
            // Language-based section
            if (topLanguages.length > 0) {
                const lang = topLanguages[0];
                try {
                    const result = await musicService_1.musicService.search(`top ${lang} songs 2024`, 'songs');
                    const songs = result?.songs || [];
                    if (Array.isArray(songs) && songs.length > 0) {
                        sections.push({
                            id: `lang_${lang}`,
                            title: `Popular ${lang.charAt(0).toUpperCase() + lang.slice(1)} Songs`,
                            subtitle: 'Tailored to your language preferences',
                            type: 'songs',
                            items: songs.slice(0, 20),
                        });
                    }
                }
                catch { }
            }
            return sections;
        }
        catch (err) {
            console.error('Recommendation error:', err);
            return sections;
        }
    },
    async getGuestSections() {
        const [trendingRaw, newReleasesRaw] = await Promise.all([
            musicService_1.musicService.getTrending(),
            musicService_1.musicService.getNewReleases(),
        ]);
        const trending = Array.isArray(trendingRaw) ? trendingRaw : [];
        const newReleases = Array.isArray(newReleasesRaw) ? newReleasesRaw : [];
        return [
            { id: 'trending', title: 'Trending Now', subtitle: 'Hot tracks right now', type: 'songs', items: trending.slice(0, 20) },
            { id: 'new_releases', title: 'New Releases', subtitle: 'Fresh music just dropped', type: 'songs', items: newReleases.slice(0, 20) },
            { id: 'genres', title: 'Browse Genres', type: 'genres', items: musicService_1.musicService.getGenres() },
        ];
    },
};
//# sourceMappingURL=recommendationService.js.map