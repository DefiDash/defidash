import { useMemo } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

type BarplotProps = {
  width?: number;
  height?: number;
  data: { name: string; categories: { label: string; value: number }[] }[];
};

export const Barplot = ({ width = 550, height = 330, data }: BarplotProps) => {
  // bounds = area inside the graph axis = calculated by subtracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Extract all category labels and groups
  const groups = data.map((d) => d.name);
  const allCategories = Array.from(
    new Set(data.flatMap((d) => d.categories.map((cat) => cat.label)))
  );

  // X scale for the groups
  const x0Scale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, boundsWidth])
      .padding(BAR_PADDING);
  }, [data, width]);

  // X scale for the sub-groups (categories)
  const x1Scale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(allCategories)
      .range([0, x0Scale.bandwidth()])
      .padding(0.05);
  }, [data, width]);

  // Y scale for values
  const yScale = useMemo(() => {
    const max =
      d3.max(data.flatMap((d) => d.categories.map((cat) => cat.value))) || 10;
    return d3.scaleLinear().domain([0, max]).range([boundsHeight, 0]);
  }, [data, height]);

  // Color scale for different categories
  const colorScale = useMemo(() => {
    return d3.scaleOrdinal(d3.schemeCategory10).domain(allCategories);
  }, [allCategories]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const x0 = x0Scale(d.name);
    return (
      <g key={i} transform={`translate(${x0},0)`}>
        {d.categories.map((cat, j) => {
          const x1 = x1Scale(cat.label);
          return (
            <g key={j}>
              <rect
                x={x1}
                y={yScale(cat.value)}
                width={x1Scale.bandwidth()}
                height={boundsHeight - yScale(cat.value)}
                fill={colorScale(cat.label)} // Apply color from the color scale
                opacity={0.7}
                stroke={colorScale(cat.label)}
                strokeWidth={1}
                rx={1}
              />
              <text
                x={x1 !== undefined ? x1 + x1Scale.bandwidth() / 2 : 0}
                y={yScale(cat.value) - 7}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={12}
                opacity={0}
              >
                {cat.value}
              </text>
            </g>
          );
        })}
      </g>
    );
  });

  // Grid lines for the y-axis
  const grid = yScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={0}
          x2={boundsWidth}
          y1={yScale(value)}
          y2={yScale(value)}
          stroke="#808080"
          opacity={0.2}
        />
        <text
          x={-10}
          y={yScale(value)}
          textAnchor="end"
          alignmentBaseline="middle"
          fontSize={9}
          stroke="#808080"
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};
