import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import InlineSVG from 'react-inlinesvg'

import { fetchCurrencies, fetchMarketTickers } from '../services/api'
import { ThemeColor } from '../utils/constants'
import { formatNumber } from '../utils/currency'
import { Currency } from '../utils/types'

function PriceText({ value }: { value: number }) {
  return (
    <div className="p-5 text-ink-primary font-semibold">
      Rp {formatNumber(value)}
    </div>
  )
}

function CurrencyColumn({ currency }: { currency: Currency }) {
  return (
    <div className="flex flex-row items-center">
      <InlineSVG
        src={currency.logo}
        color={currency.color}
        height={32}
        width={32}
        uniquifyIDs
      />
      <div className="flex flex-row flex-1 flex-wrap items-center">
        <p className="flex-1 font-semibold text-ink-primary ml-6">
          {currency.name}
        </p>
        <p className="text-ink-tertiary mx-6 w-14">{currency.currencySymbol}</p>
      </div>
    </div>
  )
}

function PricePercentage({ percentage }: { percentage: number }) {
  if (!isFinite(percentage)) return null // Hide `N/A` on chart

  let triangle: React.ReactNode
  let sign = ''

  if (isFinite(percentage)) {
    if (percentage > 0) {
      triangle = <div style={{ color: ThemeColor.light.success }}>△</div>
    } else if (percentage < 0) {
      triangle = <div style={{ color: ThemeColor.light.danger }}>▽</div>
    }
  }

  let textColor = ThemeColor.ink.tertiary
  if (isFinite(percentage)) {
    if (percentage > 0) {
      textColor = ThemeColor.light.success
    } else if (percentage < 0) {
      textColor = ThemeColor.light.danger
    }
  }

  return (
    <div className="flex flex-row">
      {triangle}&nbsp;
      <p style={{ color: textColor }}>
        {isFinite(percentage)
          ? `${sign}${Math.abs(percentage).toFixed(2)}%`
          : 'N/A'}
      </p>
    </div>
  )
}

const currencyIntervals = ['day', 'week', 'month', 'year'] as const

function PricePercentageByInterval({
  currencyGroup,
  interval,
}: {
  currencyGroup: string
  interval: typeof currencyIntervals[number]
}) {
  const { data, isLoading } = useQueryMarketTicker(currencyGroup)
  const percentage = data?.[interval]

  return !isLoading ? <PricePercentage percentage={Number(percentage)} /> : null
}

function getPairFromCurrencyGroup(currencyGroup: string) {
  return `${currencyGroup.toLowerCase()}/idr`
}

const marketTickerInterval = 1000 * 1 // 1 second

function useQueryMarketTicker(currencyGroup: string) {
  return useQuery(['marketTickers'], fetchMarketTickers, {
    cacheTime: marketTickerInterval,
    staleTime: marketTickerInterval,
    refetchInterval: marketTickerInterval,
    select: (data) =>
      data?.payload?.find(
        (i) => i.pair === getPairFromCurrencyGroup(currencyGroup)
      ),
  })
}

export function MarketTableRow({ currency }: { currency: Currency }) {
  const { currencyGroup, currencySymbol } = currency
  const { data } = useQueryMarketTicker(currencyGroup)

  return (
    <tr className="items-center text-label16">
      <td className="border-l border-b">
        <Link
          className="block p-5"
          passHref
          href={`/market/${currencySymbol.toLowerCase()}`}
        >
          <CurrencyColumn currency={currency} />
        </Link>
      </td>
      <td className="w-[220px] border-b">
        <PriceText value={Number(data?.latestPrice)} />
      </td>
      {currencyIntervals.map((interval, index) => {
        return (
          <td key={index} className="p-2 font-semibold border-b">
            <PricePercentageByInterval
              currencyGroup={currencyGroup}
              interval={interval}
            />
          </td>
        )
      })}
    </tr>
  )
}

export default function Home() {
  const { data: currencies = [] } = useQuery(['currencies'], fetchCurrencies, {
    select: (data) =>
      (data?.payload ?? []).filter(
        (currency) => currency.currencyGroup !== 'IDR' // remove first index, contains weird idr price
      ),
  })

  return (
    <table
      className="overflow-x-auto w-full border-separate"
      cellSpacing={0}
      cellPadding={0}
    >
      <tbody>
        {currencies.map((currency) => (
          <MarketTableRow key={currency.currencyGroup} currency={currency} />
        ))}
      </tbody>
    </table>
  )
}
