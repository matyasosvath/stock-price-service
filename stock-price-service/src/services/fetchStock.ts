
import axios from "axios";
import logger from "../logger/logger";


const baseURL = 'https://finnhub.io/api/v1';
const apiKey = process.env.API_KEY;
const quoteUrl = '/quote';


async function fetchQuote(symbol: string): Promise<any> {
  try {

    const url = baseURL + quoteUrl + '?' + `symbol=${symbol}&token=${apiKey}`
    const res = await axios.get(url);
    logger.info(`Fetched stock prices for ${symbol}`);
    return res;

  } catch (error) {
    logger.debug(error);
    throw new Error(`Failed to fetch stock price for ${symbol}`);
  }
};

export default fetchQuote;
