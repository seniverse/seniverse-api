
export const compat = (data: {
  results: {
    location: object
    now_grid: object
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [result.now_grid],
  last_update: result.last_update,
}))
