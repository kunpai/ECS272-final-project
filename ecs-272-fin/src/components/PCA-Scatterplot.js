import * as d3 from 'd3';
import React from 'react';
import { useState, useEffect } from 'react';
import { readCSV } from '@/components/util/CSV-Reader';

import ScatterPlot from './graphs/Scatterplot';
import Tooltip from './graphs/PrincipalComponentPlot';
import StarChart from './graphs/StarChart';

export default function PCA_Scatterplot() {
    const [data, setData] = useState([]);
    const [pc1, setPC1] = useState([]);
    const [pc2, setPC2] = useState([]);
    const [tooltipAxis, setTooltipAxis] = useState(null);
    const [parameter, setParameter] = useState(null);
    const [view, setView] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const csvData = await readCSV('/data/pca.csv');
                const pc1Data = await readCSV('/data/pc1.csv');
                const pc2Data = await readCSV('/data/pc2.csv');
                setData(csvData);
                setPC1(pc1Data);
                setPC2(pc2Data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <ScatterPlot data={data} callbackPC={setTooltipAxis} setParameter={setParameter} setView={setView} />
            {tooltipAxis && (
                <Tooltip axis={tooltipAxis} data={tooltipAxis === 'PC1' ? pc1 : pc2} width={window.innerWidth} height={window.innerHeight} margin={0} />
            )}
            {parameter && view && (
                <StarChart parameter={parameter} view={view} setView={setView} />
            )}
        </div>
    );
}
