import express from "express";
import actuator from "express-actuator";
import cron from "node-cron";

import logger from "./logger/logger";
import {
  storeStockQuote,
  getDistinctSymbols,
  getSymbolInfos,
} from "./services/stockService";

const port = process.env.PORT || 3001;

const app = express();

app.use(actuator());


/**
 * @swagger
 * /stock/{symbol}:
 *   get:
 *     summary: Get stock information by symbol
 *     description: Returns stock information including last updated time, current stock price, and moving average.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "symbol"
 *         in: "path"
 *         description: "Stock symbol to fetch information for"
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             lastUpdatedTime:
 *               type: string
 *               format: date-time
 *               description: Time when the stock information was last updated
 *             currentStockPrice:
 *               type: number
 *               description: Current stock price
 *             movingAverage:
 *               type: number
 *               description: Moving average of the stock price
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 */
app.get("/stock/:symbol", async (req, res) => {

  const { symbol } = req.params;

  try {

    await storeStockQuote(symbol);
    const result = await getSymbolInfos(symbol);

    return res.status(200).json(result);

  } catch (error) {
    logger.debug(error);
    return res
      .status(500)
      .json({ message: `Could not calculate moving average for symbol ${symbol}` });
  }
});

/**
 * @swagger
 * /stock/{symbol}:
 *   put:
 *     summary: Start the periodic checks for a given symbol.
 *     description: Updates stock information in the database for the specified symbol, which will be monitored periodically.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: "symbol"
 *         in: "path"
 *         description: "Stock symbol to monitor"
 *         required: true
 *         type: "string"
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Confirmation message
 *               example: "Company quote fetched. Database updated"
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *               example: "Company quote could not be fetched. Database update failed."
 */
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
  logger.info(`Server is running on http://localhost:${port}`);
});
