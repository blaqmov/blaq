import BigNumber from 'bignumber.js'

BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_FLOOR,
  FORMAT: {
    groupSize: 3,
    fractionGroupSize: 6,
    groupSeparator: '.',
    decimalSeparator: ',',
  },
})

export function formatNumber(amountInNumber: number, decimalPoint = 0) {
  return new BigNumber(amountInNumber || 0).dp(decimalPoint).toFormat()
}
