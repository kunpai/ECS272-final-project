import React from 'react';
import { useState, useEffect } from 'react';
import { readCSV } from '@/components/util/CSV-Reader';
import { Button, Breadcrumb } from "react-bootstrap";

import ScatterPlot from './graphs/Scatterplot';
import Tooltip from './graphs/PrincipalComponentPlot';
import StarChart from './graphs/StarChart';
import ParameterBarChart from './graphs/ParameterBarChart';

export default function PCA_Scatterplot() {
    const [data, setData] = useState([]);
    const [pc1, setPC1] = useState([]);
    const [pc2, setPC2] = useState([]);
    const [tooltipAxis, setTooltipAxis] = useState(null);
    const [parameter, setParameter] = useState(null);
    const [view, setView] = useState(null);

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

    const handleReload = () => {
        window.location.reload(true);
    };

    const viewBreadcrumb = view && view.split('-').map((breadcrumb, index, array) => {
        const capitalizedBreadcrumb = breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1);
        return (
            <Breadcrumb.Item
                key={breadcrumb}
                onClick={() => setView(array.slice(0, index + 1).join('-'))}
                active={index === array.length - 1}
            >
                {capitalizedBreadcrumb}
            </Breadcrumb.Item>
        );
    });

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: '20px', marginTop: '20px' }}>
                <div>
                    <Button variant="primary" onClick={handleReload}>Reload</Button>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <Breadcrumb style={{ marginBottom: '10px', display: 'inline-block' }}>
                        <Breadcrumb.Item onClick={() => setView(null)} active={!view}>PCA Scatter Plot</Breadcrumb.Item>
                        {viewBreadcrumb}
                    </Breadcrumb>
                </div>
            </div>

            <div>
                <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '20px', justifyContent: 'flex-start' }}>
                    <ScatterPlot data={data} callbackPC={setTooltipAxis} setParameter={setParameter} setView={setView} />
                    {parameter && view && view.split("-").length <= 3 && (
                        <StarChart parameter={parameter} view={view} setView={setView} />
                    )}
                    {parameter && view && view.split("-").length > 3 && (
                        <ParameterBarChart parameter={parameter} view={view} setView={setView}/>
                    )}
                    {tooltipAxis && (
                        <Tooltip axis={tooltipAxis} data={tooltipAxis === 'PC1' ? pc1 : pc2} />
                    )}
                </div>
            </div>
        </>
    );
}
