require('dotenv').config()
const { search } = require('./search')

module.exports.handler = handle

async function handle(event) {
  const [[_, text]] = event.body.split('&')
    .map(pair => pair.split('='))
    .filter(([k]) => k === 'text')
  const query = decodeURIComponent(text)

  const match = await search(query)

  if (!match) {
    return wrapResponse(getErrorMessage(query))
  }

  return wrapResponse(getResponse(query, match))
}

function wrapResponse(body) {
  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}

function getErrorMessage(query) {
  return {
    response_type: 'in_channel',
    text: `Couldn't find a movie called "${query}" :shrug:`
  }
}

function getResponse(query, match) {
  const { id, title, year, contentRating, runtime, description, genre, rating, metascore, poster } = match
  const lines = [
    `*${title}*`,
    description,
    `*Genre${genre.length === 0 ? '' : 's'}*: ${genre}`,
    `*Year*: ${year} *Rated*: ${contentRating} *Runtime*: ${runtime}`,
    `*Rating*: ${rating} *Metascore*: ${metascore}`,
    `*IMDb Link*: https://www.imdb.com/title/${id}`,
    `Not what you intended? See all results: https://www.imdb.com/find?q=${encodeURIComponent(query)}#tt`
  ]

  return {
    response_type: 'in_channel',
    text: lines.join('\n'),
    attachments: [
      { image_url: poster }
    ]
  }
}
