import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import axios from "axios";
import { TestPayload } from "@/types/data";

export async function POST(req: Request) {
    try {
        const { method, port, payload, vus, duration } = await req.json();
        if (!method || !port) {
            return NextResponse.json(
                { message: "Missing required parameters" },
                { status: 400 }
            );
        }

        const PROMETHEUS_URL = "http://localhost:9090/api/v1";
        const scriptPath = "public/scripts/k6-test-template.js";

        const configData: TestPayload = {
            method,
            port,
            payload,
            vus,
            duration,
        };

        const startTime = Math.floor(Date.now() / 1000);

        const k6Process = spawn(
            "k6",
            [
                "run",
                "--out",
                "json=public/scripts/results/output.json",
                scriptPath,
            ],
            {
                env: {
                    ...process.env,
                    METHOD: configData.method,
                    PORT: configData.port.toString(),
                    PAYLOAD: JSON.stringify(configData.payload || {}),
                    VUS: configData.vus.toString(),
                    DURATION: configData.duration.toString(),
                },
            }
        );

        k6Process.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
        });

        return new Promise((resolve) => {
            k6Process.on("close", async () => {
                const endTime = Math.floor(Date.now() / 1000);

                try {
                    await new Promise((jqResolve, jqReject) => {
                        const filterData = spawn("bash", [
                            "-c",
                            `jq -s 'map(select(.metric | IN("http_reqs", "http_req_duration", "http_req_failed"))) 
                            | group_by(.metric) 
                            | map({ (.[0].metric): {metric: .[0].metric, value: null, time: null, tags: null, data: [.[].data | select(.time?)]} }) 
                            | add' public/scripts/results/output.json > public/scripts/results/filtered.json`,
                        ]);

                        filterData.stderr.on("data", (data) => {
                            console.error(`Error: ${data}`);
                        });

                        filterData.on("close", (jqCode) => {
                            if (jqCode === 0) {
                                jqResolve(true);
                            } else {
                                jqReject(
                                    new Error("jq failed to process data")
                                );
                            }
                        });
                    });

                    const rawData = await fs.promises
                        .readFile(
                            "public/scripts/results/filtered.json",
                            "utf-8"
                        )
                        .then((data) => JSON.parse(data));

                    const performance_result = {
                        http_req_duration: rawData.http_req_duration,
                        http_reqs: rawData.http_reqs,
                        http_req_failed: rawData.http_req_failed,
                    };

                    const summary = {
                        res_time: rawData.http_req_duration.data.reduce(
                            (acc: number, curr: { value: number }) =>
                                acc + curr.value,
                            0
                        ),
                        reqs: rawData.http_reqs.data.reduce(
                            (acc: number, curr: { value: number }) =>
                                acc + curr.value,
                            0
                        ),
                        failed_reqs: rawData.http_req_failed.data.reduce(
                            (acc: number, curr: { value: number }) =>
                                acc + curr.value,
                            0
                        ),
                    };

                    // Fetch CPU usage from Prometheus using query_range endpoint
                    const cpuResponse = await axios.get(
                        `${PROMETHEUS_URL}/query_range`, {
                            params: {
                                query: 'process_cpu_seconds_total{job="node"}',
                                start: startTime,
                                end: endTime,
                                step: '1s'  // Step size for data points
                            }
                        }
                    );

                    // Fetch Memory usage from Prometheus
                    const ramResponse = await axios.get(
                        `${PROMETHEUS_URL}/query_range`, {
                            params: {
                                query: 'process_resident_memory_bytes{job="node"}',
                                start: startTime,
                                end: endTime,
                                step: '1s'  // Step size for data points
                            }
                        }
                    );

                    console.dir(cpuResponse.data, { depth: 10000 });
                    console.dir(ramResponse.data, { depth: 10000 });

                    // Process the Prometheus response format
                    const resourceMetrics = {
                        cpu: cpuResponse.data,
                        ram: ramResponse.data,
                    };

                    // Calculate average CPU usage from time series data
                    let avgCpuUsage = 0;
                    if (cpuResponse.data.data.result.length > 0 && 
                        cpuResponse.data.data.result[0].values.length > 0) {
                        const cpuValues = cpuResponse.data.data.result[0].values.map(
                            (item: [number, string]) => parseFloat(item[1])
                        );
                        avgCpuUsage = cpuValues.reduce((sum: number, value: number) => 
                            sum + value, 0) / cpuValues.length;
                    }

                    // Calculate average Memory usage from time series data
                    let avgMemUsage = 0;
                    if (ramResponse.data.data.result.length > 0 && 
                        ramResponse.data.data.result[0].values.length > 0) {
                        const ramValues = ramResponse.data.data.result[0].values.map(
                            (item: [number, string]) => parseFloat(item[1])
                        );
                        avgMemUsage = ramValues.reduce((sum: number, value: number) => 
                            sum + value, 0) / ramValues.length;
                    }

                    resolve(
                        NextResponse.json({
                            meta: { code: 200, message: "Success" },
                            data: {
                                createdAt: Date.now(),
                                results: {
                                    start_time: startTime,
                                    end_time: endTime,
                                    metrics: {
                                        performance: performance_result,
                                        resource: resourceMetrics,
                                    },
                                    summary: {
                                        performance: summary,
                                        resource: {
                                            cpu_usage: avgCpuUsage,
                                            ram_usage: avgMemUsage,
                                        },
                                    },
                                },
                            },
                        })
                    );
                } catch (err) {
                    if (err) {
                        throw new Error("Failed to fetch metrics ");
                    }
                    resolve(
                        NextResponse.json(
                            { message: "Failed to fetch metrics" },
                            { status: 500 }
                        )
                    );
                }
            });
        });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
