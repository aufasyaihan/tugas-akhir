export interface TestResult {
    meta: { code: 200; message: "Success" };
    data: {
        createdAt: number;
        result: {
            res_time: number;
            req_s: number;
            throughput: number;
            error_rate: number;
            resource: {
                cpu_usage: number;
                ram_usage: number;
            };
        };
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
}
