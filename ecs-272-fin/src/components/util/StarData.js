import { readCSV } from '../util/CSV-Reader';

const getCorrectData = async (view) => {
    if (view === 'overview') {
        return await readCSV('/data/overall-stats.csv');
    } else if (view === 'overview_Instructions') {
        return await readCSV('/data/instructions-stats.csv');
    } else if (view === 'overview_Cycles') {
        return await readCSV('/data/cycles-stats.csv');
    } else if (view === 'overview_IPC') {
        return await readCSV('/data/IPC-stats.csv');
    } else if (view === 'overview_Seconds') {
        return await readCSV('/data/seconds-stats.csv');
    } else if (view === 'overview_Branches') {
        return await readCSV('/data/branches-stats.csv');
    } else if (view.includes('overview_Instructions') && view.includes('Control')) {
        return await readCSV('/data/Control/Control-Instructions.csv');
    } else if (view.includes('overview_Instructions') && view.includes('Memory')) {
        return await readCSV('/data/Memory/Memory-Instructions.csv');
    } else if (view.includes('overview_Instructions') && view.includes('Execution')) {
        return await readCSV('/data/Execution/Execution-Instructions.csv');
    } else if (view.includes('overview_Instructions') && view.includes('Data_Dependency')) {
        return await readCSV('/data/Data_Dependency/Data_Dependency-Instructions.csv');
    } else if (view.includes('overview_Instructions') && view.includes('Store_Intense')) {
        return await readCSV('/data/Store_Intense/Store_Intense-Instructions.csv');
    } else if (view.includes('overview_Cycles') && view.includes('Control')) {
        return await readCSV('/data/Control/Control-Cycles.csv');
    } else if (view.includes('overview_Cycles') && view.includes('Memory')) {
        return await readCSV('/data/Memory/Memory-Cycles.csv');
    } else if (view.includes('overview_Cycles') && view.includes('Execution')) {
        return await readCSV('/data/Execution/Execution-Cycles.csv');
    } else if (view.includes('overview_Cycles') && view.includes('Data_Dependency')) {
        return await readCSV('/data/Data_Dependency/Data_Dependency-Cycles.csv');
    } else if (view.includes('overview_Cycles') && view.includes('Store_Intense')) {
        return await readCSV('/data/Store_Intense/Store_Intense-Cycles.csv');
    } else if (view.includes('overview_IPC') && view.includes('Control')) {
        return await readCSV('/data/Control/Control-IPC.csv');
    } else if (view.includes('overview_IPC') && view.includes('Memory')) {
        return await readCSV('/data/Memory/Memory-IPC.csv');
    } else if (view.includes('overview_IPC') && view.includes('Execution')) {
        return await readCSV('/data/Execution/Execution-IPC.csv');
    } else if (view.includes('overview_IPC') && view.includes('Data_Dependency')) {
        return await readCSV('/data/Data_Dependency/Data_Dependency-IPC.csv');
    } else if (view.includes('overview_IPC') && view.includes('Store_Intense')) {
        return await readCSV('/data/Store_Intense/Store_Intense-IPC.csv');
    } else if (view.includes('overview_Seconds') && view.includes('Control')) {
        return await readCSV('/data/Control/Control-Seconds.csv');
    } else if (view.includes('overview_Seconds') && view.includes('Memory')) {
        return await readCSV('/data/Memory/Memory-Seconds.csv');
    } else if (view.includes('overview_Seconds') && view.includes('Execution')) {
        return await readCSV('/data/Execution/Execution-Seconds.csv');
    } else if (view.includes('overview_Seconds') && view.includes('Data_Dependency')) {
        return await readCSV('/data/Data_Dependency/Data_Dependency-Seconds.csv');
    } else if (view.includes('overview_Seconds') && view.includes('Store_Intense')) {
        return await readCSV('/data/Store_Intense/Store_Intense-Seconds.csv');
    } else if (view.includes('overview_Branches') && view.includes('Control')) {
        return await readCSV('/data/Control/Control-Branches.csv');
    } else if (view.includes('overview_Branches') && view.includes('Memory')) {
        return await readCSV('/data/Memory/Memory-Branches.csv');
    } else if (view.includes('overview_Branches') && view.includes('Execution')) {
        return await readCSV('/data/Execution/Execution-Branches.csv');
    } else if (view.includes('overview_Branches') && view.includes('Data_Dependency')) {
        return await readCSV('/data/Data_Dependency/Data_Dependency-Branches.csv');
    } else if (view.includes('overview_Branches') && view.includes('Store_Intense')) {
        return await readCSV('/data/Store_Intense/Store_Intense-Branches.csv');
    }
    return [];
}

export default getCorrectData;