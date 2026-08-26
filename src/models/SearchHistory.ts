import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchHistory extends Document {
  userId: mongoose.Types.ObjectId;
  query: string;
  category: string;
  metadata: Record<string, unknown>;
  searchedAt: Date;
}

const SearchHistorySchema = new Schema<ISearchHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  query: { type: String, required: true },
  category: { type: String, default: 'general' },
  metadata: { type: Schema.Types.Mixed, default: {} },
  searchedAt: { type: Date, default: Date.now, index: true },
});

SearchHistorySchema.index({ userId: 1, searchedAt: -1 });

export const SearchHistoryModel = mongoose.model<ISearchHistory>(
  'SearchHistory',
  SearchHistorySchema
);
