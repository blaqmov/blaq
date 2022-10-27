export type Wallet = {
  currencyGroup: string
  tokenSymbol: string
  decimal_point: number
  tokenType: string
  blockchain: string
  explorer: string
  listingDate: string
  blockchainName: string
  logo: string
}

export type Currency = {
  currencyGroup: string
  color: string
  currencySymbol: string
  name: string
  logo: string
  decimal_point: number
  listingDate: string
  wallets: Wallet[]
}

export type ResponseData<T> = {
  code: string
  message: string
  payload: T
}

export type MarketTicker = {
  pair: string
  latestPrice: string
  day: string
  week: string
  month: string
  year: string
}
