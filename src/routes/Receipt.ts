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
 *          tags:
 *          - Receipts
 *          summary : Create a new Receipt
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Receipt'
 *          responses:
 *              201:
 *                  description: Created a new Receipt
 *              400:
 *                  description: Failed to save receipt
 *              500:
 *                  description: Internal Server Error
 */
router.post('/', ValidateSchema(Schemas.receipts.create), controller.createReceipt);

/**
 * @swagger
 * /receipts:
 *      get:
 *          tags:
 *          - Receipts
 *          summary : Get all receipts
 *          responses:
 *              200:
 *                  description: Returns all the receipts in the database
 *              400:
 *                  description: Failed to return receipts
 *              500:
 *                  description: Internal Server Error
 
 */
router.get('/', controller.readAllReceipt);

/**
 * @swagger
 * /receipts/{receiptId}:
 *      get:
 *          tags:
 *          - Receipts
 *          summary : Get a receipt using its id
 *          parameters:
 *          -   name: receiptId
 *              in: path
 *              required: true
 *              schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: Success
 *              404:
 *                  description: Receipt not found
 *              500:
 *                  description: Internal Server Error
 */
router.get('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.readReceipt);

/**
 * @swagger
 * /receipts/{receiptId}:
 *      patch:
 *          tags:
 *          - Receipts
 *          summary : update a receipt using its id
 *          parameters:
 *          -   name: receiptId
 *              required: true
 *              in: path
 *              schema:
 *                  type: string
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Receipt'
 *          responses:
 *              200:
 *                  description: Receipt data updated
 *              404:
 *                  description: Receipt not found
 *              500:
 *                  description: Internal Server Error
 */
router.patch('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.updateReceipt);

/**
 * @swagger
 * /receipts/{receiptId}:
 *      delete:
 *          tags:
 *          - Receipts
 *          summary : delete a receipt using its id
 *          parameters:
 *          -   name: receiptId
 *              required: true
 *              in: path
 *              schema:
 *                  type: string
 *          responses:
 *              204:
 *                  description: Successfully deleted receipt
 *              404:
 *                  description: Receipt not found
 *              500:
 *                  description: Internal Server Error
 */
router.delete('/:receiptId', ValidateReceiptIdSchema(Schemas.receipts.readById), controller.deleteReceipt);

export = router;
