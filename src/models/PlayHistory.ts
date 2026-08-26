import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayHistory extends Document {
  userId: mongoose.Types.ObjectId;
  songId: string;
  songData: Record<string, unknown>;
  playedAt: Date;
  completionPercentage: number;
}

const PlayHistorySchema = new Schema<IPlayHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  songId: { type: String, required: true },
  songData: { type: Schema.Types.Mixed, default: {} },
  playedAt: { type: Date, default: Date.now, index: true },
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
});

PlayHistorySchema.index({ userId: 1, playedAt: -1 });

export const PlayHistoryModel = mongoose.model<IPlayHistory>('PlayHistory', PlayHistorySchema);
