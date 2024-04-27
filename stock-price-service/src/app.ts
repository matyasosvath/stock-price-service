import express, { Request, Response, NextFunction } from "express";
import actuator from "express-actuator";
import { AxiosResponse } from "axios";
import cron from 'node-cron';

import logger from "./logger/logger";
import fetchStockPrice from "./services/fetchStock";


const port = process.env.PORT || 3001;

const app = express();

app.use(actuator());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Content-Type", "application/json");
  next();
});


app.get("/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const response: AxiosResponse<any> = await fetchStockPrice(symbol);
  return res.status(200).json(response.data);
});


cron.schedule('* * * * *', async () => {

  const symbols = ['AAPL', 'MSFT', 'GOOGL'];

  for (const symbol of symbols) {

    const res = await fetchStockPrice(symbol);

    logger.info(`Collecting ${symbol}`);
    logger.info(res.data);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
