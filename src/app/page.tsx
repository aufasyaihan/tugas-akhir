'use client';

import axios from 'axios';
import { useState } from 'react';
import { TestPayload } from './types/data';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    async function runTest() {
        setLoading(true);
        setResult(null);

        const payload: TestPayload = {
            method: "GET",
            port: 3001,
            vus: 10,
            duration: 10
        };

        try {
            const res = await axios.post('api/run-test/', {
                ...payload
            });

            const data = await res.data;
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center p-10">
            <h1 className="text-2xl font-bold mb-4">k6 Load Test</h1>
            <button
                onClick={runTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={loading}
            >
                {loading ? 'Running...' : 'Start Load Test'}
            </button>

            {result && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-800">
                    <h2 className="text-lg font-semibold">Test Results</h2>
                    <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
