interface ICurrencies {
    [key: string]: string;
}

const currencies: ICurrencies = {
    "BRL": "pt-BR",
    "USD": "us-US",
    "CAD": "us-CA",
}

const DEFAULT_CURRENCY = "BRL";

function getLanguage(currency: string): string {
    let language = currencies[currency];

    if (!language) {
        language = currencies[DEFAULT_CURRENCY];
    }

    return currencies[currency];
}

export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY) {
    const language = getLanguage(currency);

    const valueFormated = value.toLocaleString(language, {
        style: "currency",
        currency: currency
    });

    return valueFormated;
}

export function formatNumber(value: string) {
    console.log(value);
    const number = Number(value.replace(/[^\d,.-]/g, ''));

    return number;
}

export function convertValue(value: number, exchangeRate: number) {
    if (typeof value !== 'number' || typeof exchangeRate !== 'number') {
        return 0;
    }
    
    return value * exchangeRate;
}