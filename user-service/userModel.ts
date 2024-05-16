import mongoose, { Schema, Document } from 'mongoose';

// User interface type
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
} // note: id is automatically added by mongoose

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


export default mongoose.model<IUser>('User', UserSchema);
