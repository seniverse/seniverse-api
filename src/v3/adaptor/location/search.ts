
export const compat = (data: {
  results: object[]
}) => data.results.map(result => ({
  location: result,
}))

export const TTL = 100 * 60
