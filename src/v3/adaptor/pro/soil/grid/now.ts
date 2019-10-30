
export const compat = (data: {
  results: {
    location: object
    data: object
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [result.data],
  last_update: result.last_update,
}))
