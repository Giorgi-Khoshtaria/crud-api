import cluster from "cluster";
import http from "http";
import os from "os";
import app from "./index";
import dotenv from "dotenv";
dotenv.config();
const BASE_PORT = Number(process.env.PORT) || 4000;
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  const workers = [];
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  let currentWorker = 0;
  const loadBalancer = http.createServer((req, res) => {
    const workerPort = BASE_PORT + (currentWorker % numCPUs) + 1;
    currentWorker++;

    const options = {
      hostname: "localhost",
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (workerRes) => {
      const statusCode = workerRes.statusCode ?? 500;
      res.writeHead(statusCode, workerRes.headers);
      workerRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });

    proxy.on("error", (err) => {
      console.error("Proxy error:", err);
      res.writeHead(500);
      res.end("Internal Server Error");
    });
  });

  loadBalancer.listen(BASE_PORT, () => {
    console.log(`Load balancer running on http://localhost:${BASE_PORT}`);
  });

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    const newWorker = cluster.fork(); // Fork a new worker
    workers.push(newWorker);
  });
} else {
  if (cluster.worker) {
    const workerPort = BASE_PORT + cluster.worker.id;
    app.listen(workerPort, () => {
      console.log(
        `Worker ${process.pid} listening on http://localhost:${workerPort}`
      );
    });
  } else {
    console.error("Error: cluster.worker is undefined.");
  }
}
