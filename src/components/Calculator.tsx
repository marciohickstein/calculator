import { useEffect, useState } from "react";
import APILayer from "../services/APILayer";
import { formatCurrency, convertValue } from "../utils/money";
import ICurrencyAPI from "../services/ICurrencyAPI";

const DEFAULT_CURRENCY = "USD";
const layer: ICurrencyAPI = new APILayer();

function Calculator() {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [currentValue, setCurrentValue] = useState<number>(0);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (target) => {
        console.log(target.select())
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const inputStyle = {
        // border: isFocused ? '2px solid #007bff' : '1px solid #ccc',
        // backgroundColor: isFocused ? '#f0f8ff' : 'white',
      };
    
    async function changeExchangeRate(selectedOption: string) {
        const rate = await layer.getExchangeRate(selectedOption, 'BRL');

        if (typeof rate !== 'number' && rate <= 0) {
            setExchangeRate(-1);
            return;
        }

        setExchangeRate(rate);
    }

    function changeCurrentValue(value: number) {
        setCurrentValue(value);
    }

    async function getCurrencies() {
        const currencies = await layer.currencyData();

        if (Array.isArray(currencies) && currencies.length > 0) {
            setCurrencies(currencies);
        }
    }

    useEffect(() => {
        (async () => {
            await getCurrencies();
            changeExchangeRate(DEFAULT_CURRENCY);
        })()
    }, [])

    return (
        <>
            <p><small>Valor enviado do exterior</small></p>
            <div className="row">
                <div className="col-3">
                    <select id="currencies" defaultChecked={true} onChange={(event) => changeExchangeRate(event.target.value)} className="form-select" aria-label="Default select example">
                        <option key={0} value={DEFAULT_CURRENCY}>{DEFAULT_CURRENCY}</option>
                        {
                            currencies.length > 0 && Object.values(currencies).map((currency, index) => (
                                <option key={index + 1} value={currency}>{currency}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="col-9">
                    <input style={inputStyle} onFocus={(e) => handleFocus(e.target)} onBlur={handleBlur} onChange={(event) => changeCurrentValue(Number(event?.target.value))} type="text" className="form-control" id="inputValue" value={currentValue} />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-6">
                    <p className="text-start">Cotação agora</p>
                </div>

                <div className="col-5">
                    <p id="rate" className="text-end">{exchangeRate}</p>
                </div>

                <div className="col-1">
                    <span className="badge text-bg-dark">?</span>
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-3">
                    <p className="text-start">Tipo</p>
                </div>

                <div className="col-9">
                    <select className="form-select" aria-label="Default select example">
                        <option value="1">Serviços de computação</option>
                        <option value="2">Serviços de hardware</option>
                    </select>
                </div>
            </div>

            <hr />
            <div className="row">
                <p><small>Valor que chega na sua conta corrente</small></p>


            </div>
            <div className="row">
                <div className="col-3">
                    <select className="form-select" aria-label="Default select example">
                        <option value="BRL">BRL</option>
                    </select>
                </div>
                <div className="col-9">
                    <input readOnly type="text" className="form-control" id="convertedValue" value={formatCurrency(convertValue(currentValue, exchangeRate))} placeholder="" />
                </div>
            </div>
        </>
    )
}

export default Calculator;