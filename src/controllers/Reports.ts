import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Receipt from '../models/Receipt';

const generateReports = async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200);
};

export default { generateReports };
