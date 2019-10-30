
export const compat = (data: {
  results: {
    location: object
    data: object[]
    last_update: string
  }[]
}) => data.results
