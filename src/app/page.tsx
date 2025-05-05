"use client";

import axios from "axios";
import { useState } from "react";
import { TestPayload } from "../types/data";
import Dashboard from "@/components/dashboard";
import LoadingSkeleton from "@/components/dashboard-loading";
import { TestForm } from "@/components/test-form";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    async function runTest(payload: TestPayload) {
        setLoading(true);
        setResult(null);

        try {
            const res = await axios.post("api/run-test/", {
                ...payload,
            });

            const data = await res.data;
            setResult(data);
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
                <TestForm onSubmit={runTest} loading={loading} />
            </div>
            {loading && <LoadingSkeleton />}
            {result && <Dashboard testResults={result} />}
        </main>
    );
}
