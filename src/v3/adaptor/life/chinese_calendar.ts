
export const compat = (data: {
  results: {
    chinese_calendar: object[]
  }
}) => [
  {
    data: data.results.chinese_calendar
  }
]
