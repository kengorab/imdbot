require('dotenv').config()
const { search } = require('./search')

module.exports.handler = async function handle(event) {
  const [[_, query]] = event.body.split('&')
    .map(pair => pair.split('='))
    .filter(([k]) => k === 'text')

  const match = await search(decodeURIComponent(query))

  if (!match) {
    return getErrorMessage(query)
  }

  return getResponse(match)
}

function getErrorMessage(query) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      response_type: 'in_channel',
      text: `Couldn't find a movie called "${query}" :shrug:`
    })
  }
}

function getResponse(match) {
  const { id, title, year, contentRating, runtime, description, genre, rating, metascore, poster } = match
  const lines = [
    `*${title}*`,
    description,
    `*Genre${genre.length === 0 ? '' : 's'}*: ${genre}`,
    `*Year*: ${year} *Rated*: ${contentRating} *Runtime*: ${runtime}`,
    `*Rating*: ${rating} *Metascore*: ${metascore}`,
    `https://www.imdb.com/title/${id}`
  ]

  return {
    statusCode: 200,
    body: JSON.stringify({
      response_type: 'in_channel',
      text: lines.join('\n'),
      attachments: [
        { image_url: poster }
      ]
    })
  }
}
