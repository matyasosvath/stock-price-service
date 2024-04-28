import {
  calculateMovingAverage, 
  getDistinctSymbols, 
  getDataForSymbol,
  getSymbolInfos
} from './stockService';
import StockPrice from "../model/stock";

jest.mock("sequelize", () => {
  const mSequelize = {
    sync: jest.fn(),
    transaction: jest.fn()
  };

  return { Sequelize: jest.fn(() => mSequelize) };
});

jest.mock("pg", () => ({
  Client: jest.fn(() => ({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  })),
}));

jest.mock("../model/stock", () => {
  const mockStockPrice = {}
  return { StockPrice: jest.fn(() => mockStockPrice)};
});

const testData: any[] = [
  {id: 1, symbol: 'AAPL', dateTime: new Date(2000, 1, 1), value: 10 },
  {id: 2, symbol: 'AAPL', dateTime: new Date(2000, 1, 2), value: 11 },
  {id: 3, symbol: 'AAPL', dateTime: new Date(2000, 1, 3), value: 12 },
  {id: 4, symbol: 'AAPL', dateTime: new Date(2000, 1, 4), value: 13 },
  {id: 5, symbol: 'AAPL', dateTime: new Date(2000, 1, 5), value: 14 },
  {id: 6, symbol: 'AAPL', dateTime: new Date(2000, 1, 6), value: 15 },
  {id: 7, symbol: 'AAPL', dateTime: new Date(2000, 1, 7), value: 16 },
  {id: 8, symbol: 'AAPL', dateTime: new Date(2000, 1, 8), value: 17 },
  {id: 9, symbol: 'AAPL', dateTime: new Date(2000, 1, 9), value: 18 },
  {id: 10, symbol: 'AAPL', dateTime: new Date(2000, 1, 10), value: 19 },
];

describe('Testing stock service functions', () => {

   it('getDistinctSymbols returns correct symbols', async () => {

    const mockData = [{"symbol": "test"}, {"symbol": "test 1"}]
    const mockFindAll = jest.fn().mockReturnValue(Promise.resolve(mockData));
    StockPrice.findAll = mockFindAll;

    const expected = ['test', 'test 1'];

    const result = await getDistinctSymbols();

    expect(result).toStrictEqual(expected);
  });

   it('getDataForSymbol returns correct data', async () => {

    const mockData = [
      {symbol: "test", value: 10}, 
      {symbol: "test", value: 11}
    ]
    const mockFindAll = jest.fn().mockReturnValue(Promise.resolve(mockData));
    StockPrice.findAll = mockFindAll;

    const expected = [
      {symbol: "test", value: 10}, 
      {symbol: "test", value: 11}
    ]

    const result = await getDataForSymbol('test', 3);

    expect(result).toStrictEqual(expected);
  });

  it('getSymbolInfos returns correct result', async () => {

    const mockFindAll = jest.fn().mockReturnValue(Promise.resolve(testData));
    StockPrice.findAll = mockFindAll;

    const result = await getSymbolInfos('AAPL');

    expect(result.lastUpdatedTime).toEqual(testData[0].dateTime);
    expect(result.currentStockPrice).toEqual(testData[0].value);
    expect(result.movingAverage).toEqual(14.5);
  });

});

describe('Testing stock service calculations', () => {
  it('returns 0 if data is empty', () => {
    expect(calculateMovingAverage([])).toBe(0);
  });

  it('calculates moving average correctly with default window size', () => {
    expect(calculateMovingAverage(testData)).toBe(14.5);
  });

  it('throws an error if there is not enough data points', () => {
    const data = [{ symbol: 'test',dateTime: new Date(2000,1,1), value: 10 }];
    expect(() => calculateMovingAverage(data)).toThrow(
      'Not enough data points to calculate moving average'
    );
  });
});
