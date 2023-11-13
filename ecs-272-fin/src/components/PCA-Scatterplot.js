import * as d3 from 'd3';
import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { readCSV } from '@/components/util/CSV-Reader';

import ScatterPlot from './graphs/Scatterplot';

export default function PCA_Scatterplot() {
    const [data, setData] = useState([]);
    const [pc1, setPC1] = useState([]);
    const [pc2, setPC2] = useState([]);

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
            <ScatterPlot data={data} pc1={pc1} pc2 ={pc2} />
        </div>
    );
}
