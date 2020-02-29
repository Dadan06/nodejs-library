export const toCurrency = (amount: number) =>
    `${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}`;
