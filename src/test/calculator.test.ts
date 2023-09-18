const puppeteer = require('puppeteer');

const TIMEOUT2LOAD   = 1000;
const TIMEOUT2TYPE   = 500;
const TIMEOUT2SELECT = 1000;

let browser: any;
let page: any;

const normalizeNumber = (number: number | string) => {
    if (typeof number === 'number') {
        let numberNormalized = String(number);

        numberNormalized = Number(numberNormalized).toFixed(2);

        return numberNormalized;
    } else {
        let numberNormalized = String(number);

        numberNormalized = numberNormalized.replace('R$', '');
        numberNormalized = numberNormalized.replace('.', '');
        numberNormalized = numberNormalized.replace(',', '.');
        numberNormalized = Number(numberNormalized).toFixed(2);
    
        return numberNormalized;
    }
}

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        args: [
            '--disable-web-security', // Desabilita a política Same-Origin (CORS).
            '--disable-features=IsolateOrigins,site-per-process', // Desabilita recursos relacionados à política Same-Origin (CORS).
        ],
    });
    page = await browser.newPage();
});

afterAll(async () => {
    await browser.close();
});

test('Should render the React app checking fields from the page', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForTimeout(TIMEOUT2LOAD);

    const fields = [ 'inputValue', 'convertedValue', 'rate' ];

    for (let i = 0; i < fields.length; i++) {
        const selector = fields[i];
        
        // Check if the element exists on the page
        const element = await page.$(`#${selector}`);
    
        expect(element).not.toBeNull();
        expect(element).not.toBeUndefined();
    }
});

test('Should convert values from $7.500 (USD) to R$ correctly', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    
    // Test 1, check if the value converted is correct
    const valueInDolar = '7500';
    
    await page.type('#inputValue', valueInDolar);
    
    await page.waitForTimeout(TIMEOUT2TYPE);

    // Use page.$eval para obter o valor de um campo com base em seu seletor CSS.
    let convertedValue = await page.$eval('#convertedValue', (element: any) => {
        return element.value; // Isso retorna o valor atual do campo.
    });

    // Use page.evaluate() para obter o valor de um elemento <p> com base em seu seletor CSS.
    const rate = await page.evaluate(() => {
        const paragrafo: any = document.querySelector('p.text-end');
        return paragrafo.textContent; // Isso retorna o texto dentro do elemento <p>.
    });

    let numberNormalized = normalizeNumber(convertedValue);

    let valueInReal = normalizeNumber(+valueInDolar * rate);

    expect(numberNormalized).toBe(valueInReal);
});

test('Should convert values from $10.000,00 (CAD) to R$ correctly', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForTimeout(TIMEOUT2LOAD);

    const selectElement = await page.$('#currencies'); // Replace with the appropriate selector

    if (selectElement) {
      await selectElement.select('CAD'); // Replace 'option2' with the value of the option you want to select
      await page.waitForTimeout(TIMEOUT2SELECT * 2);
    
      // Test 1, check if the value converted is correct
      const valueInDolar = '10000';
  
      await page.type('#inputValue', valueInDolar);
  
      await page.waitForTimeout(TIMEOUT2TYPE);

      // Use page.$eval para obter o valor de um campo com base em seu seletor CSS.
      let convertedValue = await page.$eval('#convertedValue', (element: any) => {
          return element.value; // Isso retorna o valor atual do campo.
      });
  
      // Use page.evaluate() para obter o valor de um elemento <p> com base em seu seletor CSS.
      const rate = await page.evaluate(() => {
          const paragrafo:any  = document.querySelector('p.text-end');
          return paragrafo.textContent; // Isso retorna o texto dentro do elemento <p>.
      });
  
      let valueInReal = normalizeNumber(+valueInDolar * rate);
      expect(normalizeNumber(convertedValue)).toBe(valueInReal);
  
    } else {
      console.error('Select element not found.');
      expect(true).toBe(false);
    }

});

