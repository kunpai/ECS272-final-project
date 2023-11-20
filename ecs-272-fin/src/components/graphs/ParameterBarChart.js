import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import getCorrectData from '../util/StarData';
import { Button } from 'react-bootstrap';

const ParameterBarChart = ({ parameter, view, setView }) => {
    const ref = useRef();
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const csvData = await getCorrectData(view);
                setData(csvData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [view]);

    const goBack = () => {
        const views = view.split("-");
        if (views.length > 1) {
            // Remove the last element to go back
            views.pop();
            const newView = views.join("-");
            setView(newView);
        }
    };

    const trimmedData = data
    .filter(d => d.Parameter === parameter)
    .map(d => {
        const filteredColumns = Object.keys(d)
        .filter(key => {
            // Include the columns you want to keep, e.g., 'Value'
            const allowedColumns = ['Value', view.split('-').slice(-1)[0].toLowerCase()];
            return allowedColumns.includes(key);
        })
        .reduce((obj, key) => {
            obj[key] = parseFloat(d[key]);
            return obj;
        }, {});
        return { ...filteredColumns };
    });

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
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [trimmedData]);

    const drawChart = (data) => {
        const svg = d3.select(ref.current);
        const width = window.innerWidth/(4/1);
        const height = window.innerHeight/(4/3);
        const margin = { top: 60, right: 20, bottom: 20, left: 40 };
        svg.selectAll('*').remove();

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
            const value = d[view.split('-').slice(-1)[0].toLowerCase()];
            const xPosition = parseFloat(d3.select(event.currentTarget).attr('x')) + xScale.bandwidth() / 2;
            const yPosition = parseFloat(d3.select(event.currentTarget).attr('y')) / 2 + height / 2;
            console.log('X:', xPosition);
            console.log('Y:', yPosition);
            console.log('Value:', value);
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
        <div>
            <Button variant="primary" onClick={goBack}>Back</Button>
            {ref && (
                <svg ref={ref} />
            )}
        </div>
    );
};

export default ParameterBarChart;