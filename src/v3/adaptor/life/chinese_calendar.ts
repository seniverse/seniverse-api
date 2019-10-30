
export const compat = (data: {
  results: {
    chinese_calendar: object[]
  }
}) => [
  {
    data: data.results.chinese_calendar
  }
]

export const TTL = 60 * 60
