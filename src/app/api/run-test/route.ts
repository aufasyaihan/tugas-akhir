import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import axios from "axios";
import { TestPayload } from "@/app/types/data";

export async function POST(req: Request) {
    try {
        const { method, port, payload, vus, duration } = await req.json();
        if (!method || !port) {
            return NextResponse.json(
                { message: "Missing required parameters" },
                { status: 400 }
            );
        }

        const NETDATA_URL = "http://localhost:19999/api/v2/data";
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

                    const cpuResponse = await axios.get(
                        `${NETDATA_URL}?scope_contexts=app.cpu_utilization&instances=app.npm_cpu_utilization&format=json&after=${startTime}&before=${endTime}`
                    );
                    const ramResponse = await axios.get(
                        `${NETDATA_URL}?scope_contexts=app.mem_usage&instances=app.npm_mem_usage&format=json&after=${startTime}&before=${endTime}`
                    );

                    const resourceMetrics = {
                        cpu: cpuResponse.data.result,
                        ram: ramResponse.data.result,
                    };

                    const avgCpuUsage =
                        cpuResponse.data.view.dimensions.sts.avg[0];

                    const avgMemUsage =
                        ramResponse.data.view.dimensions.sts.avg[0];

                    resolve(
                        NextResponse.json({
                            meta: { code: 200, message: "Success" },
                            data: {
                                createdAt: Date.now(),
                                results: {
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
                    // console.error(
                    //     "Error fetching Netdata metrics or processing k6 output:",
                    //     err
                    // );
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
        // console.error(error);
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
