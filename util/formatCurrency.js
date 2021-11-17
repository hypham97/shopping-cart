const formatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "EUR",
})

export default function formatCurrency(amount) {
  return formatter.format(amount)
}
