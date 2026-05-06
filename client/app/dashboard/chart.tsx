import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

export default function IndexLineChart({ historicalData, showTypes }: { historicalData: { name: string; data: { type: number; id: number; value: number }[] }[], showTypes: number[] }) {
    const dataHistory = {} as Record<string, { name: string; value: number }[]>;
    historicalData.forEach(({ name, data }) => {
        data.forEach(({ type, id, value }) => {
            if (showTypes.includes(type)) {
                const key = `${id} ${type}`;
                if (!dataHistory[key]) {
                    dataHistory[key] = [];
                }
                dataHistory[key].push({ name, value });
            }
        });
    });

    return (
        <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={historicalData.map(({ name, data }) => {
            const entry: Record<string, any> = { name };
            data.forEach(({ id, value }) => {
                entry[id] = value;
            });
            return entry;
        })}>
            <CartesianGrid stroke="whitesmoke" strokeDasharray="5 5" />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis width="auto" stroke="white" />
            {
                Object.entries(dataHistory).map(([key, data]) => (
                    <Line key={key} type="monotone" dataKey="value" data={data} name={key} stroke={`hsl(${parseInt(key) * 30}, 70%, 50%)`} />
                ))
            }
            <RechartsDevtools />
        </LineChart>
    );
}
