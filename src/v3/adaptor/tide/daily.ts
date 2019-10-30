
export const compat = (data: {
  results: {
    location: object
    ports: object[]
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: result.ports,
  last_update: result.last_update
}))
