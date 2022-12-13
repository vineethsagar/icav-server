import cron from 'node-cron';
import { generateReports } from '../utils';
import fs from 'fs';
import Receipt from '../models/Receipt';
const folder = './reports';

// 5 min - */5 * * * *
// 1 min - * * * * *
// every day - 0 0 * * *

const _5min = '*/5 * * * *';
const _15min = '*/15 * * * *';
const _1min = '* * * * *';
const _1Day = '0 0 * * *';

const reportFrequency = _15min;
console.log(`Reports will be generated every ${reportFrequency}`);

cron.schedule(reportFrequency, async () => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
        console.log('Folder Created Successfully.');
    }
    const documentsCount = await Receipt.collection.countDocuments();
    console.log('total documents count. Not generating reports', documentsCount);
    if (documentsCount === 0) {
        return;
    }
    // .then((count) => console.log('total documents count ', count))
    // .catch((err) => console.log('error getting counts', err));
    console.log('running a task every minute');
    try {
        await generateReports();
        console.log('reports generated');
    } catch (error) {
        console.error('Failed to generate report', error);
    }
});
