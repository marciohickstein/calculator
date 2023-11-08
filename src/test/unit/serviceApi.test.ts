import ICurrencyAPI from "../../services/ICurrencyAPI";
import APILayer from "../../services/APILayer"; // Import APILayer as a named export

const RATE_TO_TEST = 4.5;

let currencyApi: ICurrencyAPI;
const currencies2Test = ['USD', 'CAD'];

jest.mock("../../services/APILayer", () => {
  return jest.fn(() => ({
    currencyData:  jest.fn(() => Promise.resolve(currencies2Test)),
    getExchangeRate:  jest.fn(() => Promise.resolve(RATE_TO_TEST)),
  }))
})

beforeAll(async () => {
  currencyApi = new APILayer();
});

test('Getting all currencies from API', async () => {
  const currencies: string[] = await currencyApi.currencyData();

  for (const currency of currencies2Test) {
    const currency2Test = currencies.find((c) => c === currency);
    expect(currency2Test).toBe(currency);
  }
});

test('Getting exchange rate from API', async () => {
  for (const currency of currencies2Test) {
    const rate = await currencyApi.getExchangeRate(currency, 'BRL');

    expect(Number(rate)).not.toBeNaN();
    expect(rate).toBeGreaterThan(0);

    expect(rate).toBe(RATE_TO_TEST);
  }
});
