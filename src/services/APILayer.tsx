import axios from 'axios';
import ICurrencyAPI from './ICurrencyAPI';

const APY_KEY = 'fR5OsTrSgWcDRXICKfcPd6gyzEo4lbuI';

const CONFIG: any = {
    headers: {
        'apikey': `${APY_KEY}`, // You can specify the header name and value here
        'Custom-Header': 'Custom-Value' // You can add more custom headers if needed
    }
};

class APILayer implements ICurrencyAPI{

    // A full list of supported currencies can be accessed both in JSON Format.
    async currencyData(): Promise<string[]> {
        try {
            const response = await axios.get("https://api.apilayer.com/currency_data/list", CONFIG);
            const data = response.data;

            if (data.error || !data.success) {
                console.error('Error converting currency:', data.error.info ? data.error.info : 'transation returned unsuccessfully');
                return [];
            } else {
                return Object.keys(data.currencies);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    // Get the most recent exchange rate data.
    async getExchangeRate(fromCurrency:string, toCurrency:string): Promise<number> {
        try {
            const response = await axios.get(`https://api.apilayer.com/currency_data/live?source=${fromCurrency}&currencies=${toCurrency}`, CONFIG);
            const data = response.data;

            if (data.error || !data.success) {
                console.error('Error getting exchange rate:', data.error.info ? data.error.info : 'transation returned unsuccessfully');
                return -1;
            } 

            const result = data.quotes[`${fromCurrency}${toCurrency}`];

          return result;
        } catch (error) {
            console.error('Error fetching data:', error);
            return -1;
        }
    }
}

export default APILayer;
