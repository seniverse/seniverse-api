
export const compat = (data: {
  results: {
    location: object
    sun: object[]
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.sun
}))

export const TTL = 60 * 60
