import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { types } from '~/types';

export default function IndexLineChart({ historicalData, showTypes }: { historicalData: { name: string; data: { type: number; id: number; value: number }[] }[], showTypes: number[] }) {
    const keys = new Set<string>();
    historicalData.forEach(({ data }) => {
        data.forEach(({ type, id }) => {
            if (showTypes.includes(type)) {
                keys.add(`${types[type]} (${id})`);
            }
        });
    });

    return (
        <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={historicalData.map(({ name, data }) => {
            const entry: Record<string, any> = { name };
            data.forEach(({ type, id, value }) => {
                if (showTypes.includes(type)) {
                    const key = `${types[type]} (${id})`;
                    entry[key] = value; // Match the naming convention in the Set
                }
            });
            return entry;
        })}>

            <CartesianGrid stroke="whitesmoke" strokeDasharray="5 5" />
            <Legend layout="horizontal" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis width="auto" stroke="white" tickCount={10} tickFormatter={(value) => `${value}`} domain={[0, 100]} />

            {Array.from(keys).map((lineKey) => {
                const idMatch = lineKey.match(/\((\d+)\)/);
                const colorId = idMatch ? parseInt(idMatch[1]) : 0;

                return (
                    <Line
                        key={lineKey}
                        type="monotone"
                        dataKey={lineKey} // This now matches entry[key]
                        name={lineKey}
                        stroke={`hsl(${colorId * 30}, 70%, 50%)`}
                    />
                );
            })}

            {/* <RechartsDevtools /> */}
        </LineChart>
    );
}
