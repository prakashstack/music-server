import mongoose, { Document } from 'mongoose';
export interface ISearchHistory extends Document {
    userId: mongoose.Types.ObjectId;
    query: string;
    category: string;
    metadata: Record<string, unknown>;
    searchedAt: Date;
}
export declare const SearchHistoryModel: mongoose.Model<ISearchHistory, {}, {}, {}, mongoose.Document<unknown, {}, ISearchHistory, {}, {}> & ISearchHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SearchHistory.d.ts.map