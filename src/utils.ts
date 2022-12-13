import Receipt from './models/Receipt';
import { writeFileSync } from 'fs';
export const generateReports = async () => {
    let errorOccurred: boolean = false;
    //* Calculating sum
    try {
        const aggCursor = Receipt.collection.aggregate([
            {
                $group: {
                    _id: '',
                    cost: { $sum: '$cost' }
                }
            },
            {
                $project: {
                    _id: 0,
                    TotalCost: '$cost'
                }
            }
        ]);
        const response = (await aggCursor.toArray()).shift();
        if (!response) {
            console.error('There is no data ', response);
            return;
        }
        let totalCost = response.TotalCost;

        //* Adding percentage field to all documents
        const addFieldsCur = Receipt.collection.aggregate([
            {
                $addFields: {
                    percent: { $round: [{ $divide: ['$cost', totalCost] }, 2] }
                }
            }
        ]);
        const responseAdd = await addFieldsCur.toArray();
        if (!responseAdd) {
            console.error('There is no data ', response);
            return;
        }
        const time = new Date().toString().split(' ').join('_').split(':').join('_').substring(0, 24);
        let allReport = `Id,Category,Title,Cost,Time,Percentage\n`;
        const categoryReport: any = {};
        for (let i = 0; i < responseAdd.length; i++) {
            const obj = responseAdd[i];
            allReport += `${obj._id},${obj.category},${obj.title},${obj.cost},${obj.time},${obj.percent * 100}%\n`;
            categoryReport[obj.category] = (categoryReport[obj.category] ? categoryReport[obj.category] : 0) + obj.cost;
        }
        console.log('printing all reports', allReport);

        //* generate all_report file
        try {
            writeFileSync(`./reports/reports_${time}.csv`, allReport);
            // writeFileSync('./category_reports.csv', categoryReport);
        } catch (error) {
            console.error('Failed to generate report', error);
            errorOccurred = true;
        }

        //* generate category file
        try {
            let cat = `Category Name, Total Sum, Percent\n`;
            let catKeys = Object.keys(categoryReport);

            for (let index = 0; index < catKeys.length; index++) {
                const key = catKeys[index];
                const catCost = categoryReport[key];
                const percent: number = (catCost / totalCost) * 100;
                cat += `${key},${catCost},${percent.toFixed(2)}\n`;
            }
            writeFileSync(`./reports/category_report_${time}.csv`, cat);
        } catch (error) {
            console.error('Failed to generate category report', error);
            errorOccurred = true;
        }

        if (!errorOccurred) {
            dropReceiptsTable();
        }
    } catch (error) {
        console.error('Something went wrong!! Unable to generate reports ', error);
    }
};

const dropReceiptsTable = () => {
    try {
        console.log('Removing all documents in Receipt Collection');
        Receipt.collection.deleteMany({});
    } catch (error) {
        console.error('Failed to remove all documents in Receipt Collection');
    }
};
