import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Tooltip from './PrincipalComponentPlot';
import StarChart from './StarChart';

const ScatterPlot = ({ data, pc1, pc2 }) => {
  console.log(data);
  const svgRef = useRef();
  const [tooltipAxis, setTooltipAxis] = useState(null);
  const [overview, setOverview] = useState([null, null]);

  useEffect(() => {
    const handleResize = () => {
      // Remove the existing chart before redrawing
      d3.select(svgRef.current).selectAll('*').remove();
      drawChart();
    };

    window.addEventListener('resize', handleResize);

    // Initial chart drawing
    drawChart();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  const drawChart = () => {
    // Set up the dimensions of the SVG container
    const width = window.innerWidth/(4/3);
    const height = window.innerHeight/(4/3);
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };

    // Find the extent of your PC1 and PC2 values
    const pc1Extent = d3.extent(data, (d) => d.PC1);
    const pc2Extent = d3.extent(data, (d) => d.PC2);
    const uniqueParameters = [...new Set(data.map((d) => d.parameter))];
    console.log(uniqueParameters);

    const distinctColors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
      '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
      '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5',
      '#1f77b4', '#ff7f0e', '#2ca02c'
    ];

    console.log(distinctColors);

    const colorScale = d3.scaleOrdinal()
      .range(distinctColors)
      .domain(uniqueParameters);

    // Create an SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([pc1Extent[0] - 4, pc1Extent[1] - 4]).range([0, width]);
    const yScale = d3.scaleLinear().domain([pc2Extent[0] - 4, pc2Extent[1] - 4]).range([height, 0]);

    // Create and append axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(xAxis);
    svg.append('g').attr('class', 'y-axis').call(yAxis);

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("pointer-events", "none");

    tooltip.append("div")
    .style("font-size", "12px") // Set the font size here
    .style("padding", "8px")
    .style("background", "rgba(255, 255, 255, 0.8)")
    .style("border", "1px solid #ccc")
    .style("border-radius", "5px");


    // Create circles for the scatter plot
    const circles = svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.PC1))
      .attr('cy', (d) => yScale(d.PC2))
      .attr('r', 5) // Radius of the circles
      .attr('fill', (d) => colorScale(d.parameter))
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave)
      .on('click', (event, d) => handleMouseClick(d));

    const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', (event) => {
      const { transform } = event;
      circles.attr('transform', transform); // Update the circles' position with the zoom transformation
      svg.select('.x-axis').call(xAxis.scale(transform.rescaleX(xScale))); // Update the x-axis
      svg.select('.y-axis').call(yAxis.scale(transform.rescaleY(yScale))); // Update the y-axis
    });

    svg.call(zoom);

    function handleMouseEnter(event, d) {
      const currentColor = d3.select(this).attr('fill');

      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Parameter: ${d.parameter} <br/> Value: ${d.value}`)
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 28}px`);

      circles.filter((datum) => datum.parameter === d.parameter)
        .attr('opacity', 0.7)
        .attr('r', 7);

      circles.filter((datum) => datum.parameter !== d.parameter && datum.parameter === currentColor)
        .attr('opacity', 0.3);


    }

    // Function to handle mouse leave event
    function handleMouseLeave() {
        tooltip.transition().duration(500).style("opacity", 0);
      circles.attr('opacity', 1).attr('r', 5);
    }

    function handleMouseClick(d) {
        console.log("Clicked on point with parameter:", d.parameter);
        // Print out all points with the same parameter
        const pointsWithSameParameter = data.filter((datum) => datum.parameter === d.parameter);
        console.log("Points with Parameter", pointsWithSameParameter);
        setOverview([d.parameter, "overview"]);
      }

    // Add labels for the axes and make them clickable
    const xAxisLabel = svg
      .append('text')
      .attr('transform', `translate(${width / 2},${height + margin.top + 10})`)
      .style('text-anchor', 'middle')
      .text('PC1')
      .on('click', () => handleAxisLabelClick('PC1'));

    const yAxisLabel = svg
      .append('text')
      .attr('transform', `translate(${-margin.left + 10},${height / 2}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('PC2')
      .on('click', () => handleAxisLabelClick('PC2'));

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

    const legend = svg.append('g').attr('class', 'legend').attr('transform', `translate(${width - margin.right - 150}, ${margin.top})`).style('display', 'none');

    const legendItems = legend
      .selectAll('.legend-item')
      .data(uniqueParameters)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .on('mouseover', handleLegendMouseOver) // Add mouseover event
      .on('mouseout', handleLegendMouseOut); // Add mouseout event

    function handleLegendMouseOver(event, parameter) {
        circles
            .filter((datum) => datum.parameter === parameter)
            .attr('opacity', 0.7)
            .attr('r', 7);

        circles
            .filter((datum) => datum.parameter !== parameter)
            .attr('opacity', 0);
    }

    function handleLegendMouseOut() {
        circles.attr('opacity', 1).attr('r', 5);
    }


    legendItems
      .append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => colorScale(d))
      .style('opacity', 0) // Start with opacity 0 for animation

      .transition() // Apply a transition for smooth opacity change
      .duration(1000) // Animation duration in milliseconds
      .style('opacity', 1); // End with opacity 1

    legendItems
      .append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .text((d) => d)
      .attr('font-size', '9px')
      .style('opacity', 0) // Start with opacity 0 for animation
      .transition() // Apply a transition for smooth opacity change
      .duration(1000) // Animation duration in milliseconds
      .style('opacity', 1);

    function toggleLegend() {
      const legendDisplay = legend.style('display');
      legend.style('display', legendDisplay === 'none' ? 'block' : 'none');
    }

    const chartTitle = svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .attr('dy', '-1em')
        .style('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Scatter Plot of PC1 and PC2');

    const axisTooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("pointer-events", "none")
    .attr("id", "axis-tooltip");

    let tooltipVisible = false;
    let currentAxis = null;

    function handleAxisLabelClick(axis) {
        console.log(axis);
        // axisTooltip.transition()
        //     .duration(200)
        //     .style("opacity", 0.9);

        if (currentAxis === axis && tooltipVisible) {
            // If the same axis is clicked and the tooltip is visible, hide it
            // axisTooltip.transition()
            //     .duration(500)
            //     .style("opacity", 0);
            setTooltipAxis(null);
            tooltipVisible = false;
        } else {
            // Display the appropriate tooltip
            if (axis === 'PC1') {
                // axisTooltip.html("PC1 is the first principal component")
                //     .style("left", `${width / 2}px`)
                //     .style("top", `${height + margin.top + 10}px`);
                setTooltipAxis('PC1');
            } else {
                // axisTooltip.html("PC2 is the second principal component")
                //     .style("left", `${-margin.left + 10}px`)
                //     .style("top", `${height / 2}px`);
                setTooltipAxis('PC2');
            }

            // Update the state variables
            currentAxis = axis;
            tooltipVisible = true;
        }
        setTimeout(function () {
            setTooltipAxis(null);
        }, 15000);
    }
    };

    console.log("overview", overview);
    return (
        <div>
          <svg ref={svgRef}>
          {tooltipAxis && (
            <Tooltip axis={tooltipAxis} data={tooltipAxis === 'PC1' ? pc1 : pc2} width={window.innerWidth} height={window.innerHeight} margin={0} />
          )}
          </svg>
          {overview && (
            <StarChart parameter={overview[0]} view={overview[1]} />
          )}

        </div>
      );
};

export default ScatterPlot;
