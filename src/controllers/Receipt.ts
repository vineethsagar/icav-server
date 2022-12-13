import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Receipt from '../models/Receipt';

const createReceipt = (req: Request, res: Response, next: NextFunction) => {
    const { category, cost, title, time } = req.body;

    const receipt = new Receipt({
        _id: new mongoose.Types.ObjectId(),
        time,
        title,
        category,
        cost
    });

    return receipt
        .save()
        .then((receipt) => res.status(201).json({ receipt }))
        .catch((error) => res.status(400).json({ error }));
};
const readReceipt = (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;

    return Receipt.findById(receiptId)
        .then((receipt) => (receipt ? res.status(200).json({ receipt }) : res.status(404).json({ message: `Receipt with ${receiptId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};
const updateReceipt = (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    try {
        return Receipt.findById(receiptId).then((receipt) => {
            if (receipt) {
                receipt.set(req.body);
                return receipt
                    .save()
                    .then((receipt) => res.status(200).json({ receipt }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: `Receipt with ${receiptId} not found` });
            }
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
const deleteReceipt = (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    return Receipt.findByIdAndDelete(receiptId)
        .then((receipt) => (receipt ? res.sendStatus(204) : res.status(404).json({ message: `Receipt with ${receiptId} not found` })))
        .catch((error) => res.status(500).json({ error }));
};
const readAllReceipt = (req: Request, res: Response, next: NextFunction) => {
    return Receipt.find()
        .then((receipts) => res.status(200).json({ receipts }))
        .catch((error) => res.status(400).json({ error }));
};

export default { readAllReceipt, deleteReceipt, updateReceipt, readReceipt, createReceipt };
