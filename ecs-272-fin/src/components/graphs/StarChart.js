import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { createPortal } from 'react-dom';
import { readCSV } from '../util/CSV-Reader';
import normalizeData from '../util/Normalizer';

let rectangle;
let selectedPolygon = null;

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
    }
    return [];
}

function addListener(svg, data, keyText, className, view) {
    if (view === 'overview') {
        svg.selectAll(className)
            .on("mouseover", function (event, d) {
                rectangle.attr("stroke", "black");
                var key = d3.select(this).attr("data-key");
                var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
                selectedPolygon = polygon.clone(true);
                selectedPolygon.attr("stroke", "black");
                selectedPolygon.attr("pointer-events", "none");
                svg.node().appendChild(selectedPolygon.node());

                var parameter = "Parameter: "+ key.split("-")[0];
                var value = "Value: " + key.split("-")[1];
                var instructions = "Avg. Instructions: " + data[key].Instructions;
                var cycles = "Avg. Cycles: " + data[key].Cycles;
                var ipc = "Avg. IPC: " + data[key].IPC;
                var seconds = "Avg. Seconds: "+ data[key].Seconds;
                var branches = "Avg. Branches: " + data[key].Branches;

                keyText.text("");
                keyText.append("tspan").text(parameter);
                keyText.append("tspan").text(value);
                keyText.append("tspan").text(instructions);
                keyText.append("tspan").text(cycles);
                keyText.append("tspan").text(ipc);
                keyText.append("tspan").text(seconds);
                keyText.append("tspan").text(branches);

                keyText.selectAll("tspan")
                .attr("x", 160)
                .attr("dy", "1.2em");
            })
            .on("mouseout", function (event, d) {
                rectangle.attr("stroke", "transparent");
                keyText.text("");
                selectedPolygon.remove();
                selectedPolygon = null;
            });
    } else if (view === 'overview_Instructions' || view === 'overview_Cycles' || view === 'overview_IPC' || view === 'overview_Seconds' || view === 'overview_Branches') {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            selectedPolygon = polygon.clone(true);
            selectedPolygon.attr("stroke", "black");
            selectedPolygon.attr("pointer-events", "none");
            svg.node().appendChild(selectedPolygon.node());

            var parameter = "Parameter: "+ key.split("-")[0];
            var value = "Value: " + key.split("-")[1];
            var control = "Avg. Control: " + data[key].Control;
            var memory = "Avg. Memory: " + data[key].Memory;
            var execution = "Avg. Execution: " + data[key].Execution;
            var data_dependency = "Avg. Data Dependency: "+ data[key].Data_Dependency;
            var store_intense = "Avg. Store Intense: " + data[key].Store_Intense;

            keyText.text("");
            keyText.append("tspan").text(parameter);
            keyText.append("tspan").text(value);
            keyText.append("tspan").text(control);
            keyText.append("tspan").text(memory);
            keyText.append("tspan").text(execution);
            keyText.append("tspan").text(data_dependency);
            keyText.append("tspan").text(store_intense);

            keyText.selectAll("tspan")
            .attr("x", 160)
            .attr("dy", "1.2em");
        })
        .on("mouseout", function (event, d) {
            rectangle.attr("stroke", "transparent");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });

    }
}

const preProcessAncil1Data = (data) => {
    const transformedData = {};
    data.forEach((d) => {
        const parameter = d.Parameter;
        const value = d.Value;
        const key = `${parameter}-${value}`;
        const transformedItem = {
            Instructions: parseFloat(d["Instructions"]).toFixed(3),
            Cycles: parseFloat(d["Cycles"]).toFixed(3),
            IPC: parseFloat(d["IPC"]).toFixed(3),
            Seconds: parseFloat(d["Seconds"]).toFixed(3),
            Branches: parseFloat(d["Branches"]).toFixed(3),
        };

        for (const prop in transformedItem) {
            if (isNaN(transformedItem[prop])) {
                transformedItem[prop] = 1;
            }
        }

        transformedData[key] = transformedItem;
    });
    return transformedData;
};

const preProcessAncil2Data = (data) => {
    const transformedData = {};
    data.forEach((d) => {
        const parameter = d.Parameter;
        const value = d.Value;
        const key = `${parameter}-${value}`;
        const transformedItem = {
            Store_Intense: parseFloat(d["store_intense"]).toFixed(3),
            Control: parseFloat(d["control"]).toFixed(3),
            Execution: parseFloat(d["execution"]).toFixed(3),
            Memory: parseFloat(d["memory"]).toFixed(3),
            Data_Dependency: parseFloat(d["data_dependency"]).toFixed(3),
        };

        for (const prop in transformedItem) {
            if (isNaN(transformedItem[prop])) {
                transformedItem[prop] = 1;
            }
        }

        transformedData[key] = transformedItem;
    });
    return transformedData;
};

const StarChart = ({ parameter, view, setView }) => {
    console.log("View:", view);
    const [data, setData] = useState([]);
    const [normalizedData, setNormalizedData] = useState([]);

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

    useEffect(() => {
        if (data.length > 0) {
            const normalizedData = normalizeData(data);
            setNormalizedData(normalizedData);
        }
    }, [data]);

    const trimmedData = data.filter(d => d.Parameter === parameter);
    const trimmedNormalizedData = normalizedData.filter(d => d.Parameter === parameter);


    var processedData = null;
    var processedNormalizedData = null;
    if (view === 'overview') {
        processedData = preProcessAncil1Data(trimmedData);
        processedNormalizedData = preProcessAncil1Data(trimmedNormalizedData);
    } else if (view === 'overview_Instructions' || view === 'overview_Cycles' || view === 'overview_IPC' || view === 'overview_Seconds' || view === 'overview_Branches') {
        processedData = preProcessAncil2Data(trimmedData);
        processedNormalizedData = preProcessAncil2Data(trimmedNormalizedData);
    }

    const svgRef = useRef(null);

    useEffect(() => {
        if (processedNormalizedData && processedData) {
          drawChart(processedNormalizedData, processedData);
        }
      }, [processedNormalizedData]);

    const drawChart = (normalizedData, data) => {
        d3.select(svgRef.current).selectAll("*").remove();
        var svgWidth = 900;
        var svgHeight = 600;
        var svg = d3.select(svgRef.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        var centerX = svgWidth / 2 - 75;
        var centerY = svgHeight / 2;
        centerX = Math.round(centerX * 10) / 10;
        centerY = Math.round(centerY * 10) / 10;

        var circleRadius = Math.min(svgWidth, svgHeight) / 3.75;

        var elements = Object.keys(normalizedData);
        var elements = Object.keys(normalizedData)[0] ? Object.keys(normalizedData[Object.keys(normalizedData)[0]]) : "The object is empty or the first value is not an object.";
        var numElements = elements.length;
        var angleOffset = (2 * Math.PI) / numElements;

        var colors = [
            "rgba(0, 128, 0, 0.3)",
            "rgba(255, 0, 0, 0.3)",
            "rgba(0, 0, 255, 0.3)",
            "rgba(255, 255, 0, 0.3)",
            "rgba(0, 255, 255, 0.3)",
            "rgba(255, 0, 255, 0.3)",
            "rgba(192, 192, 192, 0.3)",
            "rgba(128, 128, 0, 0.3)",
            "rgba(128, 0, 128, 0.3)",
            "rgba(0, 128, 128, 0.3)",
            "rgba(128, 128, 128, 0.3)",
            "rgba(255, 165, 0, 0.3)",
            "rgba(255, 192, 203, 0.3)",
            "rgba(255, 228, 225, 0.3)",
            "rgba(255, 255, 224, 0.3)",
            "rgba(51, 161, 201, 0.3)",
            "rgba(0, 138, 184, 0.3)",
            "rgba(0, 110, 145, 0.3)",
            "rgba(0, 82, 109, 0.3)",
            "rgba(0, 55, 73, 0.3)"
        ];

        svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", circleRadius)
            .attr("stroke", "black")
            .attr("fill", "none");

        for (var i = 0; i < numElements; i++) {
            var angle = i * angleOffset;
            var x1 = centerX;
            var y1 = centerY;
            var x2 = centerX + circleRadius * Math.cos(angle);
            var y2 = centerY + circleRadius * Math.sin(angle);
            x2 = Math.round(x2 * 10) / 10;
            y2 = Math.round(y2 * 10) / 10;

            svg.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("stroke", "gray");

            svg.append("text")
            .attr("x", x2)
            .attr("y", y2)
            .attr("dx", x2 == centerX ? 20 : (x2 > centerX ? 10 : -10))
            .attr("dy", y2 == centerY ? 10 : (y2 < centerY ? -10 : 20))
            .text(function () {
                return elements[i].split("_").map(function (word) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(" ");
            })
            .attr("text-anchor", x2 > centerX ? "start" : "end")
            .attr("alignment-baseline", "middle")
            .attr("fill", "black")
            .style("cursor", "pointer")
            .on("click", function (event) {
                var clickedElement = d3.select(this).text();
                setView(view+"_"+clickedElement);
            });

            var colorIndex = 0;

            rectangle = svg.append("rect")
                .attr("x", 0)
                .attr("y", 40)
                .attr("width", 170)
                .attr("height", 120)
                .attr("fill", "transparent")
                .attr("stroke", "transparent")
                .attr("rx", 10)
            var keyText = svg.append("text")
                .attr("x", 100)
                .attr("y", 40)
                .text("")
                .attr("text-anchor", "end")
                .attr("font-size", "10px");

            for (var key in normalizedData) {
                if (normalizedData.hasOwnProperty(key)) {
                    var elementData = normalizedData[key];
                    var elementValues = Object.values(elementData);

                    var numElements = elementValues.length;
                    var angleOffset = (2 * Math.PI) / numElements;

                    var labelRadius = circleRadius;
                    var elementPositions = [];

                    for (var j = 0; j < numElements; j++) {
                        var angle = j * angleOffset;
                        var x = centerX + labelRadius * Math.cos(angle);
                        var y = centerY + labelRadius * Math.sin(angle);
                        x = Math.round(x * 10) / 10;
                        y = Math.round(y * 10) / 10;
                        elementPositions.push({ x: x, y: y });
                    }

                    // Map the values to the range [0, 100] a scaling factor
                    var normalizedValues = elementValues.map(function (value, index) {
                        var scalingFactor = 100;
                        var normalizedValue = Math.log(value * scalingFactor + 1) / Math.log(scalingFactor + 1) * 100;
                        return normalizedValue;
                    });

                    var polygonVertices = elementPositions.map(function (pos, i) {
                        var scaledValue = (normalizedValues[i] / 100) * 100;
                        return [
                            centerX + (circleRadius * scaledValue / 100) * Math.cos(i * angleOffset),
                            centerY + (circleRadius * scaledValue / 100) * Math.sin(i * angleOffset)
                        ];
                    });

                    // Convert the array of points to a string
                    var polygonPoints = polygonVertices.map(function (point) {
                        return point.join(",");
                    }).join(" ");

                    var elementColor = colors[colorIndex % colors.length];
                    colorIndex++;

                    // Append the filled polygon
                    svg.append("polygon")
                        .attr("points", polygonPoints)
                        .attr("fill", elementColor)
                        .attr("stroke", elementColor)
                        .attr("class", "polygon")
                        .attr("data-key", key);
                }
            }

            var legendX = svgWidth - 150;
            var legendY = 50;
            var legendSpacing = 25;

            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + legendX + "," + legendY + ")");

            var legendTitle = legend.append("text")
                .attr("x", 0)
                .attr("y", -10)
                .text("Values")
                .attr("text-anchor", "start");

            var legendLabels = legend.selectAll("g")
                .data(Object.keys(normalizedData))
                .enter().append("g")
                .attr("class", "legend-label")
                .attr("data-key", function (d) {
                    return d;
                })
                .attr("transform", function (d, i) {
                    return "translate(0," + i * legendSpacing + ")";
                })
                .attr("font-size", "12px")

            legendLabels.append("rect")
                .attr("x", 0)
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", function (d, i) {
                    return colors[i % colors.length];
                });

            legendLabels.append("text")
                .attr("x", 30)
                .attr("y", 10)
                .attr("dy", "0.35em")
                .text(function (d) {
                    return d.split("-")[1];
                })
                .attr("fill", "black");

            svg.append("text")
                .attr("x", svgWidth / 3)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .attr("font-size", "18px")
                .text(parameter);

            addListener(svg, data, keyText, ".polygon", view);
            addListener(svg, data, keyText, ".legend-label", view);
        }
    }

    return (
        <div>
            {svgRef && (
                <svg ref={svgRef} />
            )}
        </div>
    );
}

export default StarChart;