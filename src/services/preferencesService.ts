import mongoose from 'mongoose';
import { UserPreferencesModel } from '../models/UserPreferences';
import { PlayHistoryModel } from '../models/PlayHistory';
import { SearchHistoryModel } from '../models/SearchHistory';
import { FavoriteModel } from '../models/Favorite';

const RECENCY_WEIGHTS = {
  sevenDays: 1.5,
  thirtyDays: 1.2,
  older: 1.0,
};

const getRecencyWeight = (date: Date): number => {
  const now = Date.now();
  const diff = now - date.getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  if (diff <= sevenDaysMs) return RECENCY_WEIGHTS.sevenDays;
  if (diff <= thirtyDaysMs) return RECENCY_WEIGHTS.thirtyDays;
  return RECENCY_WEIGHTS.older;
};

export const preferencesService = {
  async updateFromPlay(
    userId: string,
    songData: any,
    completionPercentage: number
  ) {
    if (completionPercentage < 30) return; // ignore skips

    const weight = completionPercentage >= 80 ? 2 : 1;
    const language = songData.language?.toLowerCase();
    const genre = songData.genre?.toLowerCase();
    const primaryArtist = songData.artists?.primary?.[0];

    const update: any = {};

    if (language) {
      update.$inc = update.$inc || {};
      update.$inc[`preferredLanguages.$[lang].score`] = weight;
    }

    // Upsert preferences doc
    let prefs = await UserPreferencesModel.findOne({ userId });
    if (!prefs) {
      prefs = await UserPreferencesModel.create({ userId });
    }

    // Update language score
    if (language) {
      const langIdx = prefs.preferredLanguages.findIndex((l) => l.language === language);
      if (langIdx >= 0) {
        prefs.preferredLanguages[langIdx].score += weight;
      } else {
        prefs.preferredLanguages.push({ language, score: weight });
      }
    }

    // Update genre score
    if (genre) {
      const genreIdx = prefs.preferredGenres.findIndex((g) => g.genre === genre);
      if (genreIdx >= 0) {
        prefs.preferredGenres[genreIdx].score += weight;
      } else {
        prefs.preferredGenres.push({ genre, score: weight });
      }
    }

    // Update artist score
    if (primaryArtist) {
      const artistIdx = prefs.preferredArtists.findIndex(
        (a) => a.artistId === primaryArtist.id
      );
      if (artistIdx >= 0) {
        prefs.preferredArtists[artistIdx].score += weight;
      } else {
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

  async updateFromSearch(userId: string, query: string, intent: any) {
    let prefs = await UserPreferencesModel.findOne({ userId });
    if (!prefs) prefs = await UserPreferencesModel.create({ userId });

    // Update search history
    prefs.searchHistory = [query, ...prefs.searchHistory.filter((q) => q !== query)].slice(0, 50);

    // Update genre from AI intent
    if (intent.genre) {
      const genre = intent.genre.toLowerCase();
      const idx = prefs.preferredGenres.findIndex((g) => g.genre === genre);
      if (idx >= 0) prefs.preferredGenres[idx].score += 0.5;
      else prefs.preferredGenres.push({ genre, score: 0.5 });
    }

    // Update language from AI intent
    if (intent.language) {
      const lang = intent.language.toLowerCase();
      const idx = prefs.preferredLanguages.findIndex((l) => l.language === lang);
      if (idx >= 0) prefs.preferredLanguages[idx].score += 0.5;
      else prefs.preferredLanguages.push({ language: lang, score: 0.5 });
    }

    await prefs.save();
  },

  async getUserPreferences(userId: string) {
    return UserPreferencesModel.findOne({ userId });
  },

  async getTopGenres(userId: string, limit = 5): Promise<string[]> {
    const prefs = await UserPreferencesModel.findOne({ userId });
    if (!prefs) return [];
    return prefs.preferredGenres
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((g) => g.genre);
  },

  async getTopArtists(userId: string, limit = 5): Promise<{ artistId: string; name: string }[]> {
    const prefs = await UserPreferencesModel.findOne({ userId });
    if (!prefs) return [];
    return prefs.preferredArtists
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((a) => ({ artistId: a.artistId, name: a.name }));
  },

  async getTopLanguages(userId: string, limit = 3): Promise<string[]> {
    const prefs = await UserPreferencesModel.findOne({ userId });
    if (!prefs) return [];
    return prefs.preferredLanguages
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((l) => l.language);
  },
};
