
export const compat = (data: {
  results: {
    location: object
    moon: object[]
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.moon
}))

export const TTL = 60 * 60
