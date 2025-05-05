export interface TestResult {
    meta: { code: number; message: string };
    data: {
        createdAt: number;
        results: Results;
    };
}

export interface PayloadData {
    nim: string;
    kode_matakuliah: string;
    mata_kuliah: string;
    semester: string;
    tahun_akademik: string;
}

export interface TestPayload {
    method: string;
    port: number;
    payload?: PayloadData;
    vus: number;
    duration: number;
    iterations?: number;
}

export interface PerformanceMetrics {
    http_req_duration: Metrics;
    http_req_failed: Metrics;
    http_reqs: Metrics;
}

export interface Metrics {
    metric: string;
    value: number;
    time: number | string;
    tags: number | string;
    data: Data[];
}

export interface Data {
    time: string;
    value: number;
    tags: Tags;
}

export interface Tags {
    expected_response: string;
    group: string;
    method: string;
    name: string;
    proto: string;
    scenario: string;
    status: string;
    url: string;
}

export interface ResourceMetrics {
    cpu: PrometheusData;
    ram: PrometheusData;
}

// Prometheus data structure
export interface PrometheusData {
    status: string;
    data: {
        resultType: string;
        result: PrometheusResult[];
    };
}

export interface PrometheusResult {
    metric: {
        [key: string]: string;
        job: string;
        instance: string;
    };
    values: [number, string][]; // [timestamp, value]
}

// Keeping old type for compatibility
export interface ResourceData {
    labels: string[];
    data: number[][];
}

export interface Summary {
    performance: Performance;
    resource: Resource;
}

export interface Performance {
    res_time: number;
    reqs: number;
    failed_reqs: number;
}

export interface Resource {
    cpu_usage: number;
    ram_usage: number;
}

export interface Results {
    start_time: number;
    end_time: number;
    metrics: {
        performance: PerformanceMetrics;
        resource: ResourceMetrics;
    };
    summary: Summary;
}
