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
    logger.error("Error saving stock quote:", error);
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

export { storeStockQuote, getDistinctSymbols };
