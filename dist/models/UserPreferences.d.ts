import mongoose, { Document } from 'mongoose';
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
export declare const UserPreferencesModel: mongoose.Model<IUserPreferences, {}, {}, {}, mongoose.Document<unknown, {}, IUserPreferences, {}, {}> & IUserPreferences & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=UserPreferences.d.ts.map