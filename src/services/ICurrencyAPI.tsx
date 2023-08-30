interface ICurrencyAPI {
    currencyData(): Promise<string[]>;
    // Get the most recent exchange rate data.
    getExchangeRate(fromCurrency:string, toCurrency:string): Promise<number> ;
}

export default ICurrencyAPI;