import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  name: string;
  label: string[];
  value: number[];
}

interface LineGraphProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  width = 928,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Prepare and format data based on label (x-axis) and value (y-axis)
    const parsedData = data
      .map((d) => {
        return d.label.map((label, index) => ({
          name: d.name,
          label,
          value: d.value[index],
        }));
      })
      .flat(); // Flatten the array of arrays

    // Set up x and y scales
    const x = d3
      .scalePoint()
      .domain(parsedData.map((d) => d.label))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.value) as number])
      .nice()
      .range([height - marginBottom, marginTop]);

    // Line generator function
    const line = d3
      .line<{ label: string; value: number }>()
      .x((d) => x(d.label)!)
      .y((d) => y(d.value));

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr(
        "style",
        "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;"
      );

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Value")
      );

    // Color scale for different categories
    const categories = Array.from(new Set(parsedData.map((d) => d.name)));
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

    // Group the data by name
    const grouped = d3.group(parsedData, (d) => d.name);

    // Draw the lines
    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(grouped)
      .join("path")
      .attr("stroke", ([key]) => color(key))
      .attr("d", ([, values]) => line(values));

    // Dot for hover interaction
    const dot = svg.append("g").attr("display", "none");

    dot.append("circle").attr("r", 2.5);
    dot.append("text").attr("text-anchor", "middle").attr("y", -8);

    function pointermoved(event: any) {
      const [xm, ym] = d3.pointer(event);
      const label = x
        .domain()
        .reduce((a, b) =>
          Math.abs(x(a)! - xm) < Math.abs(x(b)! - xm) ? a : b
        );
      const nearest = parsedData.reduce((a, b) =>
        Math.abs(x(a.label)! - xm) < Math.abs(x(b.label)! - xm) ? a : b
      );

      dot.attr(
        "transform",
        `translate(${x(nearest.label)},${y(nearest.value)})`
      );
      dot.select("text").text(nearest.value);
    }

    svg
      .on("pointerenter", () => dot.attr("display", null))
      .on("pointermove", pointermoved)
      .on("pointerleave", () => dot.attr("display", "none"));
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default LineGraph;
