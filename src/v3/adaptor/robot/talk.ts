
export const compat = (data: {
  results: {
    query: string
    location: object
    reply: object
    session: string
  }[]
}) => data.results.map(result => ({
  location: result.location,
  data: [{
    query: result.query,
    reply: result.reply,
    session: result.session
  }]
}))
