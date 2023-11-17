import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import normalizeData from '../util/Normalizer';
import getCorrectData from '../util/StarData';
import { Button } from 'react-bootstrap';
import {preProcessAncil1Data, preProcessAncil2Data, preProcessAncil3Data} from '../util/StarDataPreprocess';
import microbenchMeaning from '../util/MicrobenchMeaning';

let rectangle;
let selectedPolygon = null;

function addListener(svg, data, keyText, className, view) {
    if (view === 'overview') {
        svg.selectAll(className)
            .on("mouseover", function (event, d) {
                rectangle.attr("stroke", "black");
                var key = d3.select(this).attr("data-key");
                var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
                svg.selectAll(".polygon:not([data-key='" + key + "'])")
                .style("display", "none");
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
                // keyText.append("tspan").text(parameter);
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
                svg.selectAll(".polygon")
                .style("display", "block");
                keyText.text("");
                selectedPolygon.remove();
                selectedPolygon = null;
            });
    } else if (view === 'overview-Instructions' || view === 'overview-Cycles' || view === 'overview-IPC' || view === 'overview-Seconds' || view === 'overview-Branches') {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            svg.selectAll(".polygon:not([data-key='" + key + "'])")
            .style("display", "none");
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
            // keyText.append("tspan").text(parameter);
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
            svg.selectAll(".polygon")
            .style("display", "block");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });

    } else if (view.includes("Store_Intense")) {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            svg.selectAll(".polygon:not([data-key='" + key + "'])")
            .style("display", "none");
            selectedPolygon = polygon.clone(true);
            selectedPolygon.attr("stroke", "black");
            selectedPolygon.attr("pointer-events", "none");
            svg.node().appendChild(selectedPolygon.node());

            var parameter = "Parameter: "+ key.split("-")[0];
            var value = "Value: " + key.split("-")[1];
            var stl2 = "STL2: " + data[key].STL2;
            var stc = "STc: " + data[key].STc;

            keyText.text("");
            // keyText.append("tspan").text(parameter);
            keyText.append("tspan").text(value);
            keyText.append("tspan").text(stl2);
            keyText.append("tspan").text(stc);

            keyText.selectAll("tspan")
            .attr("x", 160)
            .attr("dy", "1.2em");
        })
        .on("mouseout", function (event, d) {
            rectangle.attr("stroke", "transparent");
            svg.selectAll(".polygon")
            .style("display", "block");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });
    } else if (view.includes("Control")) {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            svg.selectAll(".polygon:not([data-key='" + key + "'])")
            .style("display", "none");
            selectedPolygon = polygon.clone(true);
            selectedPolygon.attr("stroke", "black");
            selectedPolygon.attr("pointer-events", "none");
            svg.node().appendChild(selectedPolygon.node());

            var parameter = "Parameter: "+ key.split("-")[0];
            var value = "Value: " + key.split("-")[1];
            var cs1 = "CS1: " + data[key].CS1;
            var crf = "CRf: " + data[key].CRf;
            var ccm = "CCm: " + data[key].CCm;
            var cca = "CCa: " + data[key].CCa;
            var cce = "CCe: " + data[key].CCe;
            var cch = "CCh: " + data[key].CCh;
            var cs3 = "CS3: " + data[key].CS3;
            var crd = "CRd: " + data[key].CRd;
            var cci = "CCI: " + data[key].CCI;

            keyText.text("");
            // keyText.append("tspan").text(parameter);
            keyText.append("tspan").text(value);
            keyText.append("tspan").text(cs1);
            keyText.append("tspan").text(crf);
            keyText.append("tspan").text(ccm);
            keyText.append("tspan").text(cca);
            keyText.append("tspan").text(cce);
            keyText.append("tspan").text(cch);
            keyText.append("tspan").text(cs3);
            keyText.append("tspan").text(crd);
            keyText.append("tspan").text(cci);

            keyText.selectAll("tspan")
            .attr("x", 160)
            .attr("dy", "1.2em");
        })
        .on("mouseout", function (event, d) {
            rectangle.attr("stroke", "transparent");
            svg.selectAll(".polygon")
            .style("display", "block");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });
    } else if (view.includes("Memory")) {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            svg.selectAll(".polygon:not([data-key='" + key + "'])")
            .style("display", "none");
            selectedPolygon = polygon.clone(true);
            selectedPolygon.attr("stroke", "black");
            selectedPolygon.attr("pointer-events", "none");
            svg.node().appendChild(selectedPolygon.node());

            var parameter = "Parameter: "+ key.split("-")[0];
            var value = "Value: " + key.split("-")[1];
            var ml2 = "ML2: " + data[key].ML2;
            var mc = "MC: " + data[key].MC;
            var mim2 = "MIM2: " + data[key].MIM2;
            var m = "M: " + data[key].M;
            var mi = "MI: " + data[key].MI;
            var mim = "MIM: " + data[key].MIM;
            var mcs = "MCS: " + data[key].MCS;
            var md = "MD: " + data[key].MD;
            var mip = "MIP: " + data[key].MIP;

            keyText.text("");
            // keyText.append("tspan").text(parameter);
            keyText.append("tspan").text(value);
            keyText.append("tspan").text(ml2);
            keyText.append("tspan").text(mc);
            keyText.append("tspan").text(mim2);
            keyText.append("tspan").text(m);
            keyText.append("tspan").text(mi);
            keyText.append("tspan").text(mim);
            keyText.append("tspan").text(mcs);
            keyText.append("tspan").text(md);
            keyText.append("tspan").text(mip);

            keyText.selectAll("tspan")
            .attr("x", 160)
            .attr("dy", "1.2em");
        })
        .on("mouseout", function (event, d) {
            rectangle.attr("stroke", "transparent");
            svg.selectAll(".polygon")
            .style("display", "block");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });
    } else if (view.includes("Execution")) {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            svg.selectAll(".polygon:not([data-key='" + key + "'])")
            .style("display", "none");
            selectedPolygon = polygon.clone(true);
            selectedPolygon.attr("stroke", "black");
            selectedPolygon.attr("pointer-events", "none");
            svg.node().appendChild(selectedPolygon.node());

            var parameter = "Parameter: "+ key.split("-")[0];
            var value = "Value: " + key.split("-")[1];
            var em5 = "EM5: " + data[key].EM5;
            var em1 = "EM1: " + data[key].EM1;
            var ei = "EI: " + data[key].EI;
            var ed1 = "ED1: " + data[key].ED1;

            keyText.text("");
            // keyText.append("tspan").text(parameter);
            keyText.append("tspan").text(value);
            keyText.append("tspan").text(em5);
            keyText.append("tspan").text(em1);
            keyText.append("tspan").text(ei);
            keyText.append("tspan").text(ed1);

            keyText.selectAll("tspan")
            .attr("x", 160)
            .attr("dy", "1.2em");
        })
        .on("mouseout", function (event, d) {
            rectangle.attr("stroke", "transparent");
            svg.selectAll(".polygon")
            .style("display", "block");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });
    } else if (view.includes("Data_Dependency")) {
        svg.selectAll(className)
        .on("mouseover", function (event, d) {
            rectangle.attr("stroke", "black");
            var key = d3.select(this).attr("data-key");
            var polygon = svg.selectAll(".polygon[data-key='" + key + "']");
            svg.selectAll(".polygon:not([data-key='" + key + "'])")
            .style("display", "none");
            selectedPolygon = polygon.clone(true);
            selectedPolygon.attr("stroke", "black");
            selectedPolygon.attr("pointer-events", "none");
            svg.node().appendChild(selectedPolygon.node());

            var parameter = "Parameter: "+ key.split("-")[0];
            var value = "Value: " + key.split("-")[1];
            var dpt = "DPT: " + data[key].DPT;
            var dptd = "DPTd: " + data[key].DPTd;
            var dpcvt = "DPCVt: " + data[key].DPCVt;
            var dp1f = "DP1f: " + data[key].DP1f;
            var dp1d = "DP1d: " + data[key].DP1d;

            keyText.text("");
            // keyText.append("tspan").text(parameter);
            keyText.append("tspan").text(value);
            keyText.append("tspan").text(dpt);
            keyText.append("tspan").text(dptd);
            keyText.append("tspan").text(dpcvt);
            keyText.append("tspan").text(dp1f);
            keyText.append("tspan").text(dp1d);

            keyText.selectAll("tspan")
            .attr("x", 160)
            .attr("dy", "1.2em");
        })
        .on("mouseout", function (event, d) {
            rectangle.attr("stroke", "transparent");
            svg.selectAll(".polygon")
            .style("display", "block");
            keyText.text("");
            selectedPolygon.remove();
            selectedPolygon = null;
        });
    }
}

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

    const goBack = () => {
        const views = view.split("-");
        if (views.length > 1) {
            // Remove the last element to go back
            views.pop();
            const newView = views.join("-");
            setView(newView);
        }
    };

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
    } else if (view === 'overview-Instructions' || view === 'overview-Cycles' || view === 'overview-IPC' || view === 'overview-Seconds' || view === 'overview-Branches') {
        processedData = preProcessAncil2Data(trimmedData);
        processedNormalizedData = preProcessAncil2Data(trimmedNormalizedData);
    } else if (view.includes('Control')|| view.includes('Memory') || view.includes('Execution') || view.includes('Data_Dependency') || view.includes('Store_Intense')) {
        processedData = preProcessAncil3Data(trimmedData,view);
        processedNormalizedData = preProcessAncil3Data(trimmedNormalizedData,view);
    }

    const svgRef = useRef(null);

    const handleResize = () => {
        if (processedNormalizedData && processedData) {
            drawChart(processedNormalizedData, processedData);
        }
    };

    useEffect(() => {
        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [processedNormalizedData, processedData]);


    useEffect(() => {
        if (processedNormalizedData && processedData) {
          drawChart(processedNormalizedData, processedData);
        }
      }, [processedNormalizedData]);

    const drawChart = (normalizedData, data) => {
        d3.select(svgRef.current).selectAll("*").remove();
        var svgWidth = window.innerWidth/(4/1);
        var svgHeight = window.innerHeight/(4/3);
        var svg = d3.select(svgRef.current)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        var centerX = svgWidth / 2;
        var centerY = svgHeight / 2;
        centerX = Math.round(centerX * 10) / 10;
        centerY = Math.round(centerY * 10) / 10;

        var circleRadius = Math.min(svgWidth, svgHeight) / 3.75;

        var elements = Object.keys(normalizedData);
        var elements = Object.keys(normalizedData)[0] ? Object.keys(normalizedData[Object.keys(normalizedData)[0]]) : "The object is empty or the first value is not an object.";
        var numElements = elements.length;
        var angleOffset = (2 * Math.PI) / numElements;

        var colors = [
            "rgba(0, 128, 0, 0.1)",
            "rgba(255, 0, 0, 0.1)",
            "rgba(0, 0, 255, 0.1)",
            "rgba(255, 255, 0, 0.1)",
            "rgba(0, 255, 255, 0.1)",
            "rgba(255, 0, 255, 0.1)",
            "rgba(192, 192, 192, 0.1)",
            "rgba(128, 128, 0, 0.1)",
            "rgba(128, 0, 128, 0.1)",
            "rgba(0, 128, 128, 0.1)",
            "rgba(128, 128, 128, 0.1)",
            "rgba(255, 165, 0, 0.1)",
            "rgba(255, 192, 203, 0.1)",
            "rgba(255, 228, 225, 0.1)",
            "rgba(255, 255, 224, 0.1)",
            "rgba(51, 161, 201, 0.1)",
            "rgba(0, 138, 184, 0.1)",
            "rgba(0, 110, 145, 0.1)",
            "rgba(0, 82, 109, 0.1)",
            "rgba(0, 55, 73, 0.1)"
        ];

        svg.append("circle")
            .attr("cx", centerX)
            .attr("cy", centerY)
            .attr("r", circleRadius)
            .attr("stroke", "black")
            .attr("fill", "none");

        var microbenchTooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "10px")
            .style("box-shadow", "2px 2px 6px rgba(0, 0, 0, 0.1)");

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
                .attr("stroke", "gray")
                .transition()
                .duration(500);

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
                    clickedElement = clickedElement.split(" ").join("_");
                    setView(view + "-" + clickedElement);
                })
                .style("opacity", 0)
                .on("mouseover", function () {
                    var label = d3.select(this).text();
                    label = label.split(" ").join("_").toLowerCase();

                    if (microbenchMeaning[label]) {
                        microbenchTooltip.transition()
                            .duration(200)
                            .style("opacity", .9);

                        microbenchTooltip.html(microbenchMeaning[label])
                            .style("left", `${svgWidth*3}px`)
                            .style("top", `${svgHeight+70}px`);
                    }
                })
                .on("mouseout", function () {
                    microbenchTooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                })
                .transition()
                .duration(500)
                .style("opacity", 1);


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
            var legendY = svgHeight - 150;
            var legendSpacing = 25;
            var maxLegendItemsPerColumn = 4;
            var columnWidth = 100;

            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + legendX + "," + legendY + ")");

            var legendData = Object.keys(normalizedData);
            var numColumns = Math.ceil(legendData.length / maxLegendItemsPerColumn);

            var totalLegendWidth = columnWidth * numColumns;

            var legendTitle = legend.append("text")
                .attr("x", totalLegendWidth / 2 - columnWidth / 4) // Adjusted x-coordinate
                .attr("y", -10)
                .text("Values")
                .attr("text-anchor", "middle");

            var legendLabels = legend.selectAll("g")
                .data(legendData)
                .enter().append("g")
                .attr("class", "legend-label")
                .attr("data-key", function (d) {
                    return d;
                })
                .attr("transform", function (d, i) {
                    var col = Math.floor(i / maxLegendItemsPerColumn);
                    var row = i % maxLegendItemsPerColumn;
                    return "translate(" + col * columnWidth + "," + row * legendSpacing + ")";
                })
                .attr("font-size", "12px");

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
            <Button variant="primary" onClick={goBack}>Back</Button>
            {svgRef && (
                <svg ref={svgRef} />
            )}
        </div>
    );
}

export default StarChart;