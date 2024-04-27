import express, { Request, Response } from "express";
import actuator from "express-actuator";
import cron from "node-cron";

import logger from "./logger/logger";
import { storeStockQuote, getDistinctSymbols } from "./services/stockService";

const port = process.env.PORT || 3001;

const app = express();

app.use(actuator());

app.get("/stock/:symbol", async (req, res) => {
  try {
    // TODO get all values for this symbol;
    // TODO calculate moving averages
    // TODO update db, add new symbol

    const { symbol } = req.params;

    const lastUpdatedTime = 0;
    const currentStockPrice = 0;
    const movingAverage = 0;

    return res.status(200).json({
      lastUpdatedTime: lastUpdatedTime,
      currentStockPrice: currentStockPrice,
      movingAverage: movingAverage,
    });
  } catch (error) {
    logger.debug(error);
    return res
      .status(500)
      .json({ message: "Could not calculate averages for quotes." });
  }
});

app.put("/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    storeStockQuote(symbol);
    return res
      .status(200)
      .json({ message: "Company quote fetched. Database updated" });
  } catch (error) {
    logger.debug(error);
    return res.status(500).json({
      message: "Company quote could not be fetched. Database update failed.",
    });
  }
});

cron.schedule("* * * * *", async () => {
  const symbols = await getDistinctSymbols();
  for (const symbol of symbols) {
    await storeStockQuote(symbol);
    logger.info(`Collecting quotes for the ${symbol} companies.`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
