
export const compat = (data: {
  urls: {
    rain: object
  }
  last_update: string
}) => [
  {
    data: [
      Object.keys(data.urls.rain).map(key => ({
        time: key,
        url: data.urls.rain[key]
      }))
    ],
    last_update: data.last_update
  }
]
