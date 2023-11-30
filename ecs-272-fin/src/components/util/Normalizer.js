export default function normalizeData(data) {
    // Make a shallow copy of the input data
    const dataCopy = data.map((row) => ({ ...row }));

    // Extract column names
    const columns = Object.keys(dataCopy[0]);

    // Create an object to store min and max values for each column
    const columnMinMax = {};

    // Initialize min and max values for each column
    columns.forEach((column) => {
        columnMinMax[column] = {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE,
        };
    });

    // Find min and max values for each column
    dataCopy.forEach((row) => {
        columns.forEach((column) => {
            // Skip "Parameter" and "Value" columns
            if (column !== "Parameter" && column !== "Value") {
                const value = parseFloat(row[column]);
                if (!isNaN(value)) {
                    columnMinMax[column].min = Math.min(columnMinMax[column].min, value);
                    columnMinMax[column].max = Math.max(columnMinMax[column].max, value);
                }
            }
        });
    });

    // Perform normalization on each column of the copy
    dataCopy.forEach((row) => {
        columns.forEach((column) => {
            // Skip "Parameter" and "Value" columns
            if (column !== "Parameter" && column !== "Value") {
                const value = parseFloat(row[column]);
                if (!isNaN(value)) {
                    const min = columnMinMax[column].min;
                    const max = columnMinMax[column].max;

                    // Perform Min-Max scaling on the copy
                    row[column] = (value - min) / (max - min);
                }
            }
        });
    });

    return dataCopy;
}
