export const CurrencyFormatter = (amount: number, x: number) => {
  return amount
    .toFixed(Math.max(0, ~~x))
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    .split('.')[0]
}
