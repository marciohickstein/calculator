import ICurrencyAPI from "../../services/ICurrencyAPI";
import APILayer from "../../services/APILayer";

let currencyApi: ICurrencyAPI;
const currencies2Test = [ 'USD', 'CAD' ];

beforeAll(async () => {
    currencyApi = new APILayer();
})

test('Getting all currencies from API', async () => {
    const currencies: string[] = await currencyApi.currencyData();

    for (const currency of currencies2Test) {
        const currency2Test = currencies.find((c) => {
            if (c === currency) {
                return true;
            }
        })
        expect(currency2Test).toBe(currency);
    }
});

test('Getting exchange rate from API', async () => {
    for (const currency of currencies2Test) {
        const rate = await currencyApi.getExchangeRate(currency, 'BRL');

        expect(Number(rate)).not.toBeNaN();
        expect(rate).toBeGreaterThan(0)

    }
});

