
export const compat = (data: {
  results: object[]
}) => data.results.map(result => ({
  location: result,
}))
