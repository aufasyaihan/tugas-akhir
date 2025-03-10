'use client';

import axios from 'axios';
import { useState } from 'react';
import { TestPayload } from '../types/data';
import Dashboard from '@/components/dashboard';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    console.log(result);
    

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
        <main className="container mx-auto">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={runTest}
            >
                Run Test
            </button>
            {loading && <p>Loading...</p>}
            {result && <Dashboard testResults={result} />}
        </main>
      );
}
