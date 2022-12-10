import cron from 'node-cron';
import { generateReports } from '../utils';

// 5 min - */5 * * * *
// 1 min - * * * * *
// every day - 0 0 * * *
cron.schedule('*/5 * * * *', async () => {
    console.log('running a task every minute');
    try {
        await generateReports();
        console.log('reports generated');
    } catch (error) {
        console.error('Failed to generate report', error);
    }
});
