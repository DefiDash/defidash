import React from "react";

interface Column {
  name: string;
  type: string;
  data: (string | number)[];
}

const Table: React.FC<{ data: Column[] }> = ({ data }) => {
  return (
    <div className="overflow-x-auto text-black">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {data.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left border-b">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              {data.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-b">
                  {column.data[rowIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
