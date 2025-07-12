import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 200, // 200 virtual users
  duration: "60s", // run for 60 seconds
};

export default function () {
  // Randomly decide to POST or GET
  const isPost = Math.random() < 0.5;

  if (isPost) {
    const payload = JSON.stringify({
      message: `Load test from ${__VU}-${__ITER}`,
      user: `user-${__VU}-${__ITER}`, // unique for each VU and iteration
      timestamp: Date.now(), // more randomness
    });

    const headers = { "Content-Type": "application/json" };

    const res = http.post("http://localhost:8080/jobs", payload, { headers });
    check(res, { "POST status is 200": (r) => r.status === 200 });
  } else {
    // Generate random UUID safely
    const id = `${__VU}-${__ITER}-${Math.floor(Math.random() * 100000)}`;
    const res = http.get(`http://localhost:8080/jobs/${id}`);
    check(res, {
      "GET status is 200/404": (r) => r.status === 200 || r.status === 404,
    });
  }

  sleep(1); // simulate user pause
}
