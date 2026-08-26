import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  songId: string;
  songData: Record<string, unknown>;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    songId: { type: String, required: true },
    songData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, songId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
