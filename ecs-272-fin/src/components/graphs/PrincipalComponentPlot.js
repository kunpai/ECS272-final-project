import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { createPortal } from 'react-dom';

const BarChart = ({ data }) => {
  const ref = useRef();
  const margin = { top: 20, right: 30, bottom: 70, left: 90 },
    width = window.innerWidth/(8/3) - margin.left - margin.right,
    height = window.innerHeight/(8/3) - margin.top - margin.bottom;

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.feature))
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => Math.min(0, d.component)), d3.max(data, d => Math.max(0, d.component))])
      .range([height, 0]);

    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.feature))
      .attr("y", d => (d.component >= 0) ? y(d.component) : y(0))
      .attr("width", x.bandwidth())
      .attr("height", d => Math.abs(y(0) - y(d.component)))
      .attr("fill", "#69b3a2")
      .transition()
      .duration(500)
      .attr("y", d => (d.component >= 0) ? y(d.component) : y(0));

    svg.append("g")
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-8,0)rotate(-30)")
      .style("text-anchor", "end")
      .text(d => {
        const [prefix, suffix] = d.split('_');
        return `${suffix.charAt(0).toUpperCase()}${suffix.slice(1)}`;
      })
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .attr("opacity", 1);

    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .attr("opacity", 1);

    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .style("text-anchor", "middle")
      .text("Stat")
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .attr("opacity", 1);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Weight")
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .attr("opacity", 1);
  }, [data, height, margin.left, margin.top, width]);


  return <svg ref={ref}></svg>;
};

const Tooltip = ({ axis, data }) => {
  const tooltipRootId = 'tooltip-root';
  let tooltipRoot = document.getElementById(tooltipRootId);

  if (!tooltipRoot) {
    tooltipRoot = document.createElement('div');
    tooltipRoot.id = tooltipRootId;
    document.body.appendChild(tooltipRoot);
  }

  const tooltipStyle = {
    position: 'absolute',
    padding: '20px',
  };

  useEffect(() => {
    return () => {
      if (tooltipRoot) {
        document.body.removeChild(tooltipRoot);
      }
    };
  }, [tooltipRoot]);

  return createPortal(
    <div style={tooltipStyle}>
      {axis === 'PC1' && (
        <div>
          <p>PC1 is the first principal component</p>
          <BarChart data={data} />
        </div>
      )}
      {axis === 'PC2' && (
        <div>
          <p>PC2 is the second principal component</p>
          <BarChart data={data} />
        </div>
      )}
    </div>,
    tooltipRoot
  );
};

export default Tooltip;