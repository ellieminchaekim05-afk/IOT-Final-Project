import { useEffect, useState } from "react";
import IndexLineChart from "./chart";
import { types } from '~/types';

// define data type
type DataItem = {
  type: number;
  id: number;
  value: number;
};

export function Dashboard() {
  const [data, setData] = useState<null | DataItem[]>([]);
  const [historicalData, setHistoricalData] = useState<{ name: string; data: DataItem[] }[]>([]);
  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch("/api/data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonData = await res.json();
        setData(jsonData);
        setHistoricalData((prev) => [...prev.slice(historicalData.length - 50), { name: new Date().toLocaleTimeString(), data: jsonData }]);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setTimeout(func, 1000);
      }
    };

    func();
  }, []);

  const graphTypes = [0xAB, 0xFF];

  console.log(historicalData);
  return (
    <main className="flex items-center justify-center pt-16 pb-4 w-full">
      <div className="w-full flex flex-col items-center gap-16 min-h-0">

        <h1 className="text-4xl font-bold tracking-tight text-center">
          Sensor Dashboard
        </h1>
        <IndexLineChart historicalData={historicalData} showTypes={graphTypes} />

        <div className="space-y-6 px-4 w-full max-w-[800px]">
          <table className="w-full text-left border-collapse border border border-gray-300">
            <thead>
              <tr>
                <th className="group items-center gap-3 self-stretch p-3 leading-normal border border-gray-300">
                  Sensor ID
                </th>
                <th className="group items-center gap-3 self-stretch p-3 leading-normal border border-gray-300">
                  Sensor Type
                </th>
                <th className="group items-center gap-3 self-stretch p-3 leading-normal border border-gray-300">
                  Value
                </th>
              </tr>
            </thead>
            {data?.map(({ type, id, value }) => (
              types[type] && (
                <tbody key={`${type}-${id}`}>
                  <tr key={id}>
                    <td className="group items-center gap-3 self-stretch p-3 leading-normal border border-gray-300">
                      {id}
                    </td>
                    <td className="group items-center gap-3 self-stretch p-3 leading-normal border border-gray-300">
                      {types[type]}
                    </td>
                    <td className="group items-center gap-3 self-stretch p-3 leading-normal border border-gray-300">
                      {value}
                    </td>
                  </tr>
                </tbody>
              )
            ))}
          </table>
        </div>
      </div>
    </main>
  );
}
