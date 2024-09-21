import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const mockChartData = {
    charts: [
      {
        type: "line",
        data: [
          {
            name: "Bitcoin",
            label: ["Jan 2024", "Feb 2024", "Mar 2024"],
            value: [1000, 1500, 2100],
          },
        ],
      },
      {
        type: "line",
        data: [
          {
            name: "Bitcoin",
            label: ["Jan 2024", "Feb 2024", "Mar 2024"],
            value: [1000, 1500, 2100],
          },
          {
            name: "Ethereum",
            label: ["Jan 2024", "Feb 2024", "Mar 2024"],
            value: [100, 150, 210],
          },
        ],
      },
      {
        type: "bar",
        data: [
          {
            name: "Group 1",
            categories: [{ label: "Category A", value: 30 }],
          },
          {
            name: "Group 2",
            categories: [{ label: "Category A", value: 50 }],
          },
          {
            name: "Group 3",
            categories: [
              { label: "Category A", value: 20 },
              { label: "Category B", value: 80 },
            ],
          },
        ],
      },
      {
        type: "scatter",
        data: [
          {
            subGroup: "Afghanistan",
            group: "Asia",
            y: 43.828,
            size: 31889923,
            x: 974.5803384,
          },
          {
            subGroup: "Albania",
            group: "Europe",
            y: 76.423,
            size: 3600523,
            x: 5937.029526,
          },
          {
            subGroup: "Algeria",
            group: "Africa",
            y: 72.301,
            size: 33333216,
            x: 6223.367465,
          },
        ],
      },
      {
        type: "donut",
        data: {
          label: ["A", "B", "C"],
          value: [10, 20, 30],
        },
      },
      {
        type: "radar",
        data: {
          speed: 5.1,
          acceleration: 9.5,
          conso: 1.4,
          safety: 0.1,
          style: 90,
          price: 7,
          name: "mercedes",
        },
      },
      {
        type: "heatmap",
        data: [
          { x: "A", y: "A", value: 3.14 },
          { x: "A", y: "B", value: 22.87 },
          { x: "A", y: "C", value: 10.55 },
          { x: "A", y: "D", value: 18.77 },
          { x: "A", y: "E", value: 7.46 },
          { x: "B", y: "A", value: 28.3 },
          { x: "B", y: "B", value: 11.98 },
          { x: "B", y: "C", value: 16.58 },
          { x: "B", y: "D", value: 4.29 },
          { x: "B", y: "E", value: 21.9 },
          { x: "C", y: "A", value: 15.15 },
          { x: "C", y: "B", value: 29.12 },
          { x: "C", y: "C", value: 37.02 },
          { x: "C", y: "D", value: 24.68 },
          { x: "C", y: "E", value: 30.01 },
          { x: "D", y: "A", value: 12.9 },
          { x: "D", y: "B", value: 5.48 },
          { x: "D", y: "C", value: 20.4 },
          { x: "D", y: "D", value: 17.99 },
          { x: "D", y: "E", value: 2.54 },
          { x: "E", y: "A", value: 9.32 },
          { x: "E", y: "B", value: 15.77 },
          { x: "E", y: "C", value: 28.06 },
          { x: "E", y: "D", value: 26.43 },
          { x: "E", y: "E", value: 11.11 },
          { x: "F", y: "A", value: 1.9 },
          { x: "F", y: "B", value: 27.99 },
          { x: "F", y: "C", value: 14.34 },
          { x: "F", y: "D", value: 3.88 },
          { x: "F", y: "E", value: 19.46 },
          { x: "G", y: "A", value: 20.76 },
          { x: "G", y: "B", value: 4.67 },
          { x: "G", y: "C", value: 11.12 },
          { x: "G", y: "D", value: 30.84 },
          { x: "G", y: "E", value: 24.75 },
          { x: "H", y: "A", value: 17.02 },
          { x: "H", y: "B", value: 7.15 },
          { x: "H", y: "C", value: 29.65 },
          { x: "H", y: "D", value: 8.78 },
          { x: "H", y: "E", value: 12.11 },
          { x: "I", y: "A", value: 16.33 },
          { x: "I", y: "B", value: 25.12 },
          { x: "I", y: "C", value: 21.4 },
          { x: "I", y: "D", value: 18.94 },
          { x: "I", y: "E", value: 3.59 },
          { x: "J", y: "A", value: 29.44 },
          { x: "J", y: "B", value: 13.17 },
          { x: "J", y: "C", value: 9.54 },
          { x: "J", y: "D", value: 6.76 },
          { x: "J", y: "E", value: 25.28 },
        ],
      },
      {
        type: "bubble",
        data: [
          {
            country: "Afghanistan",
            continent: "Asia",
            lifeExp: 43.828,
            pop: 31889923,
            gdpPercap: 974.5803384,
          },
          {
            country: "Albania",
            continent: "Europe",
            lifeExp: 76.423,
            pop: 3600523,
            gdpPercap: 5937.029526,
          },
          {
            country: "Algeria",
            continent: "Africa",
            lifeExp: 72.301,
            pop: 33333216,
            gdpPercap: 6223.367465,
          },
        ],
      },
      {
        type: "table",
        data: [
          {
            free_claim: "1701",
            early_access: "535",
            public: "373",
            total: "2359",
            diamond_pass: "889",
          },
          {
            free_claim: "1701",
            early_access: "535",
            public: "373",
            total: "2359",
            diamond_pass: "889",
          },
        ],
      },
    ],
  };

  const mockStringData = "This is a string of data";

  return NextResponse.json(mockChartData);
}
