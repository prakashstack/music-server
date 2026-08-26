import mongoose, { Document } from 'mongoose';
export interface IPlayHistory extends Document {
    userId: mongoose.Types.ObjectId;
    songId: string;
    songData: Record<string, unknown>;
    playedAt: Date;
    completionPercentage: number;
}
export declare const PlayHistoryModel: mongoose.Model<IPlayHistory, {}, {}, {}, mongoose.Document<unknown, {}, IPlayHistory, {}, {}> & IPlayHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PlayHistory.d.ts.map