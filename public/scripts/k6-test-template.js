import http from "k6/http";
import { check, sleep } from "k6";

const config = {
    url: "localhost",
    method: __ENV.METHOD,
    port: __ENV.PORT,
    payload: __ENV.PAYLOAD,
    vus: __ENV.VUS,
    duration: `${__ENV.DURATION}s`,
    iterations: __ENV.ITERATIONS,
};

export let options = {
    vus: config.vus,
    duration: config.duration,
    iterations: config.iterations,
};

function loadTest() {
    let params = { headers: { "Content-Type": "application/json" } };
    let res;
    try {
        if (config.method === "GET") {
            res = http.get(`http://${config.url}:${config.port}/krs`, params);
        } else {
            res = http[config.method.toLowerCase()](
                `http://${config.url}:${config.port}`,
                JSON.stringify(config.payload),
                params
            );
        }
        check(res, { "status was 200": (r) => r.status === 200 });
        
    } catch (err) {
       throw new Error(err);
    }

    sleep(1);
}

export { loadTest as default };
