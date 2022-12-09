import express from 'express';
import controller from '../controllers/Receipt';
import { Schemas, ValidateReceiptIdSchema, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.receipts.create), controller.createReceipt);
router.get('/', controller.readAllReceipt);
router.get('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.readReceipt);
router.patch('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.updateReceipt);
router.delete('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.deleteReceipt);

export = router;
