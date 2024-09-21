import React from "react";

interface DataItem {
  free_claim: string;
  early_access: string;
  public: string;
  total: string;
  diamond_pass: string;
}

interface TableProps {
  data: DataItem[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th className="px-6 py-3 border-b-2 border-gray-200">Free Claim</th>
            <th className="px-6 py-3 border-b-2 border-gray-200">
              Early Access
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200">Public</th>
            <th className="px-6 py-3 border-b-2 border-gray-200">Total</th>
            <th className="px-6 py-3 border-b-2 border-gray-200">
              Diamond Pass
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition-colors duration-200`}
            >
              <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                {item.free_claim}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                {item.early_access}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                {item.public}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                {item.total}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                {item.diamond_pass}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
