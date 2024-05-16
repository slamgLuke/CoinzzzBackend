import mongoose, { Schema, Document } from 'mongoose';

// Currency interface type
export interface ICurrency extends Document {
} // note: id is automatically added by mongoose

const CurrencySchema: Schema = new Schema({
});
