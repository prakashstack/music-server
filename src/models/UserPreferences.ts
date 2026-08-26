import mongoose, { Document, Schema } from 'mongoose';

interface GenreScore {
  genre: string;
  score: number;
}

interface ArtistScore {
  artistId: string;
  name: string;
  score: number;
}

interface LanguageScore {
  language: string;
  score: number;
}

interface RecentSong {
  songId: string;
  title: string;
  artist: string;
  artwork: string;
  playedAt: Date;
}

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  preferredGenres: GenreScore[];
  preferredArtists: ArtistScore[];
  preferredLanguages: LanguageScore[];
  recentlyPlayed: RecentSong[];
  searchHistory: string[];
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    preferredGenres: [{ genre: String, score: { type: Number, default: 0 } }],
    preferredArtists: [{ artistId: String, name: String, score: { type: Number, default: 0 } }],
    preferredLanguages: [{ language: String, score: { type: Number, default: 0 } }],
    recentlyPlayed: [
      {
        songId: String,
        title: String,
        artist: String,
        artwork: String,
        playedAt: { type: Date, default: Date.now },
      },
    ],
    searchHistory: [{ type: String }],
  },
  { timestamps: true }
);

export const UserPreferencesModel = mongoose.model<IUserPreferences>(
  'UserPreferences',
  UserPreferencesSchema
);
