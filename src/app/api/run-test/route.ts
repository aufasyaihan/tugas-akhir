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

        // Timestamp sebelum menjalankan k6
        const startTime = Math.floor(Date.now() / 1000);

        // **Tulis file konfigurasi untuk k6**
        const configData: TestPayload = {
            method,
            port,
            payload,
            vus,
            duration,
        };

        // **Jalankan k6**
        const k6Process = spawn(
            "k6",
            ["run", "--out", "json=public/scripts/results/output.json", scriptPath],
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
        console.log("Running k6 test...");

        k6Process.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
        });

        return new Promise((resolve) => {
            k6Process.on("close", async (code) => {
                console.log(`k6 exited with code ${code}`);

                // Timestamp setelah k6 selesai
                const endTime = Math.floor(Date.now() / 1000);

                try {
                    // **Menjalankan `jq` untuk memfilter hasil**
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
                            console.log(`jq exited with code ${jqCode}`);
                            if (jqCode === 0) {
                                jqResolve(true);
                            } else {
                                jqReject(
                                    new Error("jq failed to process data")
                                );
                            }
                        });
                    });

                    // **Baca file hasil filtering**
                    const rawData = await fs.promises
                        .readFile("public/scripts/results/filtered.json", "utf-8")
                        .then((data) => JSON.parse(data));

                    // const jsonLines = rawData
                    //     .trim()
                    //     .split("\n")
                    //     .map((line) => JSON.parse(line));

                    // // Ambil objek pertama sebagai metadata utama
                    // const mainMeta = jsonLines.shift();

                    // Format hasil
                    const formattedJson = {
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

                    // Simpan ke file baru
                    // fs.writeFileSync(
                    //     "public/scripts/k6-result.json",
                    //     JSON.stringify(formattedJson, null, 2)
                    // );

                    console.log("Filtering and processing completed!");

                    // **Ambil CPU & RAM dari Netdata**
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

                    console.log(
                        "start : ",
                        new Date(startTime * 1000).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                        })
                    );
                    console.log(
                        "end : ",
                        new Date(endTime * 1000).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                        })
                    );

                    // **Kirim response sebagai JSON**
                    resolve(
                        NextResponse.json({
                            meta: { code: 200, message: "Success" },
                            data: {
                                createdAt: Date.now(),
                                results: {
                                    metrics: {
                                        performance: formattedJson,
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
                    console.error(
                        "Error fetching Netdata metrics or processing k6 output:",
                        err
                    );
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
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
