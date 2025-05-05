"use client";

import axios from "axios";
import { useState } from "react";
import { TestPayload } from "../types/data";
import Dashboard from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/components/dashboard-loading";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    console.log(result);

    async function runTest() {
        setLoading(true);
        setResult(null);

        const payload: TestPayload = {
            method: "GET",
            port: 3002,
            vus: 10,
            duration: 30,
        };

        try {
            const res = await axios.post("api/run-test/", {
                ...payload,
            });

            const data = await res.data;
            setResult(data);
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container mx-auto">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">
                    Test Performance Dashboard
                </h1>

                <Button
                    variant="default"
                    className="w-fit"
                    onClick={runTest}
                    disabled={loading}
                >
                    Run Test
                </Button>
            </div>
            {loading && <LoadingSkeleton />}
            {result && <Dashboard testResults={result} />}
        </main>
    );
}
