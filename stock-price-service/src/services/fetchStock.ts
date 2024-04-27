
import axios from "axios";
import logger from "../logger/logger";


const baseURL = 'https://finnhub.io/api/v1/';
const apiKey = process.env.API_KEY;
const companyProfile = '/stock/profile';


const fetchCompanyProfile = async (symbol: string): Promise<any> => {
  try {

    const url = baseURL + companyProfile + '?' + `symbol=${symbol}&token=${apiKey}`
    const res = await axios.get(url);
    logger.info(`Fetched stock prices for ${symbol}`);
    logger.info(`Data for ${symbol}`);
    // logger.info(res.data);
    return res;

  } catch (error) {
    logger.debug(error);
    throw new Error(`Failed to fetch stock price for ${symbol}`);
  }
};

export default fetchCompanyProfile;
