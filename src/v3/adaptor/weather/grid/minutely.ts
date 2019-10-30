
export const compat = (data: {
  results: {
    location: object
    text: string
    precipitation: number[]
    last_update: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [
    {
      text: result.text,
      precipitation: result.precipitation,
    }
  ],
  last_update: result.last_update
}))
