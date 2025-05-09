import { TestResult } from "@/types/data";
import PerformanceCharts from "./charts/performanceCharts";
import ResourceCharts from "./charts/resourceCharts";

export default function Dashboard({
    testResults,
}: {
    testResults: TestResult;
}) {
    return (
        <div className="flex flex-col gap-8 py-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Performance Metrics
                    </h2>
                    <PerformanceCharts
                        data={testResults.data.results}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Resource Usage
                    </h2>
                    <ResourceCharts
                        data={testResults.data.results}
                    />
                </div>
            </div>
        </div>
    );
}
