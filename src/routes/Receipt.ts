import express from 'express';
import controller from '../controllers/Receipt';
import { Schemas, ValidateReceiptIdSchema, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *      Receipt:
 *          type : object
 *          properties:
 *              title:
 *                  type: string
 *                  description: Name of the Receipt
 *              cost:
 *                  type: number
 *                  description: Amount
 *              time:
 *                  type: string
 *                  format: date-time
 *                  description: Date of the receipt - ISO8601 compliant date-time string
 *              category:
 *                  type: string
 *                  enum: ['Entertainment', 'Groceries', 'Other', 'Shopping', 'Transport']
 *                  description: Category of the receipt
 *          required :
 *              -title
 *              -cost
 *              -time
 *              -category
 *          example:
 *              title: Dinner with family
 *              cost:  1250
 *              time:   "2022-12-10T04:31:51.206Z"
 *              category: Other
 */

/**
 * @swagger
 * /receipts:
 *      post:
 *          summary : Create a new Receipt
 *          responses:
 *              201:
 *                  description: Created a new Receipt
 */
router.post('/', ValidateSchema(Schemas.receipts.create), controller.createReceipt);
router.get('/', controller.readAllReceipt);
router.get('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.readReceipt);
router.patch('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.updateReceipt);
router.delete('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.deleteReceipt);

export = router;
