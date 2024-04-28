import axios from "axios";
import fetchQuote from "./fetchStock";
import logger from "../logger/logger";

jest.mock("../logger/logger", () => ({
  info: jest.fn(),
  debug: jest.fn(),
}));

describe("fetchQuote", () => {

  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;

    process.env.API_KEY = "your_mocked_api_key";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("fetches stock quote successfully", async () => {
    const mockSymbol = "AAPL";
    const mockResponse = { data: { symbol: mockSymbol, price: 150 } };

    jest.spyOn(axios, "get").mockResolvedValueOnce(mockResponse);

    const result = await fetchQuote(mockSymbol);

    expect(axios.get).toHaveBeenCalledWith(`https://finnhub.io/api/v1/quote?symbol=${mockSymbol}&token=undefined`);

    expect(logger.info).toHaveBeenCalledWith(`Fetched stock prices for ${mockSymbol}`);

    expect(result).toEqual(mockResponse);
  });

  it("throws an error when failed to fetch stock quote", async () => {
    const mockSymbol = "AAPL";
    const errorMessage = "Failed to fetch stock price for AAPL";

    jest.spyOn(axios, "get").mockRejectedValueOnce(new Error("Failed to fetch data"));

    await expect(fetchQuote(mockSymbol)).rejects.toThrowError(errorMessage);

    expect(logger.debug).toHaveBeenCalledWith(expect.any(Error));
  });
});
