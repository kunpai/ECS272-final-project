import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import getCorrectData from '../util/StarData';
import { Button, FormCheck } from 'react-bootstrap';

const ParameterBarChart = ({ parameter, view, setView }) => {
    const ref = useRef();
    const [data, setData] = useState([]);
    const [showBaseline, setShowBaseline] = useState(false);
    const [baselineData, setBaselineData] = useState([]);
    const [trimmedData, setTrimmedData] = useState([]);
    const [baselineDataAvailable, setBaselineDataAvailable] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(baselineData)
                const csvData = await getCorrectData('baseline');
                console.log(csvData);
                const filteredData = csvData
                    .filter(d =>
                        d.Benchmarks.toLowerCase() === view.split('-').slice(-1)[0].toLowerCase()
                    )
                    .map(d => {
                        const filteredColumns = Object.keys(d)
                            .filter(key => {
                                const allowedColumns = [view.split('-')[1]];
                                return allowedColumns.includes(key);
                            })
                            .reduce((obj, key) => {
                                obj[view.split('-').slice(-1)[0].toLowerCase()] = d[key];
                                return obj;
                            }, {});
                        if (Object.keys(filteredColumns).length !== 0) {
                            filteredColumns['Value'] = 'Baseline';
                            console.log(filteredColumns);
                            return { ...filteredColumns };
                        } else {
                            return null;
                        }
                    })
                    .filter(filteredItem => filteredItem !== null);
                setBaselineData(filteredData);
                if (filteredData.length === 0) {
                    setBaselineDataAvailable(false);
                } else {
                    setBaselineDataAvailable(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [view]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const csvData = await getCorrectData(view);
                setData(csvData);
                setTrimmedData(
                    csvData
                    .filter(d => d.Parameter === parameter)
                    .map(d => {
                        const filteredColumns = Object.keys(d)
                        .filter(key => {
                            const allowedColumns = ['Value', view.split('-').slice(-1)[0].toLowerCase()];
                            return allowedColumns.includes(key);
                        })
                        .reduce((obj, key) => {
                            obj[key] = d[key];
                            return obj;
                        }, {});
                        return { ...filteredColumns };
                    })
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [view]);

    const goBack = () => {
        const views = view.split("-");
        if (views.length > 1) {
            views.pop();
            const newView = views.join("-");
            setView(newView);
        }
    };

    const handleBaselineToggle = () => {
        setShowBaseline(!showBaseline);
    };

    useEffect(() => {
        let trimmedData = data
        .filter(d => d.Parameter === parameter)
        .map(d => {
          const filteredColumns = Object.keys(d)
            .filter(key => {
              const allowedColumns = ['Value', view.split('-').slice(-1)[0].toLowerCase()];
              return allowedColumns.includes(key);
            })
            .reduce((obj, key) => {
              obj[key] = d[key];
              return obj;
            }, {});
          return { ...filteredColumns };
        });
        if (showBaseline) {
            trimmedData.push(...baselineData);
            setTrimmedData(trimmedData);
        } else {
            setTrimmedData(trimmedData);
        }
    }, [showBaseline]);

    useEffect(() => {
        if (trimmedData.length > 0) {
          drawChart(trimmedData);
        }
    }, [trimmedData]);

    const handleResize = () => {
        if (trimmedData.length > 0) {
            drawChart(trimmedData);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [trimmedData]);

    const drawChart = (data) => {
        d3.selectAll('.tooltip').remove();
        const svg = d3.select(ref.current);
        const width = window.innerWidth/(4/1);
        const height = window.innerHeight/(4/3);
        const margin = { top: 60, right: 20, bottom: 60, left: 40 };
        svg.selectAll('*').remove();

        data.sort((a, b) => d3.ascending(a.Value, b.Value));

        svg.attr('width', width);
        svg.attr('height', height);


        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .attr('font-weight', 'bold')
            .text(parameter)
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2 + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .attr('font-weight', 'bold')
            .text(view.split('-').slice(-1)[0] + ' ' + view.split('-').slice(-3)[0])
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.Value))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => parseFloat(d[view.split('-').slice(-1)[0].toLowerCase()]))])
            .range([height - margin.bottom, margin.top]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".1e"));

        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .attr('text-anchor', 'end')
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);

        svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis)
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);

        const bars = svg.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => xScale(d.Value))
            .attr('y', d => yScale(0))
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            .attr('fill', 'steelblue');

        bars.transition()
            .duration(1000)
            .attr('y', d => yScale(d[view.split('-').slice(-1)[0].toLowerCase()]))
            .attr('height', d => yScale(0) - yScale(d[view.split('-').slice(-1)[0].toLowerCase()]));

        bars.on('mouseover', (event, d) => {
            const rawValue = d[view.split('-').slice(-1)[0].toLowerCase()];
            let value;

            if (Number.isInteger(rawValue)) {
                value = rawValue.toString();
            } else {
                value = parseFloat(rawValue).toFixed(3).replace(/\.?0+$/, '');
            }

            const xPosition = parseFloat(d3.select(event.currentTarget).attr('x')) + xScale.bandwidth() / 2;
            const yPosition = parseFloat(d3.select(event.currentTarget).attr('y')) / 2 + height / 2;

            svg.append('text')
                .attr('id', 'tooltip')
                .attr('x', xPosition)
                .attr('y', yPosition)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .text(value);
        })
        .on('mouseout', () => {
            svg.select('#tooltip').remove();
        }
        );
    }

    return (
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={goBack}>Back</Button>
          {ref && <svg ref={ref} />}
          <div style={{ marginTop: '10px' }}>
            <FormCheck type="checkbox" id="baselineCheckbox" checked={showBaseline} onChange={handleBaselineToggle} label="Baseline" style={{ display: 'inline-block' }} disabled={!baselineDataAvailable} />
          </div>
        </div>
    );
};

export default ParameterBarChart;