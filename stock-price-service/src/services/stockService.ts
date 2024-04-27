import { AxiosResponse } from "axios";

import logger from "../logger/logger";
import fetchQuote from "./fetchStock";
import { StockPrice } from "../model/stock";

async function storeStockQuote(symbol: string): Promise<void> {
  try {
    const res: AxiosResponse<any> = await fetchQuote(symbol);
    const quote = res.data;
    const price = quote["c"];

    await StockPrice.create({
      symbol: symbol,
      value: price,
      dateTime: new Date(),
    });

    // TODO transaction commit

  } catch (error) {
    logger.error(`Error saving stock quote for ${symbol}`, error);
    throw new Error();
  }
}

async function getDistinctSymbols(): Promise<string[]> {

  const rows = await StockPrice.findAll({
    attributes: ["symbol"],
    group: ["symbol"],
    raw: true,
  });

  const symbols = rows.map((value: any) => value["symbol"]);
  return symbols;
}

async function getDataForSymbol(
  symbol: string,
  limit: number = 10
): Promise<StockPrice[]> {
  const rows = await StockPrice.findAll({
    where: {
      symbol: symbol,
    },
    order: [["dateTime", "DESC"]],
    limit: limit,
  });

  return rows;
}

async function getSymbolInfos(symbol: string): Promise<any> {

  const data = await getDataForSymbol(symbol);

  let result = {
    lastUpdatedTime: null,
    currentStockPrice: null,
    movingAverage: null,
  };

  if (data.length === 0) {
    return result;
  }

  result.lastUpdatedTime = data[0].dateTime;
  result.currentStockPrice = data[0].value;
  result.movingAverage = calculateMovingAverage(data);

  return result;
}

function calculateMovingAverage(
  data: StockPrice[],
  windowSize: number = 10
): number {

  if (data.length === 0) {
    return 0;
  }

  if (data.length < windowSize) {
    throw new Error("Not enough data points to calculate moving average");
  }

  let sum = 0;
  for (let i = 0; i < windowSize; i++) {
    sum += data[i].value;
  }

  const result = sum / windowSize;

  return parseFloat(result.toFixed(3));
}

export { storeStockQuote, getDistinctSymbols, getSymbolInfos };
