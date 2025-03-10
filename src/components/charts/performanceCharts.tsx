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
import { formatTime } from "@/lib/utils";
import { PerformanceMetrics } from "@/types/data";

export default function PerformanceCharts ({ data }: { data: PerformanceMetrics }) {
  if (!data) return <div>No performance data available</div>;

  return (
      <Tabs defaultValue="duration" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="duration">Request Duration</TabsTrigger>
              <TabsTrigger value="failed">Failed Requests</TabsTrigger>
              <TabsTrigger value="requests">Request Count</TabsTrigger>
          </TabsList>

          <TabsContent value="duration">
              <Card>
                  <CardHeader>
                      <CardTitle>HTTP Request Duration</CardTitle>
                      <CardDescription>
                          Average time taken for requests (milliseconds)
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                              data={data.http_req_duration.data}
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
                                  formatter={(value: number) => [
                                      `${value.toFixed(2)} ms`,
                                      "Duration",
                                  ]}
                              />
                              <Legend />
                              <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#8884d8"
                                  strokeWidth={2}
                                  dot={false}
                                  activeDot={{ r: 8 }}
                                  name="Request Duration"
                              />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="failed">
              <Card>
                  <CardHeader>
                      <CardTitle>HTTP Request Failures</CardTitle>
                      <CardDescription>
                          Rate of failed requests (%)
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                              data={data.http_req_failed.data}
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
                                  formatter={(value: number) => [
                                      `${(value * 100).toFixed(2)}%`,
                                      "Failure Rate",
                                  ]}
                              />
                              <Legend />
                              <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#ff0000"
                                  strokeWidth={2}
                                  dot={false}
                                  activeDot={{ r: 8 }}
                                  name="Failure Rate"
                              />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="requests">
              <Card>
                  <CardHeader>
                      <CardTitle>HTTP Requests</CardTitle>
                      <CardDescription>
                          Number of requests per second
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                              data={data.http_reqs.data}
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
                                  formatter={(value: number) => [
                                      `${value.toFixed(2)} reqs/sec`,
                                      "Request Rate",
                                  ]}
                              />
                              <Legend />
                              <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#82ca9d"
                                  strokeWidth={2}
                                  dot={false}
                                  activeDot={{ r: 8 }}
                                  name="Request Rate"
                              />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs>
  );
};