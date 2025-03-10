import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatResourceData, formatTime } from "@/lib/utils";
import { ResourceMetrics } from "@/types/data";

export default function ResourceCharts({ data }: { data: ResourceMetrics }) {
    if (!data) return <div>No resource data available</div>;

    const cpuData = formatResourceData(data.cpu.data);
    const ramData = formatResourceData(data.ram.data);

    return (
        <Tabs defaultValue="cpu" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
                <TabsTrigger value="ram">Memory Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="cpu">
                <Card>
                    <CardHeader>
                        <CardTitle>CPU Usage</CardTitle>
                        <CardDescription>
                            Percentage of CPU utilization over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={cpuData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 25,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={formatTime}
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                />
                                <YAxis domain={[0, "auto"]} />
                                <Tooltip
                                    labelFormatter={formatTime}
                                    formatter={(value: number, name) => {
                                        // Add appropriate unit

                                        return [`${value.toFixed(2)}%`, name];
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="user"
                                    stroke="#0088FE"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="User"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="system"
                                    stroke="#FF8042"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="System"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="Total"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="ram">
                <Card>
                    <CardHeader>
                        <CardTitle>Memory Usage</CardTitle>
                        <CardDescription>
                            RAM utilization in MB over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={ramData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 25,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={formatTime}
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={formatTime}
                                    formatter={(value: number, name) => {
                                        return [`${value.toFixed(2)} MB`, name];
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#00C49F"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="Used Memory"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
