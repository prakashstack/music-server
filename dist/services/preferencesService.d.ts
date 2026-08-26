import mongoose from 'mongoose';
export declare const preferencesService: {
    updateFromPlay(userId: string, songData: any, completionPercentage: number): Promise<void>;
    updateFromSearch(userId: string, query: string, intent: any): Promise<void>;
    getUserPreferences(userId: string): Promise<(mongoose.Document<unknown, {}, import("../models/UserPreferences").IUserPreferences, {}, {}> & import("../models/UserPreferences").IUserPreferences & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getTopGenres(userId: string, limit?: number): Promise<string[]>;
    getTopArtists(userId: string, limit?: number): Promise<{
        artistId: string;
        name: string;
    }[]>;
    getTopLanguages(userId: string, limit?: number): Promise<string[]>;
};
//# sourceMappingURL=preferencesService.d.ts.map