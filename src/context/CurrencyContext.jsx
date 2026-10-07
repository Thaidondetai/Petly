import { createContext, useState, useContext } from 'react';

export const CurrencyContext = createContext();


const RATES = {
    CLP: 1,
    USD: 0.00105, // Ejemplo: 1 CLP = ~0.00105 USD
    EUR: 0.00096  // Ejemplo: 1 CLP = ~0.00096 EUR
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('CLP');

    const formatPrice = (priceInCLP) => {
        if (priceInCLP === null || priceInCLP === undefined) return '';

        const converted = priceInCLP * RATES[currency];

        return new Intl.NumberFormat(currency === 'CLP' ? 'es-CL' : 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: currency === 'CLP' ? 0 : 2
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
        {children}
        </CurrencyContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrency = () => useContext(CurrencyContext);