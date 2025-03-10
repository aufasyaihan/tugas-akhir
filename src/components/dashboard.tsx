import { TestResult } from "@/types/data";
import PerformanceCharts from "./charts/performanceCharts";
import ResourceCharts from "./charts/resourceCharts";

export default function Dashboard({
    testResults,
}: {
    testResults: TestResult;
}) {
    return (
        <div className="flex flex-col gap-8 p-6">
            <h1 className="text-3xl font-bold">Test Performance Dashboard</h1>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Performance Metrics
                    </h2>
                    <PerformanceCharts
                        data={testResults.data.results.metrics.performance}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Resource Usage
                    </h2>
                    <ResourceCharts
                        data={testResults.data.results.metrics.resource}
                    />
                </div>
            </div>
        </div>
    );
}
