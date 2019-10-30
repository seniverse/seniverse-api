
export const compat = (data: {
  results: {
    location: object
    restriction: object
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [result.restriction]
}))
