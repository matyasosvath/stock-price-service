import express, { Request, Response, NextFunction } from "express";
import actuator from "express-actuator";
import { AxiosResponse } from "axios";
import cron from "node-cron";

import logger from "./logger/logger";
import fetchCompanyProfile from "./services/fetchStock";
import {sequelize} from "./model/db";
import { StockPrice } from "./model/stock";

const port = process.env.PORT || 3001;

const app = express();

app.use(actuator());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Content-Type", "application/json");
  next();
});

app.get("/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
  // TODO get all values for this symbol;
  // TODO calculate moving averages
  const lastUpdatedTime = 0;
  const currentStockPrice = 0;
  const movingAverage = 0;

  return res.status(200).json({
    lastUpdatedTime: lastUpdatedTime,
    currentStockPrice: currentStockPrice,
    movingAverage: movingAverage,
  });
});

app.put("/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const response: AxiosResponse<any> = await fetchCompanyProfile(symbol);
    // TODO update db, add new symbol
    return res
      .status(200)
      .json({ message: "Company profile fetched. Database updated" });
  } catch (error) {
    logger.debug(error);
    return res
      .status(500)
      .json({ message: "Company profile could not be updated" });
  }
});

app.get('/symbols', async (req: Request, res: Response) => {
  try {
    // console.log(sequelize);
    // console.log("sequelize");
    const symbols = await StockPrice.findAll();
    res.json({ symbols: symbols });
  } catch (error) {
    logger.error('Error fetching distinct symbols:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

cron.schedule("* * * * *", async () => {
  // TODO get all distinct symbols in an array
  const symbols = ["AAPL"];

  for (const symbol of symbols) {
    const res = await fetchCompanyProfile(symbol);
    // TODO update db for a given symbol

    logger.info(`Collecting company profile data for ${symbol}`);
    logger.info(res.data);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
