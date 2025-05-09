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
import { Results } from "@/types/data";

export default function ResourceCharts({ data }: { data: Results }) {
    if (!data) return <div>No resource data available</div>;

    // Extract metrics from Prometheus formatted data
    const cpuData = formatResourceData(data.metrics.resource.cpu);
    const ramData = formatResourceData(data.metrics.resource.ram);

    return (
        <Tabs defaultValue="cpu" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Summary (Avg.)</CardTitle>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold">CPU Usage</h2>
                    <p>{data.summary.resource.cpu_usage.toFixed(2)}%</p>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Memory Usage</h2>
                    <p>{(data.summary.resource.ram_usage / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
                <TabsTrigger value="ram">Memory Usage</TabsTrigger>
            </TabsList>
            <TabsContent value="cpu">
                <Card>
                    <CardHeader>
                        <CardTitle>CPU Usage</CardTitle>
                        <CardDescription>
                            CPU utilization over time
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
                                        return [`${value.toFixed(2)}%`, name];
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name="CPU Usage"
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
                                        return [`${(value / (1024 * 1024)).toFixed(2)} MB`, name];
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
                                    name="Memory Usage"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
