
import axios from "axios";
import logger from "../logger/logger";


const apiKey = process.env.API_KEY;

const fetchStockPrice = async (symbol: string): Promise<any> => {
  try {
    const res = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`
    );
    return res;
  } catch (error) {
    logger.debug(error);
    throw new Error("Failed to fetch stock price");
  }
};

export default fetchStockPrice;