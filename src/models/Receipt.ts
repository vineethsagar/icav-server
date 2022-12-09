import mongoose, { Document, Schema } from 'mongoose';

export enum Category {
    Entertainment = 'Entertainment',
    Transport = 'Transport',
    Groceries = 'Groceries',
    Shopping = 'Shopping',
    Other = 'Other'
}
export const categoryOptions = ['Entertainment', 'Groceries', 'Other', 'Shopping', 'Transport'];

export interface Receipt {
    category: Category;
    title: string;
    cost: number;
    time: Date;
}

export interface ReceiptId {
    receiptId: string;
}

export interface ReceiptModel extends Receipt, Document {}

const ReceiptSchema: Schema = new Schema(
    {
        category: { type: String, enum: Category, required: true },
        title: { type: String, required: true },
        cost: { type: Number, required: true },
        time: { type: Date, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export default mongoose.model<ReceiptModel>('Receipt', ReceiptSchema);
