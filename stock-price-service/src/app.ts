import express, { Request, Response, NextFunction } from "express";
import actuator from "express-actuator";
import { AxiosResponse } from "axios";
import cron from "node-cron";

import logger from "./logger/logger";
import fetchQuote from "./services/fetchStock";
import {sequelize} from "./model/db";
import { StockPrice } from "./model/stock";

const port = process.env.PORT || 3001;

const app = express();

app.use(actuator());

app.get("/stock/:symbol", async (req, res) => {
  const { symbol } = req.params;
    const response: AxiosResponse<any> = await fetchQuote(symbol);
    const quote = response.data;
    const price = quote['c'];
    const timestamp = quote['t'];
    console.log(`price: ${price}`);
    console.log(`timestamp: ${timestamp}`);
    return res
      .status(200)
      .json(response.data);

  // TODO get all values for this symbol;
  // TODO calculate moving averages
  // TODO update db, add new symbol
  // const lastUpdatedTime = 0;
  // const currentStockPrice = 0;
  // const movingAverage = 0;

  // return res.status(200).json({
  //   lastUpdatedTime: lastUpdatedTime,
  //   currentStockPrice: currentStockPrice,
  //   movingAverage: movingAverage,
  // });
});

app.put("/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const response: AxiosResponse<any> = await fetchQuote(symbol);
    
    const quote = response.data;
    const price = quote['c'];
    console.log(`price: ${price}`);

    await StockPrice.create({symbol: symbol, value: price, dateTime: new Date()});

    // TODO update db, add new symbol
    return res
      .status(200)
      .json({ message: "Company quote fetched. Database updated" });
  } catch (error) {
    logger.debug(error);
    return res
      .status(500)
      .json({ message: "Company quote could not be fetched and database could be updated."});
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

// cron.schedule("* * * * *", async () => {
//   // TODO get all distinct symbols in an array
//   const symbols = ["AAPL"];

//   for (const symbol of symbols) {
//     const res = await fetchQuote(symbol);
//     // TODO update db for a given symbol

//     logger.info(`Collecting quotes for the ${symbol} companies.`);
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
