"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferencesService = void 0;
const UserPreferences_1 = require("../models/UserPreferences");
const RECENCY_WEIGHTS = {
    sevenDays: 1.5,
    thirtyDays: 1.2,
    older: 1.0,
};
const getRecencyWeight = (date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (diff <= sevenDaysMs)
        return RECENCY_WEIGHTS.sevenDays;
    if (diff <= thirtyDaysMs)
        return RECENCY_WEIGHTS.thirtyDays;
    return RECENCY_WEIGHTS.older;
};
exports.preferencesService = {
    async updateFromPlay(userId, songData, completionPercentage) {
        if (completionPercentage < 30)
            return; // ignore skips
        const weight = completionPercentage >= 80 ? 2 : 1;
        const language = songData.language?.toLowerCase();
        const genre = songData.genre?.toLowerCase();
        const primaryArtist = songData.artists?.primary?.[0];
        const update = {};
        if (language) {
            update.$inc = update.$inc || {};
            update.$inc[`preferredLanguages.$[lang].score`] = weight;
        }
        // Upsert preferences doc
        let prefs = await UserPreferences_1.UserPreferencesModel.findOne({ userId });
        if (!prefs) {
            prefs = await UserPreferences_1.UserPreferencesModel.create({ userId });
        }
        // Update language score
        if (language) {
            const langIdx = prefs.preferredLanguages.findIndex((l) => l.language === language);
            if (langIdx >= 0) {
                prefs.preferredLanguages[langIdx].score += weight;
            }
            else {
                prefs.preferredLanguages.push({ language, score: weight });
            }
        }
        // Update genre score
        if (genre) {
            const genreIdx = prefs.preferredGenres.findIndex((g) => g.genre === genre);
            if (genreIdx >= 0) {
                prefs.preferredGenres[genreIdx].score += weight;
            }
            else {
                prefs.preferredGenres.push({ genre, score: weight });
            }
        }
        // Update artist score
        if (primaryArtist) {
            const artistIdx = prefs.preferredArtists.findIndex((a) => a.artistId === primaryArtist.id);
            if (artistIdx >= 0) {
                prefs.preferredArtists[artistIdx].score += weight;
            }
            else {
                prefs.preferredArtists.push({
                    artistId: primaryArtist.id,
                    name: primaryArtist.name,
                    score: weight,
                });
            }
        }
        // Update recently played
        const recentSong = {
            songId: songData.id,
            title: songData.name,
            artist: primaryArtist?.name || '',
            artwork: songData.image?.[2]?.url || songData.image?.[1]?.url || '',
            playedAt: new Date(),
        };
        prefs.recentlyPlayed = [
            recentSong,
            ...prefs.recentlyPlayed.filter((s) => s.songId !== songData.id),
        ].slice(0, 50);
        await prefs.save();
    },
    async updateFromSearch(userId, query, intent) {
        let prefs = await UserPreferences_1.UserPreferencesModel.findOne({ userId });
        if (!prefs)
            prefs = await UserPreferences_1.UserPreferencesModel.create({ userId });
        // Update search history
        prefs.searchHistory = [query, ...prefs.searchHistory.filter((q) => q !== query)].slice(0, 50);
        // Update genre from AI intent
        if (intent.genre) {
            const genre = intent.genre.toLowerCase();
            const idx = prefs.preferredGenres.findIndex((g) => g.genre === genre);
            if (idx >= 0)
                prefs.preferredGenres[idx].score += 0.5;
            else
                prefs.preferredGenres.push({ genre, score: 0.5 });
        }
        // Update language from AI intent
        if (intent.language) {
            const lang = intent.language.toLowerCase();
            const idx = prefs.preferredLanguages.findIndex((l) => l.language === lang);
            if (idx >= 0)
                prefs.preferredLanguages[idx].score += 0.5;
            else
                prefs.preferredLanguages.push({ language: lang, score: 0.5 });
        }
        await prefs.save();
    },
    async getUserPreferences(userId) {
        return UserPreferences_1.UserPreferencesModel.findOne({ userId });
    },
    async getTopGenres(userId, limit = 5) {
        const prefs = await UserPreferences_1.UserPreferencesModel.findOne({ userId });
        if (!prefs)
            return [];
        return prefs.preferredGenres
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((g) => g.genre);
    },
    async getTopArtists(userId, limit = 5) {
        const prefs = await UserPreferences_1.UserPreferencesModel.findOne({ userId });
        if (!prefs)
            return [];
        return prefs.preferredArtists
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((a) => ({ artistId: a.artistId, name: a.name }));
    },
    async getTopLanguages(userId, limit = 3) {
        const prefs = await UserPreferences_1.UserPreferencesModel.findOne({ userId });
        if (!prefs)
            return [];
        return prefs.preferredLanguages
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((l) => l.language);
    },
};
//# sourceMappingURL=preferencesService.js.map