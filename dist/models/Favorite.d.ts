import mongoose, { Document } from 'mongoose';
export interface IFavorite extends Document {
    userId: mongoose.Types.ObjectId;
    songId: string;
    songData: Record<string, unknown>;
    createdAt: Date;
}
export declare const FavoriteModel: mongoose.Model<IFavorite, {}, {}, {}, mongoose.Document<unknown, {}, IFavorite, {}, {}> & IFavorite & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Favorite.d.ts.map