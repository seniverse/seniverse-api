
export const compat = (data: {
  results: object[]
}) => data.results.map(result => ({
  data: [
    {
      location: result
    }
  ]
}))

export const TTL = 100 * 60
