import { Currency, MarketTicker, ResponseData } from '../utils/types'

const BASE_URL = 'https://api.pintu.co.id'

export function fetchCurrencies(): Promise<ResponseData<Currency[]>> {
  return fetch(`${BASE_URL}/v2/wallet/supportedCurrencies`).then((res) =>
    res.json()
  )
}

export function fetchMarketTickers(): Promise<ResponseData<MarketTicker[]>> {
  return fetch(`${BASE_URL}/v2/trade/price-changes`).then((res) => res.json())
}
