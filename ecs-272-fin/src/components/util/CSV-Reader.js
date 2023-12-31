import * as d3 from 'd3';

export async function readCSV(path) {
    const input = path;
    try {
        const response = await fetch(input);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        const csvData = d3.csvParse(data);
        delete csvData.columns;
        return csvData;
    } catch (err) {
        console.error(err);
        return null;
    }
}