import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data, callbackPC, setParameter, setView }) => {
  const svgRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      d3.select(svgRef.current).selectAll('*').remove();
      drawChart();
    };

    window.addEventListener('resize', handleResize);

    drawChart();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  const drawChart = () => {
    const width = window.innerWidth/(4/3) - 200;
    const height = window.innerHeight/(4/3);
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };

    const pc1Extent = d3.extent(data, (d) => d.PC1);
    const pc2Extent = d3.extent(data, (d) => d.PC2);
    const uniqueParameters = [...new Set(data.map((d) => d.parameter))];

    const distinctColors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
      '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
      '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
      '#1f77b4', '#ff7f0e', '#2ca02c'
    ];

    const colorScale = d3.scaleOrdinal()
      .range(distinctColors)
      .domain(uniqueParameters);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([pc1Extent[0] - 4, pc1Extent[1] - 4]).range([0, width]);
    const yScale = d3.scaleLinear().domain([pc2Extent[0] - 4, pc2Extent[1] - 4]).range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .attr('opacity', 0)
    .transition()
    .duration(500)
    .attr('opacity', 1);

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none");

    tooltip.append("div")
      .style("font-size", "12px")
      .style("padding", "8px")
      .style("background", "rgba(255, 255, 255, 0.8)")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px");

    const circles = svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.PC1))
      .attr('cy', (d) => yScale(d.PC2))
      .attr('r', 0)
      .attr('fill', (d) => colorScale(d.parameter))
      .attr('class', (d) => d.parameter.replace(/\./g, '-').replace(/[^a-zA-Z0-9-_]/g, ''))
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave)
      .on('click', (event, d) => handleMouseClick(d));

    circles
      .transition()
      .duration(500)
      .attr('r', 5);

    const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event) => {
      const { transform } = event;
      circles.attr('transform', transform);
      svg.select('.x-axis').call(xAxis.scale(transform.rescaleX(xScale)));
      svg.select('.y-axis').call(yAxis.scale(transform.rescaleY(yScale)));
    });

    svg.call(zoom);

    function handleMouseEnter(event, d) {

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Parameter: ${d.parameter} <br/> Value: ${d.value}`)
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 28}px`);

      circles.filter((datum) => datum.parameter === d.parameter)
        .attr('opacity', 0.7)
        .attr('r', 7)
        .raise();

      circles.filter((datum) => datum.parameter !== d.parameter)
        .attr('opacity', 0.3);
    }

    function handleMouseLeave() {
      tooltip.transition().duration(500).style("opacity", 0);
      circles.attr('opacity', 1).attr('r', 5);
    }

    function handleMouseClick(d) {
        setParameter(d.parameter);
        setView('overview');
    }

    function handleLegendClick(d) {
        setParameter(d);
        setView('overview');
    }

    const xAxisLabel = svg
      .append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 10})`)
      .style('text-anchor', 'middle')
      .text('PC1')
      .style("cursor", "pointer")
      .on('click', () => handleAxisLabelClick('PC1'))
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1);

    const yAxisLabel = svg
      .append('text')
      .attr('transform', `translate(${-margin.left + 15},${height / 2}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('PC2')
      .style("cursor", "pointer")
      .on('click', () => handleAxisLabelClick('PC2'))
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1);

    let legendVisible = false;
    const collapsedLegend = svg
      .append('g')
      .attr('class', 'collapsed-legend')
      .attr('transform', `translate(${width - margin.right},${margin.top})`)
      .style('cursor', 'pointer')
      .on('click', toggleLegend);

    collapsedLegend
      .append('rect')
      .attr('width', 100)
      .attr('height', 20)
      .attr('fill', 'lightgray');

    collapsedLegend
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .text('Legend')
      .attr('font-size', '9px')
      .style('fill', 'black');

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`)
      .style('opacity', 0)
      .style('display', 'none');

    const legendItems = legend
      .selectAll('.legend-item')
      .data(uniqueParameters)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .on('mouseover', handleLegendMouseOver)
      .on('mouseout', handleLegendMouseOut)
      .on('click', (event, d) => handleLegendClick(d));

    function handleLegendMouseOver(event, parameter) {
      circles
        .filter((datum) => datum.parameter === parameter)
        .transition()
        .duration(50)
        .attr('opacity', 0.7)
        .attr('r', 7);

      circles
        .filter((datum) => datum.parameter !== parameter)
        .transition()
        .duration(50)
        .attr('opacity', 0);
    }

    function handleLegendMouseOut() {
      circles
        .transition()
        .duration(500)
        .attr('opacity', 1)
        .attr('r', 5);
    }

    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d));

    legendItems
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .text((d) => d)
      .attr('font-size', '9px');

    function toggleLegend() {
      legendVisible = !legendVisible;

      legend
        .transition()
        .duration(500)
        .style('opacity', legendVisible ? 1 : 0)
        .on('start', function () {
          if (legendVisible) {
            legend.style('display', 'block');
          }
        })
        .on('end', function () {
          if (!legendVisible) {
            legend.style('display', 'none');
          }
        });
    }



    const chartTitle = svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .attr('dy', '-1em')
        .style('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Scatter Plot of PC1 and PC2')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 1);

    const axisTooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .attr("id", "axis-tooltip");

    let tooltipVisible = false;
    let currentAxis = null;

    function handleAxisLabelClick(axis) {
        // axisTooltip.transition()
        //     .duration(200)
        //     .style("opacity", 0.9);

        if (currentAxis === axis && tooltipVisible) {
            // If the same axis is clicked and the tooltip is visible, hide it
            // axisTooltip.transition()
            //     .duration(500)
            //     .style("opacity", 0);
            callbackPC(null);
            tooltipVisible = false;
        } else {
            if (axis === 'PC1') {
                // axisTooltip.html("PC1 is the first principal component")
                //     .style("left", `${width / 2}px`)
                //     .style("top", `${height + margin.top + 10}px`);
                callbackPC('PC1');
            } else {
                // axisTooltip.html("PC2 is the second principal component")
                //     .style("left", `${-margin.left + 10}px`)
                //     .style("top", `${height / 2}px`);
                callbackPC('PC2');
            }

            currentAxis = axis;
            tooltipVisible = true;
        }
        setTimeout(function () {
            callbackPC(null);
        }, 15000);
    }
    };

    return (
          <svg ref={svgRef}>
          </svg>
      );
};

export default ScatterPlot;
