import http from "http";
import express from "express";
import actuator from "express-actuator";
// import { DefaultMetricsCollectorConfiguration } from 'express-prom-bundle';

const origins = process.env.ALLOWED_ORIGINGS;
const port = process.env.PORT || 3001;

const app = express();
const httpServer = http.createServer();

app.use(actuator());

// const bundle = promBundle({
//   buckets: [0.1, 0.4, 0.7, 1, 2, 5, 10],
//   includeMethod: true,
//   includePath: true,
//   customLabels: { date: null },
//   transformLabels: (labels) =>
//     Object.assign(labels => {
//       date: new Date();
//     }),
//   metricsPath: "/metrics",
//   promClient: { collectDefaultMetrics: {} },
// });

// const config: DefaultMetricsCollectorConfiguration<typeof app> = { app: app};
// app.use(promBundle(config));

// app.use(bundle);
app.use(express.urlencoded({ extended: true }));

httpServer.listen(port, () => {
  console.log(`Stock price service is listening on ${port}`);
});

app.get("/info", (req, res) => {
  const message = {
    version: "0.0.1",
  };
  res.json(message);
});
