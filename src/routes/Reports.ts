import express from 'express';
import reportsController from '../controllers/Reports';

const router = express.Router();

router.get('/', reportsController.generateReports);
export = router;
