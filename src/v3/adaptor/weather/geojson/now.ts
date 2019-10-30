
export const compat = (data: {
  urls: {
    rain: string
  }
  last_update: string
}) => [
  {
    data: [
      {
        url: data.urls.rain
      }
    ],
    last_update: data.last_update
  }
]
