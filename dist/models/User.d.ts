import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    googleId: string;
    name: string;
    email: string;
    profileImage: string;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
}
export declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map